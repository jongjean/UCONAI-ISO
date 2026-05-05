# 23. Production Deployment

Status: Planned, not executed

Production deployment is planned, not executed in the current source phase.

Required sequence:

1. Tests pass.
2. DB backup exists if DB exists.
3. Frontend build succeeds.
4. Backend service health passes internally.
5. Caddy config validates.
6. Execution review is recorded.
7. Apply route/service changes.
8. Verify `https://uconcreative.ddns.net/iso/`.

## Release Gates

| Gate | Required Evidence |
|---|---|
| Source gate | `npm run check` passes on HP source |
| Build gate | frontend build succeeds outside `/uconai/www/iso` first |
| DB gate | backup, rollback, migration dry-run and schema diff are recorded |
| Service gate | internal backend health and config status pass on `127.0.0.1:4510` |
| Caddy gate | Caddy config validates before reload |
| Deploy gate | `/uconai/www/iso` receives only rebuildable artifacts |
| Public gate | `/iso/` and `/iso/api/health` verify after route activation |

## Rollback Requirements

| Area | Rollback Requirement |
|---|---|
| Frontend | Restore previous artifact or empty target safely |
| API service | Stop service and restore previous unit/env |
| Caddy | Revert route snippet and validate before reload |
| DB | Restore from backup or rollback migration if supported |
| AI provider | Disable provider credentials and premium feature flags |


