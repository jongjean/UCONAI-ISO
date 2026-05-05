# Development Standard

This repository follows the ISO HP governance rules in `docs/01_PROJECT_GOVERNANCE.md`.

## Before Editing

- Keep ISO independent from other UCONAI projects.
- Do not import 150 example project data.
- Do not commit secrets.
- Do not create DB schemas, services, Caddy changes or deploy artifacts during source-only development.

## Source Layout

| Path | Purpose |
|---|---|
| `frontend` | React/Vite app |
| `backend` | Express API |
| `ai-services` | Prompt registry and AI contracts |
| `infra` | HP operating policies |
| `docs` | Product and engineering specifications |
| `tests` | Test plans and future automated tests |

## Quality Gates

Before handing off a change:

1. Check syntax for touched backend files.
2. Keep frontend text and layout responsive.
3. Update docs when changing policy or architecture.
4. Preserve runtime gates in code paths.
5. Report what was not run.

## Forbidden During Source-only Development

- DB create/migrate.
- Caddy change/reload/restart.
- Service start/restart.
- Docker/PM2/systemd operation.
- Deployment to `/uconai/www/iso`.
- Paid AI provider activation.
- Any 150 server modification.
