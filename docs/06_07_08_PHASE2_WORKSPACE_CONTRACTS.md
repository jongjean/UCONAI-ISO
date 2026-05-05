# Phase 2 Backend, Frontend, and Workspace Contracts

This chapter group covers chapters 6, 7, and 8. It defines the ISO project workspace as a source-level contract only. It does not create project rows, write files, start services, or publish the frontend.

## 1. Phase 2 Objective

The ISO platform must expose a coherent project workspace before persistent data is enabled.

| Chapter | Contract | Source Artifact | Current State |
| --- | --- | --- | --- |
| 6 | Backend route and runtime-gate contract | `backend/src/routes/projects.js`, `backend/src/services/projectPolicy.js` | Preview and validation routes only |
| 7 | Frontend workspace shell | `frontend/src/App.tsx`, `frontend/src/data.ts`, `frontend/src/types.ts` | Static preview shell |
| 8 | Independent project workspace model | `buildWorkspaceContract`, `validateWorkspaceContract` | Source contract ready |
| 8 | Deliverable-aware workspace guidance | `buildDeliverableGuidelineMatrix` | Source contract ready |

## 2. Workspace Surfaces

| Surface | Role | Persistence State |
| --- | --- | --- |
| Roadmap diary | Track, stage, meeting, ballot, consultation, and mission planning | Preview only |
| Structured document editor | Title, scope, terms, clauses, references, figures, annexes, bibliography | Preview only |
| Chapter block workspace | One selected chapter with add/delete/reorder controls | Preview only |
| Clause outline editor | Four-level automatic numbering with move/delete/indent controls | Preview only |
| AI guidance panel | Pre-OSD drafting, rules, style, similarity, and source-use assistance | Contract only |
| Reference registry | Source documents, intended AI use, normative/bibliography candidates | Contract only |
| Figure source manager | Editable diagrams, source package readiness, validation warnings | Contract only |
| Export package | DOCX, OSD companion report, asset package | Locked |

## 3. HP Path Contract

The workspace contract keeps source, deployment, and data separate:

| Layer | Path |
| --- | --- |
| Source | `/uconai/projects/iso` |
| Deployment artifact target | `/uconai/www/iso` |
| Project data | `/uconai/data/iso/projects/<projectKey>` |
| Project storage | `/uconai/data/iso/storage/<projectKey>` |
| Project logs | `/uconai/data/iso/logs/<projectKey>` |

The deployment target remains a rebuildable artifact area and must not become the source of truth.

## 4. Layout Contract

| Mode | Required Surfaces |
| --- | --- |
| Single monitor | Sidebar, workspace, AI guidance panel in responsive stack |
| Dual monitor | Left document editor plus right agent, roadmap, references, and runtime gates |
| Page modes | 1-page, 2-page, and 4-page workspace controls |
| Chapter focus | One chapter can be opened as the active work block while the full 25-chapter map stays collapsed |
| Clause numbering | Clause blocks recalculate 1, 1.1, 1.1.1 and 1.1.1.1 labels after movement or depth changes |

## 5. Runtime Gates

| Gate | State | Meaning |
| --- | --- | --- |
| DB | Locked | No persistent project creation yet |
| Storage | Locked | No reference/export file writes yet |
| Service | Locked | No HP runtime service start from this phase |
| Public deploy | Locked | `/uconai/www/iso` remains empty unless deployment is separately reviewed |

## 6. Deliverable Guideline Matrix

The workspace must not assume every project is an IS. Deliverable type changes warning strength, wording discipline, roadmap posture, and formal package focus.

| Deliverable | Workspace Focus |
| --- | --- |
| IS | Normative text, full formal package evidence, DIS/FDIS discipline |
| TS | Technical maturity and possible future IS conversion |
| TR | Informative wording, bibliography/endnote evidence, limited requirement language |
| PAS/IWA | Accelerated or workshop-driven path with compressed issue tracking |
| Guide | Guidance language and non-requirement discipline |

## 7. Phase 2 Cross-check

| Check | Required Result |
| --- | --- |
| Project workspace contract route exists | Pass |
| Deliverable guideline matrix route exists | Pass |
| Workspace validation route exists | Pass |
| Workspace contract lists source/deploy/data/storage/log paths | Pass |
| Workspace contract lists six surfaces | Pass |
| Frontend renders workspace surface cards | Pass |
| Frontend renders add/delete/reorder chapter blocks | Pass |
| Frontend renders automatic clause numbering controls | Pass |
| Frontend view modes include 1, 2, and 4 page modes | Pass |
| No source noise terms are present | Pass |

Phase 2 is complete only when backend, frontend, docs, and tests agree on the same workspace contract.
