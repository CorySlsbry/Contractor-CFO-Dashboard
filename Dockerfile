# syntax=docker/dockerfile:1
# Next.js 14 standalone -> Cloud Run
# Multi-stage build for small final image.
#
# IMPORTANT: Next.js inlines every `NEXT_PUBLIC_*` env var into the
# client bundle at BUILD TIME. If these aren't passed as build args
# below, the browser bundle will have `undefined` for SUPABASE_URL /
# ANON_KEY and sign-in will silently fail in the client. Runtime env
# vars on Cloud Run do NOT fix this — the value is baked into .js
# files during `next build`.
#
# On Cloud Build, pass them via substitutions, e.g.:
#   gcloud builds submit --substitutions=\
#     _NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co,\
#     _NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...,\
#     _NEXT_PUBLIC_APP_URL=https://topbuildercfo.com,\
#     _NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
# and have cloudbuild.yaml forward them as --build-arg.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

FROM node:24-alpine AS builder
WORKDIR /app

# Build-time public env vars (baked into client bundle)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
EXPOSE 8080

CMD ["node", "server.js"]
