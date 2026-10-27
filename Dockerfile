# Multi-stage production Dockerfile for Next.js 16 standalone storefront
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@12.11.2 --activate
WORKDIR /app

# Step 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Step 2: Build the Next.js standalone application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build-time settings. NEXT_PUBLIC_* are inlined into the browser bundle, and the
# build prerenders catalog pages, so it needs a reachable Medusa (see deploy guide).
ARG API_ADAPTER=medusa
ARG API_BASE_URL
ARG MEDUSA_PUBLISHABLE_KEY
ARG MEDUSA_REGION_ID
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_BRAND_NAME=Bramhkanti
ARG NEXT_PUBLIC_DEFAULT_LOCALE=en-IN
ARG NEXT_PUBLIC_DEFAULT_CURRENCY=INR
ARG NEXT_PUBLIC_SUPPORT_EMAIL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_FSSAI_LICENSE_NUMBER
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_SENTRY_DSN
ARG BUILD_VERSION
ENV API_ADAPTER=$API_ADAPTER \
    API_BASE_URL=$API_BASE_URL \
    MEDUSA_PUBLISHABLE_KEY=$MEDUSA_PUBLISHABLE_KEY \
    MEDUSA_REGION_ID=$MEDUSA_REGION_ID \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_BRAND_NAME=$NEXT_PUBLIC_BRAND_NAME \
    NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE \
    NEXT_PUBLIC_DEFAULT_CURRENCY=$NEXT_PUBLIC_DEFAULT_CURRENCY \
    NEXT_PUBLIC_SUPPORT_EMAIL=$NEXT_PUBLIC_SUPPORT_EMAIL \
    NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_FSSAI_LICENSE_NUMBER=$NEXT_PUBLIC_FSSAI_LICENSE_NUMBER \
    NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    BUILD_VERSION=$BUILD_VERSION

RUN pnpm build

# Step 3: Production runner (unprivileged user, minimal footprint ~150MB)
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: Create non-root system group and user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set up runtime directories
RUN mkdir -p .next public
RUN chown -R nextjs:nodejs .next public

# Copy standalone build and static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Standalone output does not include public/ (logo, home page images, fonts).
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# Operational health probe via existing /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Graceful termination signal
STOPSIGNAL SIGTERM

CMD ["node", "server.js"]
