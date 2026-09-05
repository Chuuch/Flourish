# Flourish

Production-grade React SPA: TypeScript, Vite, React Router, TanStack Query, Zod, Tailwind.
Shipped as a Docker image (Nginx, non-root) behind Traefik. CI builds, tests and publishes on every merge.

## Requirements

- Node 24 (.nvmrc — use nvm use)
- npm 11+
- Docker (for the container stack)

## Quick start

cp .env.example .env
npm ci
npm run dev # http://localhost:5173

## Scripts

| Command               | Purpose                                            |
| --------------------- | -------------------------------------------------- |
| npm run dev           | Vite dev server with HMR                           |
| npm run check         | typecheck + lint + format + test + build (CI gate) |
| npm run test          | Vitest, single run                                 |
| npm run test:watch    | Vitest in watch mode                               |
| npm run test:coverage | Coverage report                                    |
| npm run lint:fix      | ESLint with autofix                                |
| npm run format        | Prettier, write                                    |
| npm run build         | Production build to dist/                          |

Git hooks (husky): pre-commit runs lint-staged; pre-push runs typecheck, lint and tests.

## Environment

Validated at startup by src/config/env.ts (Zod). Missing or invalid values fail fast.

| Variable     | Description                                  |
| ------------ | -------------------------------------------- |
| VITE_API_URL | Base URL of the backend API                  |
| VITE_APP_ENV | development \| test \| staging \| production |

VITE_* values are baked in at build time. The Docker image receives them as build args.

## Project structure

src/
├── app/
│ ├── layouts/ # RootLayout (header, nav, <Outlet/>)
│ ├── providers/ # QueryProvider, AppProviders
│ └── router/ # routes.tsx (route table), router.tsx, paths.ts
├── components/
│ └── feedback/ # ErrorBoundary, RouteErrorBoundary, NotFound, PageLoader
├── config/ # env.ts — runtime config validation
├── features/ # one folder per business domain
│ └── users/
│ ├── api/ # fetch functions (users.api.ts), query keys + queryOptions
│ ├── components/ # feature-scoped UI
│ ├── hooks/ # useUsers, useCreateUser
│ ├── pages/ # route entry points
│ ├── schemas/ # Zod schemas — the single source of types
│ └── index.ts # public API of the feature
├── lib/
│ ├── api/ # axios client, http.* (schema-validated requests), ApiError
│ └── logger/ # logger abstraction
└── test/ # MSW server, renderWithProviders, factories

### Conventions

- _Features are vertical slices._ Import from @/features/<name> only; never reach into a feature's internals.
- _Every API response is validated._ Use http.get(url, schema) etc. Types derive from schemas, not the reverse.
- _Query keys come from the feature's key factory_ (userKeys). Mutations invalidate through it.
- _Routes are lazy_ (lazy: in routes.tsx) and URLs come from paths.ts.
- _Tests exercise real behaviour_ through MSW handlers; no mocking of hooks or the HTTP client.

## Testing

Vitest + Testing Library + MSW. src/test/setup.ts starts an MSW server with onUnhandledRequest: 'error', so any request without a handler fails the test. Use renderWithProviders for components that need TanStack Query, and src/test/factories for fixtures.

## Docker

Multi-stage build: node:24-alpine builds, nginx-unprivileged serves dist/ on port 8080 as non-root.
Nginx config in docker/: SPA fallback, immutable caching for hashed assets, security headers, /healthz.

docker compose up --build -d # Traefik :80 → web; dashboard on :8080
curl -H "Host: flourish.localhost" http://localhost/healthz
docker compose down

Standalone image:

docker build --build-arg VITE_API_URL=https://api.example.com -t flourish-web .
docker run --rm -p 3000:8080 flourish-web

## CI/CD

.github/workflows/ci.yml:

1. check — npm run check on every PR and push to dev`/main`.
2. image — builds the Docker image on PRs; on pushes to dev`/main` publishes to
   ghcr.io/chuuch/flourish tagged sha-<commit>, <branch>, and latest (main only).

VITE_API_URL for the image comes from the repository variable of the same name.
Dependabot opens weekly grouped update PRs against dev.

## Branching

feature/* | fix/* | chore/* ──PR──▶ dev ──PR──▶ main

- Branch from dev, PR back into dev. main only receives dev.
- Both branches are protected: PR required, CI must pass, up to date with base.
- Commit messages follow Conventional Commits (feat:, fix:, chore:, ci:, docs:, refactor:).
- Run npm run check before pushing.
