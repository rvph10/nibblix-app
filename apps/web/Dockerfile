FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
FROM base AS deps
# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy package.json files from all workspaces
COPY apps/web/package.json ./apps/web/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

# Copy the entire eslint-config package as it's needed during installation
COPY packages/eslint-config ./packages/eslint-config
COPY packages/typescript-config ./packages/typescript-config

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Development stage
FROM deps AS development

# Create non-root user and set proper permissions
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app

COPY . .

# Switch to non-root user
USER nextjs

# Set proper environment for Next.js development
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
EXPOSE 3000

CMD ["pnpm", "--filter", "web", "dev"]