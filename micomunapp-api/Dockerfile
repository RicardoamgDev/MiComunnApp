# ======================
# Stage 1: Development
# ======================
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# ======================
# Stage 2: Build
# ======================
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Remove dev dependencies for a leaner production image
RUN npm ci --only=production && npm cache clean --force

# ======================
# Stage 3: Production
# ======================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=build --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /usr/src/app/package.json ./package.json

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
