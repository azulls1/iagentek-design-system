/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 52817,
    strictPort: true,
    proxy: {
      // Proxy Supabase Auth
      '/auth': {
        target: 'https://iagenteksupabase.iagentek.com.mx',
        changeOrigin: true,
        secure: true,
      },
      // Proxy Supabase REST (PostgREST)
      '/rest': {
        target: 'https://iagenteksupabase.iagentek.com.mx',
        changeOrigin: true,
        secure: true,
      },
      // Proxy Supabase pg-meta
      '/pg': {
        target: 'https://iagenteksupabase.iagentek.com.mx',
        changeOrigin: true,
        secure: true,
      },
      // Proxy Supabase Edge Functions
      '/functions': {
        target: 'https://iagenteksupabase.iagentek.com.mx',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
