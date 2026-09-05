# ------- Stage 1: build ----------
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN HUSKY=0 npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_APP_ENV=production
ENV VITE_API_URL=${VITE_API_URL} \
  VITE_APP_ENV=${VITE_APP_ENV}

RUN npm run build

# ------ Stage 2: server ----
FROM nginxinc/nginx-unprivileged:1.28-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
