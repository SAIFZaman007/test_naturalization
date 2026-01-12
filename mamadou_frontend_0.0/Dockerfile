# ---- build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Update npm (optional)
RUN npm install -g npm@latest 

# Install deps
COPY package.json package-lock.json ./ 
RUN npm ci --no-audit --no-fund

# Copy sources
COPY . .

# Build production
RUN npm run build

# ---- production stage ----
FROM nginx:stable-alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config (uncomment if you add nginx.conf in repo)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Lightweight healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- --timeout=2 http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
