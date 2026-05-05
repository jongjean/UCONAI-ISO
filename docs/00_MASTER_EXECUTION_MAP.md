# ISO Master Execution Map

Date: 2026-05-03
Status: Active execution baseline

This map defines the safest and most efficient development order for all 25 chapters. Chapter numbers remain the product specification order, but implementation follows dependency order.

## 1. Execution Principles

| Principle | Meaning |
|---|---|
| Build verifiable slices | Every phase must end with a checkable product slice, not only documents |
| Keep runtime risk low | No DB, service, deploy, Caddy or paid AI action inside source-only phases |
| Stabilize contracts before persistence | API, rule IDs and data model must be coherent before DB execution |
| Implement preview before write | Validation and preview endpoints come before persistent writes |
| Preserve OSD destination | The product prepares OSD-ready content; it does not replace OSD |
| Separate official rules from advice | Official ISO rules, guidance, project policy, heuristic advice and AI inference must stay labeled |
| Avoid single big-bang delivery | Each phase cross-checks backend, frontend, docs and tests before moving on |

## 2. Reordered Development Phases

| Phase | Chapters involved | Development focus | Exit condition |
|---:|---|---|---|
| 0 | 1, 2, 21 | Recovery, HP boundaries, verification path | Source tree clean, tests pass, no forbidden control-plane contamination |
| 1 | 3, 4, 5 | Rule IDs, API contracts, DB schema review | Rule/API/schema contracts are consistent and testable |
| 2 | 6, 7, 8 | Backend/frontend workspace skeleton | Project workspace preview works end-to-end without persistence |
| 3 | 9, 10, 11 | Structured document, versions, edit locks | Document element model, snapshots and one-editor policy are integrated |
| 4 | 14, 18 | Roadmap, meetings, votes, consensus | Timeline, mission cards, comments and stakeholder state share one project context |
| 5 | 15, 16, 17 | References, terms, figures/tables | Clause 2/3, bibliography candidates and editable source readiness connect to document elements |
| 6 | 12, 13, 20 | AI provider gateway, agents, usage governance | AI execution is backend-brokered, logged and permission-aware |
| 7 | 19 | DOCX/OSD/export pipeline | Version-bound DOCX, OSD report and source package can be generated in development |
| 8 | 22 | HP internal development deployment | Internal API/service/dev DB can be enabled after separate authorization |
| 9 | 21, 23, 24, 25 | QA, production deploy, operations, acceptance | Public ISO service passes functional, security, ISO workflow and HP acceptance |

## 3. Why This Order

| Decision | Reason |
|---|---|
| Chapter 21 starts early | Testing is a development harness, not a final cleanup task |
| Chapters 3-5 precede persistence | The rule engine, API semantics and DB model must agree before writes are stored |
| Chapters 6-8 precede document editing | Users need a project container before document, roadmap or AI state can be meaningful |
| Chapters 9-11 are grouped | Document elements, history and edit ownership are one integrity unit |
| Chapter 14 pairs with 18 | Roadmap dates are weak unless tied to comments, meetings and consensus missions |
| Chapters 15-17 follow document core | References, terms and figures must attach to stable document element IDs |
| Chapters 12-13 follow core workflows | AI agents need real project/document/reference context to be useful |
| Chapter 20 follows AI gateway | Billing without actual provider usage contracts would be premature |
| Chapter 19 waits until sources are stable | Export must bind to versions, references and editable figure source status |
| Chapters 22-25 remain late | HP service, public route and operations require product behavior to be testable first |

## 4. Phase 0 Current Status

| Check | Result |
|---|---|
| Chapter 1 governance | 95% |
| Chapter 2 infrastructure policy | 94% |
| Forbidden control-plane terms | Passed |
| HP `npm run check` | Passed |
| HP frontend build test | Passed; generated `frontend/dist` removed |
| `/uconai/www/iso` | 0 files |
| ISO services | 0 |
| DB execution | Not performed |

Phase 0 is complete enough to begin Phase 1.

## 5. Phase 1 Work Breakdown

Phase 1 is the next development phase.

| Work ID | Chapter | Task | Output |
|---|---:|---|---|
| P1-01 | 3 | Define canonical rule ID format | `RULE-{source}-{domain}-{number}` style registry IDs |
| P1-02 | 3 | Expand rule registry schema | Source class, confidence, blocking level, applicable stage/deliverable |
| P1-03 | 3 | Add first testable rule families | Scope, terms, numbering, figures, references, OSD readiness |
| P1-04 | 4 | Define API payload contract naming | Request/response/error shape conventions |
| P1-05 | 4 | Align route manifest with product modules | Route status and runtime gates match backend |
| P1-06 | 4 | Define event/audit vocabulary | Events do not use deleted external control-plane concepts |
| P1-07 | 5 | Review Prisma schema for Chapter 8-19 needs | Missing relations/indexes noted before DB execution |
| P1-08 | 5 | Add migration readiness checklist | Backup, rollback, seed, dev/prod boundary |
| P1-09 | 21 | Add contract tests for rule/API/schema consistency | Automated guard against drift |

## 6. Cross-check Gate Between Phases

Before moving from one phase to the next:

1. Run HP `npm run check`.
2. Run forbidden-term scan.
3. Confirm `/uconai/www/iso` was not modified unless the phase explicitly permits deployment.
4. Confirm no ISO service was started unless the phase explicitly permits service enablement.
5. Confirm no DB migration or production state was created unless explicitly authorized outside source code.
6. Update this execution map and the zero-to-completion milestone file.

## 7. Current Next Step

Begin Phase 1 with rule/API/schema contract hardening. Do not implement persistent project creation, DB migration, public deployment or live AI execution until the Phase 1 contracts are stable.
