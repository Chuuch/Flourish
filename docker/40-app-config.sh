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

API_ORIGIN=$(printf '%s' "${APP_API_URL}" | cut -d/ -f1-3)

SENTRY_CONNECT=""
if [ -n "${APP_SENTRY_DSN:-}" ]; then
  SENTRY_CONNECT=" https://*.ingest.sentry.io https://*.sentry.io"
fi


printf 'add_header Content-Security-Policy "%s" always;\n' \
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${API_ORIGIN}${SENTRY_CONNECT}; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" \
  > /etc/nginx/snippets/csp.conf

echo "app-config: APP_ENV=${APP_ENV} APP_API_URL=${APP_API_URL} API_ORIGIN=${API_ORIGIN}"
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

API_ORIGIN=$(printf '%s' "${APP_API_URL}" | cut -d/ -f1-3)

SENTRY_CONNECT=""
if [ -n "${APP_SENTRY_DSN:-}" ]; then
  SENTRY_CONNECT=" https://*.ingest.sentry.io https://*.sentry.io"
fi


printf 'add_header Content-Security-Policy "%s" always;\n' \
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${API_ORIGIN}${SENTRY_CONNECT}; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" \
  > /etc/nginx/snippets/csp.conf

echo "app-config: APP_ENV=${APP_ENV} APP_API_URL=${APP_API_URL} API_ORIGIN=${API_ORIGIN}"
