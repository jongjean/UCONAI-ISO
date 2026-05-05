# Auth, Session, and Role Contract

This document defines ISO membership and permission behavior before user persistence is enabled. It does not create accounts, sessions, passwords, or database records.

## 1. Identity Model

| Item | Contract |
|---|---|
| Membership DB | ISO-independent PostgreSQL target |
| External identity | Future optional bridge |
| Default registration status | `PENDING` |
| Provider secrets in browser | Never |
| Session preview | Contract only, not persisted |

## 2. Roles

| Role | Purpose |
|---|---|
| `SYSTEM_ADMIN` | Global system and security control |
| `PROJECT_LEAD` | Project setup, members, stage decisions and lock transfer |
| `EDITOR` | Canonical document editing while holding edit lock |
| `RESEARCHER` | Reference, figure, memo and proposal work |
| `REVIEWER` | Comments, responses and review proposals |
| `VIEWER` | Read-only project access |

## 3. Permission Rules

| Rule | Meaning |
|---|---|
| Role grants capability, not edit ownership | `EDITOR` still needs active lock |
| Premium AI needs billing controls | Role alone is not enough |
| Lock transfer is restricted | Project lead or system admin only |
| Active user status is required | Pending/disabled users cannot perform actions |
| Browser must not store provider secrets | Backend gateway only |

## 4. API Contract

| Route | Purpose |
|---|---|
| `GET /api/v1/auth/policy` | Show membership, role and session policy |
| `POST /api/v1/auth/registration/validate` | Validate registration draft |
| `POST /api/v1/auth/roles/validate` | Validate role assignment |
| `GET /api/v1/auth/permissions/matrix` | Show role/action matrix |
| `POST /api/v1/auth/permissions/check` | Check whether a role can perform an action |
| `POST /api/v1/auth/session/preview` | Preview session envelope without persistence |

## 5. Cross-check

| Check | Required Result |
|---|---|
| Role matrix exists | Pass |
| Session preview exists | Pass |
| Permission check blocks document edit without lock | Pass |
| Permission check blocks premium AI without billing controls | Pass |
| Session envelope hides provider secrets | Pass |
| Registration persistence remains locked | Pass |
