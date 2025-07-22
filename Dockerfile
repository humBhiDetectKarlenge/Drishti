# 1. Install dependencies and build app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source files
COPY . .

# Build Next.js app
RUN npm run build

# 2. Production image with only required files
FROM node:22-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/gcp-storage-key.json ./gcp-storage-key.json

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
