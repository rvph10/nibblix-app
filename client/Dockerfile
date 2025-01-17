# Base stage for dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY client/package*.json client/
COPY shared/package*.json shared/
COPY shared/tsconfig.json shared/

# Install dependencies
WORKDIR /app/shared
RUN npm ci

WORKDIR /app/client
RUN npm ci

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/client/node_modules client/node_modules/
COPY --from=deps /app/shared/node_modules shared/node_modules/

# Copy source files
COPY client client/
COPY shared shared/

# Build shared package first
WORKDIR /app/shared
RUN npm run build

# Build client
WORKDIR /app/client
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Copy necessary files from builder
COPY --from=builder /app/client/.next/standalone ./
COPY --from=builder /app/client/.next/static ./.next/static
COPY --from=builder /app/client/public ./public
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/node_modules ./shared/node_modules
COPY --from=builder /app/shared/package.json ./shared/package.json

EXPOSE 3000

CMD ["node", "server.js"]