# Flourish e2e (Playwright)

Thin smoke suite against a real local API + Vite. Vitest already covers forms with MSW — these journeys catch API contract drift.

## Prerequisites

1. **Gorest API** running on the URL in `VITE_API_URL` (default `http://localhost:8080/api/v1`)
2. Migrations applied
3. Seed data (from the Gorest repo):

```bash
# After an org named "Zyntera" exists with an owner (register once in the UI), then:
go run ./cmd/seed -force
```

Default seed credentials (password `password12` unless you passed `-password`):

| Role   | Email                   |
| ------ | ----------------------- |
| Staff  | `admin@zyntera.seed`    |
| Portal | `portal@northwind.seed` |

## Run

```bash
# API already up; Vite starts via Playwright webServer
npm run test:e2e

# Interactive
npm run test:e2e:ui
```

## Env

| Variable              | Default                 | Purpose                                          |
| --------------------- | ----------------------- | ------------------------------------------------ |
| `E2E_BASE_URL`        | `http://localhost:5173` | Flourish origin (must be an allowed CORS origin) |
| `E2E_EMAIL`           | `admin@zyntera.seed`    | Staff login                                      |
| `E2E_PASSWORD`        | `password12`            | Staff (and portal)                               |
| `E2E_PORTAL_EMAIL`    | `portal@northwind.seed` | Portal login                                     |
| `E2E_PORTAL_PASSWORD` | same as `E2E_PASSWORD`  | Portal password                                  |

Ensure Flourish `.env` has `VITE_API_URL` pointing at that API before `npm run test:e2e`.

## Specs

- `staff-login.spec.ts` — sign in → Clients nav
- `create-client.spec.ts` — add client → appears in list
- `portal-ticket.spec.ts` — portal sign in → submit ticket
