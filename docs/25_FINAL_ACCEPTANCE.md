# 25. Final Acceptance

Status: Planned

Final acceptance requires:

| Area | Criteria |
|---|---|
| Infrastructure | Paths, ports, Caddy, services and backups verified |
| Security | Auth, roles, locks, audit and secrets verified |
| Document engine | Structured editing, numbering and history verified |
| ISO workflow | Roadmap, references, terms, figures, comments and export verified |
| AI | Local AI and approved premium controls verified |
| Operations | Monitoring, restore and rollback guide complete |

## Final Acceptance Matrix

| Area | Must Pass | Evidence |
|---|---|---|
| Source | All phase checks pass | HP `npm run check` output |
| HP readiness | Paths and reserved ports verified read-only | `tools/iso_hp_preflight.py --json` |
| DB | Migration, backup and rollback proven | DB execution record |
| Auth | Registration, roles and membership tested | API/browser test evidence |
| Document engine | Structured editing, numbering, snapshots and locks tested | Integration and browser tests |
| Roadmap | Track changes, procedure diary and readiness matrix tested | API and UI evidence |
| References | AI-use mode, normative/bibliography linkage tested | API and export evidence |
| Figures | Editable source package, raster-only rejection tested | Export package evidence |
| AI | Local provider, premium entitlement and ledger controls tested | Provider and billing logs |
| Export | DOCX, OSD companion and asset package verified | Rendered document evidence |
| Security | Secrets, restricted files, audit and incident paths verified | Security checklist |
| Operations | Monitoring, backup, restore, rollback and release notes complete | Handover package |

## Handover Package

| Artifact | Required |
|---|---|
| Architecture map | Yes |
| Environment variable list | Yes |
| DB schema and migration record | Yes |
| Backup and restore commands | Yes |
| Caddy route and service unit record | Yes |
| AI provider and billing policy | Yes |
| Export verification samples | Yes |
| Known limitations and next roadmap | Yes |

The project is not final-complete until every row in the final acceptance matrix has evidence.

## Acceptance API Boundary

The source tree may calculate gate status, missing evidence and handover package readiness. It may not claim final completion until runtime, data, browser, export, security and operations evidence exists.


