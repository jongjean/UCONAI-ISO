# Phase 8 HP Execution Readiness

This chapter covers HP internal execution readiness. It prepares source-level contracts for ports, environment variables, service drafts, Caddy route drafts, and preflight checks. It does not deploy.

## 1. Phase 8 Objective

| Area | Contract | Source Artifact |
| --- | --- | --- |
| Runtime config | Host, port, base path, data/storage/log paths | `backend/src/config.js` |
| Config validation | HP-safe runtime checks and protected operation list | `configValidation.js` |
| Preflight | Read-only path and port checks | `tools/iso_hp_preflight.py` |
| Service draft | Draft systemd unit, not installed | `infra/iso-api.service.draft` |
| Caddy draft | Draft route snippet, not active | `infra/Caddyfile.iso.draft` |
| Execution mode gate | Preview, internal API, systemd runtime and public deploy boundaries | `buildHpReadinessGate` |

## 2. HP Runtime Contract

| Setting | Required Value |
| --- | --- |
| API host | `127.0.0.1` |
| API port | `4510` |
| Public base path | `/iso/` |
| Source root | `/uconai/projects/iso` |
| Deploy root | `/uconai/www/iso` |
| Data root | `/uconai/data/iso` |
| Storage root | `/uconai/data/iso/storage` |
| Log root | `/uconai/data/iso/logs` |

## 3. Protected Operations

| Operation | State |
| --- | --- |
| DB create/migrate | Blocked |
| Caddy change/reload | Blocked |
| Service start/restart | Blocked |
| Deploy to `/uconai/www/iso` | Blocked |
| Paid AI provider | Blocked |
| Legacy data migration | Blocked |

## 4. Readiness Flow

1. Run source checks.
2. Run read-only HP preflight.
3. Confirm port `4510` is free before service start.
4. Build frontend only to a temporary build directory.
5. Validate Caddy draft syntax separately before active Caddy changes.
6. Install/start service only after execution review.
7. Copy build output to `/uconai/www/iso` only after deployment execution.

## 4A. Execution Modes

| Mode | Allowed Before Deploy | Boundary |
| --- | --- | --- |
| Frontend preview | Yes | Vite preview through SSH tunnel; no Caddy or deploy root change |
| Internal API preview | Yes | Temporary localhost process only |
| HP systemd runtime | No | Requires service execution review |
| Public `/iso/` deploy | No | Requires build artifact, Caddy validation and route activation |

Readiness checks also report optional preview port `5174` and reject lingering `codex exec`/smoke-test processes.

## 5. Phase 8 Cross-check

| Check | Required Result |
| --- | --- |
| Runtime host defaults to `127.0.0.1` | Pass |
| Runtime port defaults to `4510` | Pass |
| Storage and log roots match HP policy | Pass |
| Preflight checks paths and reserved ports read-only | Pass |
| Preflight reports optional preview port and Codex CLI process residue | Pass |
| Execution mode matrix route exists | Pass |
| HP readiness gate route exists | Pass |
| Draft service exists but is not installed | Pass |
| Draft Caddy snippet exists but is not active | Pass |
| `/uconai/www/iso` remains empty | Pass |
| ISO service is not running | Pass |

Phase 8 is complete when readiness contracts are in source and HP checks pass without activating runtime changes.
