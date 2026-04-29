// Edge Function: iagentek-storage-presign
//
// Genera presigned URLs para operar el bucket de MinIO sin exponer credenciales
// al cliente. Cada request requiere JWT valido (Supabase Auth); la funcion
// extrae user_id del JWT y obliga a que `key` empiece con `users/<user_id>/`,
// asi un user no puede leer/escribir el namespace de otro.
//
// API:
//   POST /functions/v1/iagentek-storage-presign
//   Authorization: Bearer <user_jwt>
//   Body: { action: "upload" | "delete" | "list", key?, prefix?, contentType? }
//
//   action=upload  -> { url: presigned PUT, method: "PUT" }
//   action=delete  -> { url: presigned DELETE, method: "DELETE" }
//   action=list    -> { objects: [{ key, size, lastModified, etag }] }
//
// El bucket tiene policy `download` (anonymous GetObject), entonces para leer
// un objeto el cliente hace GET directo a `${ENDPOINT}/${BUCKET}/${KEY}`,
// sin pasar por esta funcion.

// @ts-ignore - Deno runtime imports
import { serve } from 'https://deno.land/std@0.177.1/http/server.ts'
// @ts-ignore - Deno runtime imports
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts'
// @ts-ignore - Deno runtime imports
import { AwsClient } from 'https://esm.sh/aws4fetch@1.0.18'

// @ts-ignore - Deno global
const env = Deno.env

const JWT_SECRET = env.get('JWT_SECRET')!
const MINIO_ENDPOINT = env.get('MINIO_ENDPOINT') || 'https://iagentekminioback.iagentek.com.mx'
const MINIO_ACCESS_KEY = env.get('MINIO_ACCESS_KEY')!
const MINIO_SECRET_KEY = env.get('MINIO_SECRET_KEY')!
const MINIO_BUCKET = env.get('MINIO_BUCKET') || 'iagentek-designsystem-assets'

const PRESIGN_EXPIRES_SECONDS = 600 // 10 min

const aws = new AwsClient({
  accessKeyId: MINIO_ACCESS_KEY,
  secretAccessKey: MINIO_SECRET_KEY,
  region: 'us-east-1',
  service: 's3',
})

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

async function getUserIdFromJWT(req: Request): Promise<string> {
  const auth = req.headers.get('authorization') || ''
  const [scheme, token] = auth.split(' ')
  if (scheme !== 'Bearer' || !token) throw new Error('Missing Bearer token')
  const secret = new TextEncoder().encode(JWT_SECRET)
  const { payload } = await jose.jwtVerify(token, secret)
  if (typeof payload.sub !== 'string') throw new Error('JWT has no sub')
  return payload.sub
}

function assertOwnNamespace(path: string, userId: string) {
  // path debe empezar con users/<userId>/  — sin "..", sin barras dobles.
  if (path.includes('..')) throw new Error('Invalid key: contains ..')
  if (path.includes('//')) throw new Error('Invalid key: double slash')
  const expected = `users/${userId}/`
  if (!path.startsWith(expected)) throw new Error(`Access denied: key must start with ${expected}`)
}

async function presignPut(key: string, contentType?: string): Promise<string> {
  const url = new URL(`${MINIO_ENDPOINT}/${MINIO_BUCKET}/${key}`)
  url.searchParams.set('X-Amz-Expires', String(PRESIGN_EXPIRES_SECONDS))
  const req = new Request(url.toString(), {
    method: 'PUT',
    headers: contentType ? { 'content-type': contentType } : undefined,
  })
  const signed = await aws.sign(req, { aws: { signQuery: true } })
  return signed.url
}

async function presignDelete(key: string): Promise<string> {
  const url = new URL(`${MINIO_ENDPOINT}/${MINIO_BUCKET}/${key}`)
  url.searchParams.set('X-Amz-Expires', String(PRESIGN_EXPIRES_SECONDS))
  const req = new Request(url.toString(), { method: 'DELETE' })
  const signed = await aws.sign(req, { aws: { signQuery: true } })
  return signed.url
}

async function listObjects(prefix: string) {
  const url = new URL(`${MINIO_ENDPOINT}/${MINIO_BUCKET}`)
  url.searchParams.set('list-type', '2')
  url.searchParams.set('prefix', prefix)
  url.searchParams.set('max-keys', '1000')
  const res = await aws.fetch(url.toString())
  if (!res.ok) throw new Error(`List failed: HTTP ${res.status}`)
  const xml = await res.text()
  // Parser minimal: extrae <Contents>...</Contents>
  const objects: Array<{ key: string; size: number; lastModified: string; etag: string }> = []
  const matches = xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)
  for (const m of matches) {
    const block = m[1]
    const key = (block.match(/<Key>([^<]+)<\/Key>/)?.[1]) || ''
    const size = parseInt(block.match(/<Size>(\d+)<\/Size>/)?.[1] || '0', 10)
    const lastModified = (block.match(/<LastModified>([^<]+)<\/LastModified>/)?.[1]) || ''
    const etag = (block.match(/<ETag>"?([^"<]+)"?<\/ETag>/)?.[1]) || ''
    objects.push({ key, size, lastModified, etag })
  }
  return objects
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  let userId: string
  try {
    userId = await getUserIdFromJWT(req)
  } catch (e) {
    return jsonResponse({ error: 'Unauthorized', detail: (e as Error).message }, 401)
  }

  let body: { action?: string; key?: string; prefix?: string; contentType?: string }
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  try {
    switch (body.action) {
      case 'upload': {
        if (!body.key) return jsonResponse({ error: 'key required' }, 400)
        assertOwnNamespace(body.key, userId)
        const url = await presignPut(body.key, body.contentType)
        return jsonResponse({ url, method: 'PUT' })
      }
      case 'delete': {
        if (!body.key) return jsonResponse({ error: 'key required' }, 400)
        assertOwnNamespace(body.key, userId)
        const url = await presignDelete(body.key)
        return jsonResponse({ url, method: 'DELETE' })
      }
      case 'list': {
        if (!body.prefix) return jsonResponse({ error: 'prefix required' }, 400)
        assertOwnNamespace(body.prefix, userId)
        const objects = await listObjects(body.prefix)
        return jsonResponse({ objects })
      }
      default:
        return jsonResponse({ error: 'Invalid action; expected upload|delete|list' }, 400)
    }
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 400)
  }
})
