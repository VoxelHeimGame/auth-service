# Stage 1: Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy only package.json and lockfile to leverage caching
COPY package.json bun.lockb* ./

# Install all dependencies (including devDependencies)
RUN bun install --frozen-lockfile

# Copy source files
COPY src ./src
COPY tsconfig.json ./

# Build the application
RUN bun build ./src/index.ts --outfile ./build/index.js --target bun

# Stage 2: Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy only the compiled executable
COPY --from=builder /app/build/index.js ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Update the health check to use curl instead of nc
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Run the compiled application
CMD ["bun", "run", "index.js"]