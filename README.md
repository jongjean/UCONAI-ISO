# UCONAI ISO

HP-native new development project for a general ISO standard-development AI platform.

This project starts from a clean HP baseline. Legacy 150 assets are reference only. Example project data such as PWI 26255 or DTR/TR 25468 is not imported.

## HP Policy

| Purpose | Path |
|---|---|
| Source | `/uconai/projects/iso` |
| Deploy artifact | `/uconai/www/iso` |
| Data | `/uconai/data/iso` |
| Logs | `/uconai/data/iso/logs` |
| Exports | `/uconai/data/iso/exports` |

No DB creation, Caddy change, service restart, deployment, or paid AI connection is part of the current source-only phase.

## Initial Port Plan

| Component | Port | Exposure |
|---|---:|---|
| `iso-api` | `4510` | HP internal only |
| `iso-worker` health | `4511` | HP internal only |
| `iso-scheduler` health | `4512` | HP internal only |

## Development State

Current state is source scaffold plus policy/preview APIs. Chapter 1 governance is documented in `docs/01_PROJECT_GOVERNANCE.md`.
The active development order is documented in `docs/00_MASTER_EXECUTION_MAP.md`.

Implemented:

- Frontend shell and milestone dashboard mock.
- Backend health, policy, validation and preview endpoints.
- HP route/port/path policy documentation.
- Prisma schema draft and non-executing DB bootstrap plan.

Not implemented yet:

- Executed database creation or migration.
- Public frontend deployment.
- Production service.
- Live AI provider execution.
- User membership DB.

## Canonical Names

| Item | Name |
|---|---|
| Product display name | `UCONAI ISO` |
| Project slug | `iso` |
| Backend service | `iso-api` |
| Worker service | `iso-worker` |
| Scheduler service | `iso-scheduler` |
| Frontend app | `iso-web` |
| AI gateway | `iso-ai-gateway` |
