# Phase 1 Rule, API, and Schema Contracts

This document freezes the first source-level contract gate for chapters 3, 4, and 5. It does not authorize deployment, database creation, migration execution, Caddy changes, or external AI provider billing.

## 1. Purpose

Phase 1 turns the ISO platform from a concept map into a testable product foundation:

| Area | Contract Target | Current Source Artifact | Gate |
| --- | --- | --- | --- |
| ISO rule foundation | Machine-readable rule IDs, sources, severity, workflow effects, applicability | `ai-services/rule-registry.json` | `tests/phase1-contract-check.mjs` |
| Rule registry policy API | Read-only registry summary and self-validation surface | `backend/src/services/ruleRegistryPolicy.js`, `backend/src/routes/policy.js` | `tests/phase1-contract-check.mjs` |
| Product/API architecture | Stable API envelope, runtime gate language, product event vocabulary | `backend/src/contracts.js` | `tests/api-contract-check.mjs` and `tests/phase1-contract-check.mjs` |
| Database model | PostgreSQL schema draft with user, project, document, history, lock, reference, roadmap, AI, billing, audit, and security aggregates | `backend/prisma/schema.prisma` | Source validation only; no migration execution |

## 2. Rule Registry Contract

Rule IDs follow `ISO-{DOMAIN}-{NNN}` and must remain immutable after use in validation events, document history, or export reports.

| Domain | Meaning | Example |
| --- | --- | --- |
| `SRC` | Source precedence and evidence handling | `ISO-SRC-001` |
| `DOC` | Drafting, clause structure, numbering, scope caution | `ISO-DOC-001` |
| `TERM` | Terms, definitions, and abbreviations | `ISO-TERM-001` |
| `REF` | Reference intake and bibliography readiness | `ISO-REF-001` |
| `FIG` | Figures, editable sources, and source package readiness | `ISO-FIG-001` |
| `ROAD` | Track, milestone, ballot, consultation, and deadline recalculation | `ISO-ROAD-001` |
| `CONS` | Committee consensus mission planning | `ISO-CONS-001` |
| `OSD` | OSD companion readiness | `ISO-OSD-001` |
| `AI` | AI suggestion safety and editor acceptance | `ISO-AI-001` |

Rule classes are separated by authority:

| Class | Product Meaning | Blocking Power |
| --- | --- | --- |
| `OFFICIAL_RULE` | Binding source rule once verified against official material | Can block |
| `OFFICIAL_GUIDANCE` | Official guidance and support material | Can warn or gate export depending on rule |
| `PROJECT_POLICY` | UCONAI ISO product policy | Can block product workflow |
| `EXPERT_HEURISTIC` | Expert practice or committee strategy guidance | Advisory or warning |
| `AI_INFERENCE` | AI-derived observation | Human review required |
| `USER_NOTE` | User/project-specific note | Advisory unless promoted |

The rule registry is exposed through read-only policy endpoints so the frontend, QA checks, and future admin review screens can inspect rule coverage without writing state:

| Endpoint | Purpose | Boundary |
| --- | --- | --- |
| `GET /api/v1/policy/rule-registry-summary` | Return source policy, rule ID policy, counts, coverage, and validation status | Reads local source registry only |
| `POST /api/v1/policy/rule-registry/validate` | Re-run registry consistency checks and return issues | Does not fetch external ISO sites or persist results |

## 3. API Contract Policy

All product routes sit under `/api/v1`. Product contract endpoints may return preview or policy objects without DB writes. Mutation-shaped endpoints stay behind `admin-review` route manifest gates until their DB, auth, audit, rollback, and HP execution plans are explicitly reviewed.

The API response envelope is:

| Field | Meaning |
| --- | --- |
| `ok` | Boolean success flag |
| `data` | Result object, array, or null |
| `error` | Stable error object or null |

The API error envelope is:

| Field | Meaning |
| --- | --- |
| `code` | Stable machine-readable code |
| `message` | Short user-facing explanation |
| `details` | Optional diagnostic object |

The ISO product event vocabulary is internal to ISO. External runtime bridges, messaging bridges, or unrelated control-plane concepts are not part of the ISO codebase.

## 4. Schema Contract Review

The schema is a draft contract only. It is intentionally held before migration execution.

| Aggregate | Contract Role | Phase 1 Status |
| --- | --- | --- |
| `User` | Member identity, audit actor, AI usage actor, edit lock holder | Drafted |
| `StandardProject` | Root ISO project workspace | Drafted |
| `DocumentElement` | Structured document tree with stable keys | Drafted |
| `DocumentVersionSnapshot` | Append-oriented version history | Drafted |
| `EditOwnershipLock` | One-editor ownership model | Drafted |
| `ReferenceDocument` | Registered source/reference material | Drafted |
| `FigureAsset` | Figure preview and editable source tracking | Drafted |
| `RoadmapEvent`, `MeetingEvent`, `VoteEvent` | Procedure, meeting, ballot, and consensus roadmap | Drafted |
| `AiInteraction`, `AiProviderUsage` | AI traceability and provider usage | Drafted |
| `CreditAccount`, `BillingEvent`, `UsageLedger` | Premium AI usage accounting | Drafted |
| `AuditLog`, `SecurityEvent` | Governance and security trace | Drafted |

Phase 1 adds explicit user relations for history authorship, edit ownership, AI usage, ledger, and security events. It also adds indexes for the high-frequency query axes: project, user, stage, type, date, status, provider/model, and element/reference linkage.

## 5. Cross-check Gate

Before moving deeper into implementation, the following must remain true:

| Check | Required Result |
| --- | --- |
| Rule registry JSON parses | Pass |
| Rule IDs match policy and are unique | Pass |
| Each rule has valid sources, class, severity, workflow effect, deliverables, stages, and document areas | Pass |
| Rule registry summary and validation endpoints are manifest-covered | Pass |
| API contract policy exists | Pass |
| Schema contract policy exists | Pass |
| Product event vocabulary blocks external control-plane prefixes | Pass |
| DB schema keeps migration warning header | Pass |
| DB schema contains required relation and index tokens | Pass |
| Forbidden external control bridge strings are absent from ISO source | Pass |

Only after this gate remains stable should the project continue into backend and frontend feature wiring.
