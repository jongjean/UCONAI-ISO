# 21. Testing and Quality Assurance

Date: 2026-05-03
Status: Test baseline

## Current Test Scope

Implemented now:

- Backend JavaScript syntax checks.
- JSON registry parsing checks.
- Repository smoke check for required files.
- API contract check for route manifest coverage and review-gated run/job endpoints.
- API runtime preview check with a temporary random local port and immediate shutdown.

Blocked until later:

- DB integration tests.
- Frontend browser visual QA.
- DOCX render verification.
- Permission/auth integration tests.

## QA Layers

| Layer | Scope | Required Before Production |
|---|---|---|
| Source contract | Required files, route manifest, rule registry, phase checks | Yes |
| Backend syntax | All server, route and service modules | Yes |
| Frontend type check | TypeScript compile without emit | Yes |
| Runtime config | HP host/port/path protected operation policy | Yes |
| Preflight | HP paths, free reserved ports, empty deploy target before release | Yes |
| API runtime preview | HTTP checks against temporary local Express server without service install | Yes |
| DB integration | PostgreSQL migration and rollback rehearsal | Later, before DB execution |
| Browser QA | Responsive UI and visual checks | Later, before public deploy |
| DOCX render QA | Rendered DOCX/PDF/page snapshots | Later, before export release |
| Release evidence | Gate evidence packages and operational runbook preview | Yes |

## Cross-check Policy

Every chapter transition should verify:

| Check | Required |
|---|---|
| No unapproved DB/service/deploy action | Yes |
| Backend syntax checks | Yes |
| JSON registries parse | Yes |
| API contract check | Yes |
| Milestone progress updated | Yes |
| HP source sync verified | Yes |

## Acceptance Gate Names

| Gate | Meaning |
|---|---|
| `source-contract` | Source tree and phase contracts are internally consistent |
| `runtime-readiness` | HP runtime config, port and path readiness pass without changing runtime |
| `data-readiness` | DB/storage/backup/restore plans are ready before execution |
| `security-readiness` | Auth, role, lock, audit, secret and restricted-file controls are verified |
| `export-readiness` | DOCX, OSD report and editable figure packages are reproducible |
| `ops-readiness` | monitoring, logs, backup, restore and rollback are documented |

