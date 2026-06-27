# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Prisma engines require OpenSSL at runtime on Alpine.
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Prisma engines require OpenSSL at runtime on Alpine.
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

# Copy package files and install only production deps
COPY package*.json ./
COPY prisma ./prisma/
COPY scripts ./scripts/
RUN npm ci --only=production && npx prisma generate

# Copy built files
COPY --from=builder /app/dist ./dist

# Set correct permissions
RUN chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 4000

ENV NODE_ENV=production

# Entrypoint with migration and seed
COPY --chown=nodeuser:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

CMD ["sh", "docker-entrypoint.sh"]
