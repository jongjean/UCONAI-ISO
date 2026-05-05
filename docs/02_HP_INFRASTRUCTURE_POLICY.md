# 2. HP Infrastructure Policy

Date: 2026-05-03
Status: 94% production candidate

## 2.1 Path Policy

| Purpose | Canonical path | Current state | Rule |
|---|---|---|---|
| Source | `/uconai/projects/iso` | Exists | Authoritative development source |
| Frontend deploy | `/uconai/www/iso` | Exists, 0 files | Disposable build output |
| Data root | `/uconai/data/iso` | Exists | Persistent ISO data root |
| DB staging | `/uconai/data/iso/db` | Exists, no DB | Bootstrap/migration notes only |
| Storage staging | `/uconai/data/iso/storage` | Exists | Future uploads/assets |
| Reference storage | `/uconai/data/iso/storage/references` | Exists | Future access-controlled references |
| Figure source storage | `/uconai/data/iso/storage/figure-sources` | Exists | Future editable PPTX/SVG/draw.io/Mermaid sources |
| Export storage | `/uconai/data/iso/storage/exports` | Exists | Future DOCX/OSD packages |
| Logs | `/uconai/data/iso/logs` | Exists | Future runtime logs |
| Backups | `/uconai/backups/iso` | Optional target | Production backup area |
| History | `/uconai/history/iso` | Optional target | Release/migration history |

Rules:

- `/uconai/projects/iso` is the only development source.
- `/uconai/www/iso` must never be treated as source.
- `/uconai/data/iso` may contain staging manifests and plans, but no production DB state exists yet.
- DB creation, migrations, service start and public deployment remain blocked.

## 2.2 Data Root Contract

| Path | Purpose | Current content rule |
|---|---|---|
| `/uconai/data/iso/DATA_ROOT_MANIFEST.md` | Data root record | Descriptive only |
| `/uconai/data/iso/db/bootstrap` | DB bootstrap plans | Non-executing notes only |
| `/uconai/data/iso/db/migrations` | Future migration staging | Empty except keep files |
| `/uconai/data/iso/storage/references` | Future registered references | Empty except keep files |
| `/uconai/data/iso/storage/figures` | Future previews | Empty except keep files |
| `/uconai/data/iso/storage/figure-sources` | Future editable sources | Empty except keep files |
| `/uconai/data/iso/storage/exports` | Future exports | Empty except keep files |
| `/uconai/data/iso/logs` | Future service logs | Empty except keep files |
| `/uconai/data/iso/audit` | Future audit exports | Empty except keep files |
| `/uconai/data/iso/tmp` | Future temporary jobs | Empty except keep files |

## 2.3 Port Reservation

Observed occupied ports from prior HP listener inspection:

| Port | Observed use |
|---:|---|
| 22 | SSH |
| 80, 443, 8080 | Caddy/web |
| 3042-3048, 3148 | Existing UCONAI projects |
| 5055 | Existing AI service |
| 5435 | Existing local DB service |
| 8140, 8240, 8440, 8455 | Existing services |

Reserved ISO draft range:

| Port | Component | Exposure | Status |
|---:|---|---|---|
| 4510 | `iso-api` | `127.0.0.1` only | Reserved draft |
| 4511 | `iso-worker` health | `127.0.0.1` only | Reserved draft |
| 4512 | `iso-scheduler` health | `127.0.0.1` only | Reserved draft |
| 4513-4519 | Future internal ISO services | `127.0.0.1` only | Reserved draft |

Before service enablement, listener inspection must be repeated.

## 2.4 Runtime Policy

| Stage | Runtime | Rule |
|---|---|---|
| Source development | No persistent service | Code/docs/tests only |
| Local prototype | Temporary dev command | Internal only |
| HP dev service | systemd preferred | Bind to `127.0.0.1` |
| Production | systemd for API/worker/scheduler | Backup, rollback and health checks required |

Current verified state:

- No `iso-api` service is running.
- No ISO PM2/systemd/Docker service exists.
- Docker exists on HP, but ISO has no Docker container.

## 2.5 Caddy Route Policy

Current `/etc/caddy/Caddyfile` ISO block:

```text
redir /iso /iso/ 308
handle /iso/api/* {
  respond "ISO API is not deployed yet" 503
}
handle_path /iso/* {
  root * /uconai/www/iso
  try_files {path} /index.html
  file_server
}
```

Current behavior:

| Path | Behavior |
|---|---|
| `/iso` | Redirects to `/iso/` |
| `/iso/api/*` | Returns 503 |
| `/iso/*` | Serves `/uconai/www/iso` |

Rules:

- ISO traffic must not proxy to `192.168.0.150`.
- Future `/iso/api/*` proxy may target `127.0.0.1:4510` only after API service enablement.
- Caddy config must be validated before reload/restart.
- Caddy reload/restart is a control-plane action outside ISO product code.

## 2.6 Secrets Policy

| Secret | Storage rule |
|---|---|
| DB password | Server-side secret file or service environment |
| JWT secret | Server-side secret file or service environment |
| External AI API key | Backend provider gateway only |
| SMTP/payment credentials | Server-side only |
| User passwords | Hashed only in DB |

Forbidden in source:

- `.env`
- `.env.production`
- Real API keys
- Real DB passwords
- Real JWT secrets

Allowed:

- `.env.example` with placeholders only.

## 2.7 Backup and Restore Policy

No production ISO DB/storage exists yet. Final policy:

| Target | Backup rule |
|---|---|
| PostgreSQL DB | Pre-migration dump and scheduled backup |
| Storage uploads | Permission-preserving file backup |
| Reference documents | Permission-preserving backup |
| Exports | Backup final packages; regenerate working exports when possible |
| Source | Git/history workflow under `/uconai/projects/iso` |

Before production DB migration:

1. Confirm backup command.
2. Write backup under `/uconai/backups/iso`.
3. Verify non-zero backup.
4. Record restore command.
5. Execute migration only after separate operator authorization outside ISO product code.

## 2.8 Monitoring and Logging Policy

| Endpoint | Purpose |
|---|---|
| `/health` | Process alive |
| `/ready` | Dependency readiness |
| `/api/v1/policy` | Non-secret policy visibility |
| `/api/v1/config-status` | Runtime config validation |

Future logs:

| Log | Path |
|---|---|
| API | `/uconai/data/iso/logs/iso-api.log` |
| Worker | `/uconai/data/iso/logs/iso-worker.log` |
| Scheduler | `/uconai/data/iso/logs/iso-scheduler.log` |

## Chapter 2 Cross-check

| Check | Result |
|---|---|
| 150 proxy removed from active ISO route | Passed |
| `/iso` points to HP path | Passed |
| `/iso/api/*` safely returns 503 | Passed |
| `/uconai/www/iso` contains 0 files | Passed |
| Data root exists with staging files only | Passed |
| No ISO DB created | Passed |
| No ISO service running | Passed |
| Secrets absent from committed source | Passed |
| Remaining risk | Need fresh listener scan immediately before service enablement |

## Chapter 2 Exit Criteria

| Criterion | State |
|---|---|
| Path policy verified | Complete |
| Data root contract verified | Complete |
| Port reservation documented | Complete |
| Runtime policy staged | Complete |
| Caddy route policy verified | Complete |
| Secrets policy documented | Complete |
| Backup/restore policy documented | Complete |
| Monitoring/logging policy documented | Complete |
| Current chapter progress | 94% |
