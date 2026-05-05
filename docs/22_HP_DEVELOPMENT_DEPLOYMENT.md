# 22. HP Development Deployment

Status: Planned, not executed

This chapter defines HP execution readiness. It does not create databases, start services, publish files, or change Caddy.

Blocked actions:

- Create PostgreSQL database.
- Run database migrations.
- Start `iso-api`.
- Build frontend to `/uconai/www/iso`.
- Route `/iso/api/*` to `127.0.0.1:4510`.
- Enable paid AI provider credentials.

Existing prepared paths:

| Path | State |
|---|---|
| `/uconai/projects/iso` | Development source |
| `/uconai/data/iso` | Data root exists |
| `/uconai/data/iso/storage` | Storage root exists |
| `/uconai/data/iso/logs` | Log root exists |
| `/uconai/www/iso` | Deployment target stays empty until deploy execution |

Pre-execution checklist:

1. Re-check active ports.
2. Validate backend config.
3. Confirm DB schema.
4. Confirm backup plan.
5. Record execution review.
6. Build to a temporary artifact directory first.
7. Confirm `/uconai/www/iso` can be rebuilt from source at any time.


