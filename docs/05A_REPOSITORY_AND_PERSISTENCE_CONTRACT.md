# Repository and Persistence Contract

This document defines the DB-facing repository boundary before PostgreSQL execution. It is source-only and does not create a database, run migrations, or persist records.

## 1. Repository Groups

| Repository | Primary Aggregate | Prisma Models |
|---|---|---|
| `users` | `User` | `User`, `ExternalIdentity`, `ProjectMember` |
| `projects` | `StandardProject` | `StandardProject`, `DeliverableProfile`, `ProjectMember` |
| `documents` | `DocumentElement` | `DocumentElement`, `DocumentVersionSnapshot`, `EditOwnershipLock` |
| `roadmap` | `Roadmap` | `StageTrackPlan`, `RoadmapEvent`, `MeetingEvent`, `VoteEvent` |
| `references` | `ReferenceDocument` | `ReferenceDocument`, `NormativeReference`, `BibliographyLinkCandidate` |
| `figures` | `FigureAsset` | `FigureAsset`, `AssetSourceValidation` |
| `consensus` | `CommitteeConsensus` | `CommitteeActor`, `CommentDisposition`, `DecisionRecord` |
| `ai` | `AiInteraction` | `AiInteraction`, `AiProviderUsage` |
| `exports` | `ExportJob` | `ExportJob` |
| `billing` | `Billing` | `CreditAccount`, `BillingEvent`, `UsageLedger` |
| `audit` | `Audit` | `AuditLog`, `SecurityEvent` |

## 2. Write Boundary

All repository writes are protected until DB execution is enabled. Preview and validation routes may describe intended writes, but they must not persist data.

| Protected Write | Required Safeguard |
|---|---|
| Project creation | DB, audit and membership policy |
| Canonical document update | Active edit lock, snapshot and audit |
| Reference registration | Project-scoped storage key and AI-use mode |
| Figure source attachment | Editable source validation |
| AI interaction record | Provider, model, purpose and source policy |
| Export job creation | Version binding and worker execution |
| Usage ledger write | Credit balance consistency |
| Audit/security append | Append-only behavior |

## 3. API Contract

| Route | Purpose |
|---|---|
| `GET /api/v1/persistence/contracts` | List disabled repository contracts |
| `GET /api/v1/persistence/implementation-plan` | Show sequence for Prisma-backed implementation |
| `POST /api/v1/persistence/operation/validate` | Validate repository/method intent without executing |

## 4. Implementation Sequence

1. Execute reviewed DB bootstrap.
2. Generate Prisma client.
3. Add Prisma-backed repository implementations.
4. Wrap canonical writes in transactions.
5. Add non-production repository integration tests.
6. Enable write routes one group at a time.

## 5. Required Invariants

| Invariant | Reason |
|---|---|
| No canonical document write without active edit lock | Prevent simultaneous authoring conflict |
| Every canonical document write creates a snapshot | Preserve history |
| Every high-value write appends audit/security record | Traceability |
| Storage keys stay project-scoped | Isolation |
| Billing writes preserve ledger consistency | Cost safety |
