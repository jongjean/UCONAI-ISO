# 5. Database and Data Model

Date: 2026-05-03
Status: Schema design baseline only

## Execution Boundary

This chapter defines the database model. It does not create a database and does not run migrations.

`/uconai/data/iso` was created after operator data-root setup. Actual DB creation or schema migration still requires a separate operator review.

## Current Bootstrap State

Prepared source-only tools:

| Tool | Purpose | Executes DB changes |
|---|---|---|
| `tools/iso_db_bootstrap_plan.py` | Prints or writes the future DB bootstrap SQL plan | No |
| `tools/iso_hp_preflight.py` | Checks HP ISO path expectations and execution boundary | No |

Planned names:

| Item | Planned value |
|---|---|
| Database | `uconai_iso` |
| App user | `uconai_iso_app` |
| Schema source | `/uconai/projects/iso/backend/prisma/schema.prisma` |

## 5.1 DB Engine Decision

Recommended engine: PostgreSQL.

Reasons:

| Need | PostgreSQL fit |
|---|---|
| Multi-user workflow | Transaction safety |
| Version history | Strong relational model plus JSON metadata |
| Edit locks | Row-level consistency |
| Audit log | Durable append-only tables |
| Roadmap and votes | Relational integrity |
| AI usage/billing | Accurate ledger records |

SQLite is not recommended for final ISO production because the platform requires concurrent user and audit workflows.

## 5.2 Project Tables

| Table | Purpose |
|---|---|
| `users` | ISO-independent membership identity |
| `external_identities` | Future bridge to UCONAI/Django/SSO without direct DB coupling |
| `standard_projects` | Main ISO project |
| `deliverable_profiles` | IS/TS/TR/PAS/IWA/Guide behavior |
| `project_members` | User role per project |

## 5.3 Roadmap Tables

| Table | Purpose |
|---|---|
| `stage_track_plans` | 18/24/36 month track and stage plan |
| `roadmap_events` | Milestone, meeting, ballot, consultation, mission cards |
| `meeting_events` | Meeting details, attendance, presentation/circulation evidence |
| `vote_events` | Ballot/vote/consultation result records |

## 5.4 Document Tables

| Table | Purpose |
|---|---|
| `document_elements` | Canonical structured clauses/elements |
| `document_version_snapshots` | Immutable historical snapshots |
| `edit_ownership_locks` | Single canonical editor lock |

Element types:

```text
TITLE, FOREWORD, INTRODUCTION, SCOPE, NORMATIVE_REFERENCES,
TERM, ABBREVIATION, CLAUSE, PARAGRAPH, LIST, NOTE, EXAMPLE,
TABLE, FIGURE, ANNEX, BIBLIOGRAPHY
```

## 5.5 Reference Tables

| Table | Purpose |
|---|---|
| `reference_documents` | Registered source/reference documents |
| `normative_references` | Clause 2 controlled references |
| `bibliography_link_candidates` | Deferred bibliography/endnote links |

## 5.6 Asset Tables

| Table | Purpose |
|---|---|
| `figure_assets` | Figure preview and editable source tracking |
| `asset_source_validations` | Validation results for editable source |
| `export_jobs` | DOCX/OSD/source package export records |

## 5.7 Review Tables

| Table | Purpose |
|---|---|
| `committee_actors` | Country/expert/organization/role/position |
| `comment_dispositions` | Comments, objections, responses and decisions |
| `decision_records` | Formal and informal decisions |

## 5.8 AI and Billing Tables

| Table | Purpose |
|---|---|
| `ai_interactions` | AI request/response summary and binding |
| `ai_provider_usage` | Provider/model/token/cost record |
| `usage_ledger` | Billable usage ledger |
| `credit_accounts` | UCONAI membership/credit balances |
| `billing_events` | Credit changes, grants, charges and adjustments |

## 5.9 Audit Tables

| Table | Purpose |
|---|---|
| `audit_logs` | Append-only high-value action log |
| `security_events` | Auth, permission and suspicious operation records |

## 5.10 Migration Policy

Rules:

1. No production migration without operator review.
2. Every migration must have a rollback note or backup requirement.
3. Backup must be completed before production migration.
4. Migration output must be recorded in `/uconai/history/iso` after reviewed execution.
5. DB credentials must not be committed.

Pre-migration checklist:

| Check | Required |
|---|---|
| Schema reviewed | Yes |
| Backup command written | Yes |
| Restore command written | Yes |
| Execution review recorded | Yes |
| Review status recorded | Yes |
| Migration dry-run or dev run | Yes |

## Chapter 5 Cross-check

| Check | Result |
|---|---|
| Django DB direct coupling avoided | Passed |
| PostgreSQL selected as target | Passed |
| No DB created | Passed |
| No migration executed | Passed |
| Core ISO document/version/lock model included | Passed |
| Roadmap/review/reference/asset/AI/audit groups included | Passed |

## Chapter 5 Exit Criteria

| Criterion | State |
|---|---|
| DB engine decision documented | Complete |
| Table groups defined | Complete |
| Membership independence documented | Complete |
| Migration policy documented | Complete |
| Remaining work | Convert schema draft to executable migration only after operator review |

