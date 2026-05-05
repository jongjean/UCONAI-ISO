# Phase 9 QA, Operations, and Final Acceptance

This chapter group covers chapters 21, 23, 24, and 25. It defines the acceptance gates required before ISO can be called production-ready.

## 1. Phase 9 Objective

| Area | Contract | Source Artifact |
|---|---|---|
| QA | Source, runtime, DB, browser, DOCX and security test layers | `docs/21_TESTING_AND_QA.md` |
| Production release | Build, service, Caddy, DB and rollback gates | `docs/23_PRODUCTION_DEPLOYMENT.md` |
| Operations | Logs, monitoring, backup, restore, usage and incident controls | `docs/24_OPERATIONS_AND_MAINTENANCE.md` |
| Final acceptance | Evidence matrix and handover package | `docs/25_FINAL_ACCEPTANCE.md` |
| Acceptance policy | Gate matrix, release evidence checklist and runbook preview | `acceptancePolicy.js` |

## 2. Acceptance Gates

| Gate | Required Before |
|---|---|
| `source-contract` | Any runtime execution |
| `runtime-readiness` | Service install/start |
| `data-readiness` | DB migration or storage writes |
| `security-readiness` | User accounts or restricted files |
| `export-readiness` | DOCX/OSD export release |
| `ops-readiness` | Production public route |
| `final-acceptance` | Handover |

## 3. Evidence Rule

Every final-complete claim needs evidence:

| Claim | Evidence |
|---|---|
| Source complete | HP `npm run check` |
| HP ready | HP preflight JSON |
| DB ready | migration, backup and rollback record |
| UI ready | browser screenshots and responsive checks |
| DOCX ready | rendered document verification |
| AI ready | provider, entitlement and ledger logs |
| Secure | roles, audit, restricted files and secret checks |
| Operable | monitoring, restore, rollback and release notes |

## 3A. Source-Level Acceptance APIs

| API | Purpose |
|---|---|
| `POST /api/v1/policy/acceptance-gate-matrix` | Calculate gate progress and missing evidence |
| `POST /api/v1/policy/release-evidence-checklist` | List required evidence packages before production-ready claim |
| `POST /api/v1/policy/operational-runbook-preview` | Preview logs, monitoring, backup, restore, AI usage and incident controls |

## 4. Current Phase Boundary

The current work is still source-only. The following remain intentionally unexecuted:

| Runtime Action | State |
|---|---|
| DB creation/migration | Not executed |
| Service installation/start | Not executed |
| Caddy change/reload | Not executed |
| Deployment to `/uconai/www/iso` | Not executed |
| Paid AI provider activation | Not executed |

## 5. Phase 9 Cross-check

| Check | Required Result |
|---|---|
| QA layers are documented | Pass |
| Release gates are documented | Pass |
| Rollback requirements are documented | Pass |
| Operational controls are documented | Pass |
| Final acceptance matrix is documented | Pass |
| Handover package is documented | Pass |
| Acceptance gate matrix route exists | Pass |
| Release evidence checklist route exists | Pass |
| Operational runbook preview route exists | Pass |
| Source-only boundary remains clear | Pass |

Phase 9 completes the source-level master plan. Runtime implementation can begin only after the relevant execution gate is selected and reviewed.
