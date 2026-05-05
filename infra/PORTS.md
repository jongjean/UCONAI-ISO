# ISO Port Reservation Draft

Last inspected: 2026-05-03

| Port | Component | Public | Status |
|---:|---|---|---|
| 4510 | `iso-api` | No | Draft reservation |
| 4511 | `iso-worker` health | No | Draft reservation |
| 4512 | `iso-scheduler` health | No | Draft reservation |
| 4513-4519 | Future ISO internal services | No | Draft reservation |

Observed occupied HP ports during read-only inspection:

| Port | Observed use |
|---:|---|
| 22 | SSH |
| 80, 443, 8080 | Caddy/web |
| 3042 | Bona |
| 3043 | Butterfly |
| 3044 | Koto/Mijeong |
| 3045 | Gonggu API |
| 3047 | ESGAI |
| 3048, 3148 | AINABI |
| 5055 | Gonggu AI |
| 5435 | Existing local DB service |
| 8140, 8240, 8440, 8455 | ESG/Gonggu services |

Before binding any port on HP:

1. Inspect active listeners.
2. Confirm no collision.
3. Record explicit execution review.
4. Start only the reviewed service.

All ISO ports must bind to `127.0.0.1` unless a separate execution review explicitly permits otherwise.

