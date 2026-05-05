# HP Policy for ISO

## Paths

| Path | Rule |
|---|---|
| `/uconai/projects/iso` | Source of truth |
| `/uconai/www/iso` | Disposable frontend build artifact |
| `/uconai/data/iso` | Persistent ISO data |
| `/uconai/data/iso/storage` | Uploads and generated assets |
| `/uconai/data/iso/exports` | DOCX and OSD companion outputs |
| `/uconai/data/iso/logs` | Runtime logs |

## Runtime Gates

Separate operator authorization outside the ISO product is required before:

- DB creation or schema migration.
- Caddy route change or reload.
- Service start/restart.
- Docker/PM2/systemd changes.
- Deployment to `/uconai/www/iso`.
- Migration from 150.
- External paid AI provider connection.
- Any 150 server modification.

This file only records the ISO boundary. It does not define or implement the external operator authorization mechanism.

## Caddy State

The HP Caddy route must not proxy ISO traffic to `192.168.0.150`.

Current intended behavior:

| Route | Behavior |
|---|---|
| `/iso` | Redirect to `/iso/` |
| `/iso/*` | Serve `/uconai/www/iso` |
| `/iso/api/*` | Return 503 until `iso-api` is enabled and deployed |

Because Caddy admin is disabled, reload can fail. Use validated config plus an authorized restart when route changes are required.

## Membership Policy

ISO should use an independent PostgreSQL membership model. Do not directly couple ISO registration to a Django DB.

Future common login can be connected through an `external_identities` bridge.

