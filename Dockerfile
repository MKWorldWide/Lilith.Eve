# 🧬 Lilith.Eve Docker Configuration
# Multi-stage build for optimized production deployment

# ============================================================================
# BUILD STAGE
# ============================================================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    && npm install -g npm@latest

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY docs/ ./docs/

# Build the application
RUN npm run build

# ============================================================================
# PRODUCTION STAGE
# ============================================================================
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S lilith -u 1001

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    dumb-init \
    && npm install -g npm@latest

# Copy built application from builder stage
COPY --from=builder --chown=lilith:nodejs /app/dist ./dist
COPY --from=builder --chown=lilith:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=lilith:nodejs /app/package*.json ./

# Copy configuration files
COPY --chown=lilith:nodejs docker-entrypoint.sh ./
COPY --chown=lilith:nodejs .env.example ./

# Set proper permissions
RUN chmod +x docker-entrypoint.sh && \
    chown -R lilith:nodejs /app

# Switch to non-root user
USER lilith

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node dist/health-check.js || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["./docker-entrypoint.sh"]

# ============================================================================
# DEVELOPMENT STAGE
# ============================================================================
FROM node:18-alpine AS development

# Set working directory
WORKDIR /app

# Install development dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    && npm install -g npm@latest nodemon

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# ============================================================================
# TESTING STAGE
# ============================================================================
FROM node:18-alpine AS testing

# Set working directory
WORKDIR /app

# Install testing dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    && npm install -g npm@latest

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code and tests
COPY . .

# Run tests
CMD ["npm", "test"] 