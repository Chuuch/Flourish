#!/bin/sh
set -eu

: "${APP_API_URL:?APP_API_URL is required}"
: "${APP_ENV:=production}"

SENTRY_DSN_JSON="undefined"
if [ -n "${APP_SENTRY_DSN:-}" ]; then
  SENTRY_DSN_JSON="\"${APP_SENTRY_DSN}\""
fi

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = Object.freeze({
  API_URL: "${APP_API_URL}",
  APP_ENV: "${APP_ENV}",
  SENTRY_DSN: ${SENTRY_DSN_JSON}
});
EOF

echo "app-config: APP_ENV=${APP_ENV} APP_API_URL=${APP_API_URL}"
