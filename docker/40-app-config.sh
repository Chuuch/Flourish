#!/bin/sh
set -eu

: "${APP_API_URL:?APP_API_URL is required}"
: "${APP_ENV:=production}"

cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = Object.freeze({
  API_URL: "${APP_API_URL}",
  APP_ENV: "${APP_ENV}"
});
EOF

echo "app-config: APP_ENV=${APP_ENV} APP_API_URL=${APP_API_URL}"
