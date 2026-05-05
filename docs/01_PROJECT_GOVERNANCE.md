# 1. Project Reset and Governance

Date: 2026-05-03
Status: 95% production candidate

## 1.1 Verified HP Baseline

The ISO project is now treated as a new HP-native product, not a legacy static migration.

| Item | Verified state | Rule |
|---|---|---|
| `/uconai/projects/iso` | Source scaffold exists | Development source of truth |
| `/uconai/www/iso` | Exists and contains 0 files | Disposable deploy output only |
| `/uconai/data/iso` | Exists with staging folders and bootstrap notes only | Persistent data root; no DB exists |
| `/iso` Caddy route | Redirects to `/iso/` | HP route only |
| `/iso/api/*` | Returns 503 until ISO API is deployed | No undeployed backend proxy |
| `/iso/*` | Serves `/uconai/www/iso` | Empty until approved build |
| 150 server | Read-only reference only | No modification |

Cross-check result:

- No ISO Caddy route points to `192.168.0.150`.
- No ISO service is running.
- No ISO DB has been created.
- No ISO deploy artifact has been published.
- No external control-plane bridge implementation exists in ISO product source.

## 1.2 Legacy Boundary

Legacy 150 assets may be inspected only for patterns and lessons.

Allowed:

- Read-only code pattern review.
- UI/architecture idea reference.
- Auth, file handling or conversation pattern reference.

Not allowed:

- Importing sample standard projects as seed data.
- Copying PWI, DTR, TR, TS or SC36-specific project content.
- Treating `/var/www/iso` as source.
- Modifying the 150 server.
- Reintroducing operational control-plane bridge code into ISO.

## 1.3 Runtime Boundary

Source development is allowed. Runtime-impacting work remains blocked until separately authorized outside the ISO product.

| Action | Current rule | Product implementation status |
|---|---|---|
| Source/docs updates under `/uconai/projects/iso` | Allowed | Active |
| DB schema creation or migration | Blocked | Planned only |
| Build to `/uconai/www/iso` | Blocked | No artifact |
| Caddy change/reload/restart | Blocked | No change in this phase |
| systemd/Docker/PM2 service start | Blocked | No ISO service |
| External paid AI connection | Blocked | Gateway design only |
| 150 modification | Forbidden | Not touched |

Important separation:

- ISO product code must not contain external control-plane bridge logic, Codex work-control logic, or queue polling logic.
- ISO may contain user roles, edit locks, runtime gates and administrator review concepts as product permissions.
- Codex/operator work authorization is outside the ISO application and must be documented outside this product tree if needed.

## 1.4 Product Naming

| Item | Name |
|---|---|
| Product short name | `ISO` |
| Product display name | `UCONAI ISO` |
| Project slug | `iso` |
| Public route | `/iso/` |
| Source root | `/uconai/projects/iso` |
| Deploy root | `/uconai/www/iso` |
| Data root | `/uconai/data/iso` |
| Backend service | `iso-api` |
| Worker service | `iso-worker` |
| Scheduler service | `iso-scheduler` |
| Frontend app | `iso-web` |
| AI gateway | `iso-ai-gateway` |
| Database name draft | `uconai_iso` |
| Database app role draft | `uconai_iso_app` |

Constraints:

- `iso` remains independent from ESG, ESGAI, AINABI and other projects.
- Example standard projects are not part of the product identity.
- Service names must not reuse old 150 names.

## 1.5 Repository Structure

```text
/uconai/projects/iso
  ai-services/
    prompts/
  backend/
    prisma/
    src/
      http/
      routes/
      services/
  docs/
  frontend/
    src/
  infra/
  tests/
  tools/
```

| Directory | Purpose |
|---|---|
| `frontend` | React/Vite user interface |
| `backend` | HP-local API orchestration service |
| `backend/prisma` | Schema draft only; no migration executed |
| `ai-services` | Rule registry and AI agent contracts |
| `infra` | HP path, port, runtime, Caddy and backup policies |
| `docs` | Product architecture, milestones and specifications |
| `tests` | Smoke and contract checks |
| `tools` | Non-executing preflight and bootstrap planning tools |

## 1.6 Development Standard

| Area | Rule |
|---|---|
| Backend bind | `127.0.0.1` only |
| Public route | Caddy only |
| Frontend base | `/iso/` |
| DB | PostgreSQL target, schema draft only |
| Auth | ISO-independent membership model |
| AI | Browser never calls external AI directly |
| Secrets | No real secrets committed |
| Logs | Runtime logs under `/uconai/data/iso/logs` after service enablement |
| Deploy output | Disposable and rebuildable |
| Testing | Smoke, API contract, backend syntax, frontend type/build after dependencies |

## Chapter 1 Cross-check

| Check | Result |
|---|---|
| HP state matches document | Passed |
| 150 boundary explicit | Passed |
| Product/control-plane separation explicit | Passed |
| External control-plane product contamination removed | Passed |
| Naming fixed | Passed |
| Repository structure current | Passed |
| Remaining risk | Need full frontend dependency install and build verification |

## Chapter 1 Exit Criteria

| Criterion | State |
|---|---|
| Clean HP baseline documented | Complete |
| Runtime boundary documented | Complete |
| Product/control-plane separation documented | Complete |
| Project and service names fixed | Complete |
| Repository structure fixed | Complete |
| Development standard written | Complete |
| Current chapter progress | 95% |
