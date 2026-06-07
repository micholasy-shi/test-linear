# NovaClaw Docker Image
# Multi-stage build for optimal size and performance

# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies (prefer npm when package-lock.json exists)
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; else npm ci; fi

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    tini \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1001 -S novaclaw && \
    adduser -S novaclaw -u 1001 -G novaclaw

# Set working directory
WORKDIR /app

# Copy built application (all deps are bundled, no node_modules needed)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ui ./ui
COPY --from=builder /app/package.json ./package.json

# Copy configuration template
COPY novaclaw.yml ./novaclaw.yml.template

# Create necessary directories
RUN mkdir -p /app/workspace /app/skills /app/logs && \
    chown -R novaclaw:novaclaw /app

# Switch to non-root user
USER novaclaw

# Environment variables
ENV NODE_ENV=production
ENV NOVACLAW_PORT=3000
ENV NOVACLAW_BIND=0.0.0.0
ENV NOVACLAW_WORKSPACE=/app/workspace
ENV NOVACLAW_SKILLS_DIR=/app/skills
ENV NOVACLAW_LOG_LEVEL=info

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${NOVACLAW_PORT}/health || exit 1

# Expose port
EXPOSE 3000

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]

# Start command
CMD ["node", "dist/index.js"]

# Labels
LABEL org.opencontainers.image.title="NovaClaw"
LABEL org.opencontainers.image.description="Lightweight high-performance AI gateway system"
LABEL org.opencontainers.image.source="https://github.com/novaclaw/novaclaw"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.licenses="MIT"