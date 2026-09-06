# ------- Stage 1: build ----------
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN HUSKY=0 npm ci

COPY . .

ARG VITE_APP_RELEASE
ENV VITE_APP_RELEASE=${VITE_APP_RELEASE}

ARG SENTRY_ORG
ARG SENTRY_PROJECT
ENV SENTRY_ORG=${SENTRY_ORG} \
    SENTRY_PROJECT=${SENTRY_PROJECT}

RUN --mount=type=secret,id=sentry_auth_token \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/sentry_auth_token 2>/dev/null || true)" \
    npm run build

# ------ Stage 2: server ----
FROM nginxinc/nginx-unprivileged:1.31-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --chmod=755 docker/40-app-config.sh /docker-entrypoint.d/40-app-config.sh
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
