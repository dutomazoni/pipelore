# Dockerfile
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
  build-essential python3 pkg-config libsqlite3-dev curl --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Ensure npm compiles native modules rather than using prebuilt binaries
ENV npm_config_build_from_source=true
# (optional extra env for npm v9+ sometimes needed)
ENV npm_config_build_from_source_better_sqlite3=true
ENV DATABASE_URL=file:./prisma/dev.db
# Copy package files + prisma for caching
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install all deps (dev + prod) — will build from source
RUN npm ci --unsafe-perm

# Copy source
COPY . .

# Ensure native module compiled (extra safeguard)
RUN npm rebuild better-sqlite3 --build-from-source || true

# Build project (your script runs prisma generate && tsc per package.json)
RUN npm run build
RUN npm run copy:generated

# Production stage
FROM node:20-bullseye-slim AS production
WORKDIR /app

# Copy package metadata if needed
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
# copy prisma.config.ts (important for prisma migrate deploy)
COPY --from=builder /app/prisma.config.ts ./
# Copy runtime files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV DATABASE_URL=file:./prisma/dev.db
ENV PORT=4000
EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node ./dist/server.js"]
