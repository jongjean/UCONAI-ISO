# 6. Backend Foundation

Date: 2026-05-03
Status: Source scaffold in progress

## Objective

The backend is the policy enforcement center for ISO. The frontend must not bypass it for DB writes, AI calls, exports, billing, or file storage.

## Required Modules

| Module | Purpose | Current state |
|---|---|---|
| Config | Load HP-safe runtime settings | Created |
| Health | Check basic process readiness | Created |
| Policy | Expose non-secret project policy | Created |
| Projects | Validate and preview project setup | Started |
| Documents | Provide structured starter document | Started |
| Versions | Protect historical snapshots | Started |
| Locks | Enforce one active editor | Started |
| AI | Gate local and premium providers | Started |
| Runtime gates | Expose locked-operation safety metadata | Created |

## Runtime Locks

The backend must not execute these actions until operator review is confirmed:

| Action | Reason |
|---|---|
| Create DB schema | Persistent state starts |
| Start service | HP runtime becomes active |
| Enable paid AI | Billable usage starts |
| Generate persistent exports | Storage and audit requirements apply |

## Completion Criteria

- All route groups have schema validation.
- All write routes produce audit events.
- All blocked routes return explicit operation-locked errors.
- Runtime services listen only on `127.0.0.1` behind Caddy.

