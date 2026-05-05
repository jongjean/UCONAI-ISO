# 4. Product Architecture

Date: 2026-05-03
Status: Chapter 4 architecture baseline

## 4.1 Domain Neutrality

The product is a general ISO standard-development AI engine.

Rules:

- No example project data is imported.
- Domain packs may exist later, but the core engine must not depend on them.
- The default project model must work for any eligible ISO deliverable type.

## 4.2 Module Contract

| Module | Responsibility | Must not do |
|---|---|---|
| `frontend` | User workspace, editor, dashboard, AI panel, roadmap UI | Call external AI providers directly |
| `backend` | API, auth, policy enforcement, DB, storage, provider gateway | Store secrets in source |
| `ai-services` | Prompt registry, rule registry, model/provider contracts | Become domain-specific by default |
| `worker` | Long-running exports, AI jobs, document analysis | Modify canonical text without accepted proposal |
| `scheduler` | Roadmap reminders, deadline checks, scheduled audits | Advance stage automatically |
| `storage` | References, figure sources, exports, logs | Expose files without permission checks |
| `db` | Canonical projects, elements, versions, roles, audit, usage | Store deploy artifacts |
| `infra` | HP ports, service, Caddy, backup and restore policy | Hide review-gated operations |

## 4.3 API Contract

Public browser API must be routed through `/iso/api/*` after deployment.

Internal backend v1 path:

```text
/api/v1
```

Planned API groups:

| Group | Purpose | review status |
|---|---|---|
| `/policy` | Expose non-secret HP/product policy | Allowed |
| `/projects` | Project CRUD | Block create until DB execution review |
| `/documents` | Structured document elements | Requires DB execution review |
| `/versions` | Version history and diff | Requires DB execution review |
| `/locks` | Edit ownership lock | Requires DB execution review |
| `/roadmap` | Track, stage, meetings, mission cards | Requires DB execution review |
| `/references` | Reference registry and permissions | Requires DB/storage execution review |
| `/figures` | Editable source generation and validation | Requires storage/AI execution review |
| `/exports` | DOCX/OSD package jobs | Requires storage/worker execution review |
| `/ai` | AI gateway | Local endpoint configuration review; paid API requires billing review |
| `/billing` | Usage and credit ledger | Requires billing execution review |

## 4.4 Event Model

Every high-value state change should produce an event.

Event families:

| Event | Purpose |
|---|---|
| `project.created` | Project initialized |
| `project.stage_change_requested` | Stage change preview requested |
| `project.stage_changed` | Stage changed after recorded project decision |
| `document.element_created` | Element created |
| `document.element_updated` | Element updated |
| `document.element_moved` | Clause tree changed |
| `document.snapshot_created` | Version snapshot stored |
| `lock.acquired` | Edit ownership acquired |
| `lock.transferred` | Ownership transferred |
| `reference.registered` | Reference file/metadata registered |
| `figure.source_validated` | Figure source checked |
| `ai.requested` | AI call requested |
| `ai.completed` | AI call completed |
| `export.created` | Export package generated |
| `review.requested` | Product review requested |
| `review.completed` | Product review completed |

## 4.5 Permission Model

| Role | Capabilities |
|---|---|
| `SYSTEM_ADMIN` | Infrastructure, users, global policy |
| `PROJECT_LEAD` | Project setup, members, stage decisions, forced lock transfer |
| `EDITOR` | Canonical document editing while lock is held |
| `RESEARCHER` | References, proposals, memos, analysis |
| `REVIEWER` | Comments, review, disposition proposals |
| `VIEWER` | Read-only access |

Permission rules:

- Canonical document edit requires edit lock.
- Non-editors submit proposals/comments only.
- Forced lock transfer requires reason and audit.
- Historical edit unlock requires high-risk confirmation.

## 4.6 Error Model

| Error class | Meaning | User action |
|---|---|---|
| `VALIDATION_WARNING` | Can continue but should review | Review/fix |
| `VALIDATION_BLOCKER` | Must fix before stage/export | Fix required |
| `OPERATION_LOCKED` | Execution review needed | Continue only after review |
| `AUTH_REQUIRED` | Login/session required | Login |
| `FORBIDDEN` | Role/permission insufficient | Request access |
| `LOCK_CONFLICT` | Another editor holds lock | Request transfer |
| `PROVIDER_UNAVAILABLE` | AI/storage/DB provider unavailable | Retry/fallback |
| `QUOTA_EXCEEDED` | AI quota/credit exhausted | Use local/fund credits |
| `INTERNAL_ERROR` | Unexpected system error | Admin review |

## 4.7 Internationalization Model

Canonical document language and UI/agent language are separate.

| Layer | Default |
|---|---|
| Canonical ISO document text | English |
| Agent explanation | User local language, Korean by default |
| Warnings | Local language with ISO term preserved |
| Suggested replacement text | English unless user selects another canonical language |
| Rule/source labels | English IDs plus localized descriptions |

Rules:

- AI may explain in Korean while preserving English ISO terms.
- Suggested document clauses must remain canonical-language aware.
- Translation must not silently alter normative force.

## Chapter 4 Cross-check

| Check | Result |
|---|---|
| Domain neutrality enforced | Passed |
| Module boundaries defined | Passed |
| API groups identified | Passed |
| Event model drafted | Passed |
| Permission roles defined | Passed |
| Error classes defined | Passed |
| i18n boundary defined | Passed |

## Chapter 4 Exit Criteria

| Criterion | State |
|---|---|
| Architecture boundaries documented | Complete |
| API group contract drafted | Complete |
| Event vocabulary drafted | Complete |
| Role model drafted | Complete |
| Error taxonomy drafted | Complete |
| i18n model drafted | Complete |
| Remaining work | Convert these contracts into TypeScript and DB schema in later chapters |


