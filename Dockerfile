# Stage 1: Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .
RUN bun build ./src/index.ts --outdir ./build --target bun

# Stage 2: Production stage
FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

# Remove the prepare script and install only production dependencies
RUN sed -i '/prepare/d' package.json && \
    bun install --production --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["bun", "run", "build/index.js"]