# 10. Version History

Date: 2026-05-03
Status: Policy baseline

## Objective

Every meaningful document change must create a traceable history record. Historical records are read-only unless the user passes a two-step warning and password confirmation flow.

## Snapshot Policy

| Item | Requirement |
|---|---|
| Timestamp | Required |
| Actor | Required |
| Element ID | Required |
| Reason | Required for high-impact changes |
| Diff | Required when text changes |
| Stage context | Required after formal project progress |

## Completion Criteria

- Users can view past versions by date.
- Past versions cannot be edited accidentally.
- High-risk unlocks create security and audit events.

