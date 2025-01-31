# File: apps/api/Dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
FROM base AS deps
# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy package.json files from all workspaces
COPY apps/api/package.json ./apps/api/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

# Copy the entire eslint-config package as it's needed during installation
COPY packages/eslint-config ./packages/eslint-config
COPY packages/typescript-config ./packages/typescript-config

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Development stage
FROM deps AS development
COPY . .
CMD ["pnpm", "--filter", "api", "dev"]