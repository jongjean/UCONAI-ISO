# ISO Zero-to-Completion Development Milestones

Date: 2026-05-03
Status: Rebaselined after precision inspection

This milestone file uses strict progress scoring. It does not count discussion or draft volume as completion unless the result is implemented, cross-checked and consistent with HP policy.

## 1. Progress Scale

| Progress | Meaning |
|---:|---|
| 0% | Not started |
| 10% | Requirement captured |
| 25% | Initial source or specification exists |
| 50% | Main development path exists but is not integrated |
| 75% | Integrated and internally checkable |
| 90% | Production-candidate for its phase |
| 100% | Completed, verified and operationally accepted |

## 2. Immediate Recovery Milestones

These five recovery milestones are the current near-term execution boundary.

| Step | Milestone | Completion condition | Current result | Progress |
|---:|---|---|---|---:|
| 1 | Remove external control-plane contamination | ISO source has no Codex work-control bridge implementation or queue polling logic | Forbidden-term scan passes | 100% |
| 2 | Restore verification path | Smoke, API contract, backend syntax and frontend dependency path are documented; dependency install remains separate | Smoke/API/backend syntax pass; frontend install pending | 90% |
| 3 | Rebaseline milestones | Overall progress no longer reports inflated 54%; strict table reflects actual state | This file rewritten | 95% |
| 4 | Chapter 1 governance | HP state, legacy boundary, product/control-plane separation and source layout are consistent | Chapter 1 rewritten | 95% |
| 5 | Chapter 2 HP infrastructure | Paths, Caddy, data root, runtime, secrets, backup and logging policy match HP state | Chapter 2 rewritten | 94% |

Average recovery progress: 94.8%.

## 3. Master Milestone Table

| No. | Chapter | Current state | Next completion target | Progress |
|---:|---|---|---|---:|
| 1 | Project Reset and Governance | Clean HP baseline and product/control-plane boundary restored | Keep aligned as runtime decisions are made | 95% |
| 2 | HP Infrastructure Policy | HP paths, empty deploy, Caddy route and staging data root verified | Fresh port scan before service enablement | 94% |
| 3 | ISO Rule Foundation | Official source map and rule taxonomy exist, but detailed rule encoding remains shallow | Encode directives, OSD, deliverable and stage rules into testable registry | 45% |
| 4 | Product Architecture | Module/API/event/role model drafted | Convert contracts into executable service boundaries and typed API schemas | 55% |
| 5 | Database and Data Model | PostgreSQL schema draft and bootstrap plan exist; no DB created | Review schema, add migration strategy, define seed/reference data policy | 50% |
| 6 | Backend Foundation | Express scaffold, route manifest and validation/preview APIs exist | Add persistence, auth/session, role middleware and audit middleware | 38% |
| 7 | Frontend Foundation | React/Vite shell and control-room UI mock exist | Install dependencies, pass type/build checks, wire API state | 32% |
| 8 | Project Workspace | Project validation/preview exists | Persist projects, settings, roles, dashboard state | 20% |
| 9 | Structured Document Engine | Starter elements and numbering preview exist | Implement tree editing, cross references, OSD-aware validators | 25% |
| 10 | Version History | Snapshot/diff policy previews exist | Store immutable snapshots and date-based historical views | 20% |
| 11 | Edit Ownership and Collaboration | Lock policy and validation drafts exist | Implement one-editor lock, transfer, comments and proposal mode | 22% |
| 12 | AI Provider Gateway | Provider/agent contracts exist; no execution | Connect Ollama path, usage logging and premium adapter abstraction | 15% |
| 13 | AI Agent Functions | Agent contracts exist | Implement drafting, checker, roadmap, reference, consensus and figure agents | 18% |
| 14 | Roadmap and Procedure Engine | 18/24/36 month preview and stage missions exist | Add minimum-window rules, meeting diary, vote/consultation state | 28% |
| 15 | Reference and Bibliography | Validation and link-preview APIs exist | Implement document upload/registry, AI-use modes, endnote linking | 20% |
| 16 | Terms and Definitions | Term validation and Clause 3 preview exist | Add terminology lookup, consistency scan and late-stage change warnings | 15% |
| 17 | Figures, Tables and Editable Sources | Figure readiness and source package previews exist | Generate editable PPTX/SVG/draw.io/Mermaid sources and verify raster risks | 22% |
| 18 | Review, Comments and Consensus | Stakeholder/comment/mission preview services exist | Persist actors, objections, dispositions, attendance and vote-risk dashboard | 24% |
| 19 | DOCX and OSD Export | Export manifest/readiness preview exists | Generate DOCX, OSD report, source package and version-bound manifests | 12% |
| 20 | Billing and Premium AI | Billing policy and usage estimate previews exist | Implement credit accounts, usage ledger and admin reporting | 15% |
| 21 | Testing and QA | Smoke/API/backend syntax pass; frontend dependency install missing | Add frontend type/build, unit, integration, security and export tests | 18% |
| 22 | HP Development Deployment | Data root staging exists; no DB/service/deploy | Enable dev DB/API only after separate authorization | 15% |
| 23 | Production Deployment | Not started | Migrate DB, build, service, Caddy validation, public verification | 0% |
| 24 | Operations and Maintenance | Early operations notes only | Log rotation, backups, monitoring, restore drill and admin guide | 3% |
| 25 | Final Acceptance | Not started | Functional, security, ISO workflow and HP acceptance | 0% |

## 4. Strict Progress Summary

| Area | Progress |
|---|---:|
| Recovery and governance | 95% |
| HP infrastructure policy | 94% |
| ISO rule/product design | 50% |
| Product implementation | 24% |
| Testing and verification | 18% |
| HP operational readiness | 12% |
| Overall strict completion | 28% |

## 5. Current Truth

- The project is correctly positioned as a new HP-native ISO standard-development AI platform.
- ISO no longer contains external control-plane bridge implementation.
- `/uconai/www/iso` remains empty and disposable.
- `/uconai/data/iso` contains staging folders and bootstrap notes only.
- No DB, migration, service start, Caddy change or deployment has been performed in this recovery phase.
- The next serious blocker is dependency verification: frontend `tsc` cannot run on HP until dependencies are installed.

## 6. Next Work After Step 5

| Priority | Work | Done when |
|---:|---|---|
| 1 | Master execution map | 25 chapters are reordered by dependency, risk and verification value |
| 2 | Chapter 3 rule registry hardening | ISO/IEC Directives, OSD and deliverable rules become testable data |
| 3 | Chapter 4 API/schema contract hardening | Route payload contracts and error semantics are typed |
| 4 | Chapter 5 DB schema review | Prisma model passes design review and migration plan is ready |
| 5 | Contract tests | Rule/API/schema drift is caught before persistence work |

See `docs/00_MASTER_EXECUTION_MAP.md` for the active development order.
