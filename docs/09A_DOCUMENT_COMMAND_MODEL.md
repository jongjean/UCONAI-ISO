# Document Editor Command Model

This document defines how editor actions are represented before persistence is enabled. It does not write canonical document content.

## 1. Commands

| Command | Meaning | Canonical Write |
|---|---|---|
| `create-element` | Add a structured element | Yes |
| `update-element` | Change title/content/metadata | Yes |
| `move-element` | Move or reorder an element | Yes |
| `delete-element` | Remove an element from the active tree | Yes |
| `accept-ai-proposal` | Promote reviewed AI proposal to canonical candidate | Yes |
| `reject-ai-proposal` | Reject AI proposal | No |
| `create-comment` | Add comment/memo | No |
| `resolve-comment` | Resolve or disposition comment | No canonical text write |

## 2. Required Flow

| Step | Required For |
|---|---|
| Validate command | All commands |
| Verify active edit lock | Canonical writes |
| Create read-only snapshot | Canonical writes |
| Apply structured document change | Canonical writes after persistence exists |
| Append audit event | Canonical writes and comment resolution |
| Return impact preview | All commands |

## 3. Guardrails

| Guardrail | Rule |
|---|---|
| Active lock | Required for canonical text changes |
| Base version | Recommended for canonical commands |
| AI proposal | Must be reviewed before becoming canonical text |
| Destructive command | Requires explicit destructive confirmation before execution phase |
| Formal stage change | Title, scope, terms, references and figures trigger stronger warnings |

## 4. API Contract

| Route | Purpose |
|---|---|
| `GET /api/v1/documents/commands` | List command names |
| `POST /api/v1/documents/commands/validate` | Validate a command |
| `POST /api/v1/documents/commands/plan` | Show lock/snapshot/audit sequence |
| `POST /api/v1/documents/commands/bulk-plan` | Plan multiple commands as one transaction candidate |
| `POST /api/v1/documents/impact-preview` | Compare before/after validation and numbering impact |
| `POST /api/v1/documents/workspace-state-preview` | Merge editor, lock, outline, guidance and version browser state |
| `POST /api/v1/documents/submit-readiness/validate` | Check stale version, active editor and command blockers before write phase |

## 5. Current Boundary

All command routes are preview/validation only. Execution waits for DB, edit locks, snapshots, audit log and repository implementations.

## 6. Frontend Contract

The frontend shows command flow and impact preview as a workbench surface:

| Surface | Purpose |
|---|---|
| Editor action flow | Show validate, lock check, snapshot and impact sequence before a text change |
| Impact preview | Show affected title, scope, terms, references and figures before canonical write |
| AI proposal state | Keep AI output as proposal until a human editor reviews it |
| Destructive changes | Show recoverable history and stronger warning before delete planning |

## 7. Workspace State Contract

The workspace state preview is the screen-level contract for the editor. It combines:

| State | Purpose |
|---|---|
| Editor state | Active editor, non-editor comment/proposal mode and lock owner |
| Outline state | Structured document validation and section statistics |
| Command plan | Lock, snapshot, audit and impact sequence |
| Guidance state | Right-panel AI findings without canonical write |
| Version state | Read-only snapshot preview and date browser |
| Submit readiness | Stale edit rejection and missing repository blockers |
