# 24. Operations and Maintenance

Status: Planned

Operations requirements:

- Log rotation before production.
- DB/storage backup schedule.
- Restore drill on non-production target.
- AI usage and quota review.
- Security review for roles, secrets and restricted files.
- Release notes for each production deployment.

## Operational Controls

| Control | Requirement |
|---|---|
| Logs | API, worker, scheduler and export job logs have retention and rotation |
| Backups | DB, storage, generated exports and audit data have schedules |
| Restore | Restore drill succeeds on non-production target before production reliance |
| Monitoring | Health, ready, error rate, job failures and disk usage are visible |
| AI usage | Provider/model/purpose, estimated credits and quota stops are monitored |
| Security | Secrets, role assignments, edit locks and restricted-source access are reviewed |
| Incident response | Service stop, Caddy rollback, provider disable and data restore paths are documented |

## Maintenance Rhythm

| Cadence | Task |
|---|---|
| Daily | Check service health, error logs and failed jobs |
| Weekly | Review storage growth, AI usage and unresolved blockers |
| Monthly | Test backup visibility and dependency/security updates |
| Before release | Run full source, runtime, export and rollback checks |
| After release | Record release notes and verification evidence |


