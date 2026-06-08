#syntax=docker/dockerfile:1.4
#https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY next.config.js ./
COPY headers.js ./
COPY tsconfig.json ./
COPY package.json yarn.lock ./
COPY --from=deps /app/node_modules ./node_modules

COPY components ./components
COPY contexts ./contexts
COPY data ./data
COPY hooks ./hooks
COPY pages ./pages
COPY styles ./styles
COPY types ./types
COPY utils ./utils
COPY public ./public

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  addgroup --system --gid 1002 nodejs; \
  adduser --system --uid 1002 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=1002:1002 /app/.next/standalone ./
COPY --from=builder --chown=1002:1002 /app/.next/static ./.next/static

USER nextjs

ENV PORT=3005

EXPOSE 3005

CMD ["node", "server.js"]