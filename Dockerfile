# ─── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite build-args inyectados por docker build --build-arg
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_MINIO_ENDPOINT
ARG VITE_MINIO_BUCKET

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_MINIO_ENDPOINT=$VITE_MINIO_ENDPOINT
ENV VITE_MINIO_BUCKET=$VITE_MINIO_BUCKET

RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
