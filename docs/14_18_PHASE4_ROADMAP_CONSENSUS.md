# Phase 4 Roadmap, Procedure, and Consensus Engine

This chapter group covers chapters 14 and 18. It turns the ISO roadmap from a date list into a procedure diary with stage missions, decision windows, meeting preparation, and advisory consensus risk management.

## 1. Phase 4 Objective

| Area | Contract | Source Artifact |
| --- | --- | --- |
| Track planning | 18, 24, 36 month recalculation | `buildTrackChangePreview` |
| Procedure diary | Meetings, ballots, consultations, required outputs, presentation/circulation tasks | `buildProcedureDiary` |
| Stage readiness | Area progress vs stage target thresholds | `buildStageReadinessMatrix` |
| Procedure windows | Ballot, consultation and decision windows as verified configuration | `buildProcedureWindowCatalog` |
| Compression risk | Track-change risk by stage readiness and unverified windows | `buildTrackCompressionRiskReport` |
| Meeting missions | Presentation, circulation and stakeholder focus board | `buildMeetingMissionBoard` |
| Calendar overlay | Meeting, ballot and consultation missions by date and evidence gap | `buildCalendarMissionOverlay` |
| Participation ledger | Attendance, presentation, circulation, objections and next missions | `buildMeetingParticipationLedger` |
| Stakeholder map | Support, concern, opposition, next engagement | `buildStakeholderMap` |
| Comment response | Theme classification, disposition posture, response mission | `buildCommentResponsePlan` |
| Consensus risk | Opposition, uncertainty, objection themes, priority missions | `buildConsensusRiskMap` |

## 2. Procedure Diary Model

| Stage | Diary Must Show |
| --- | --- |
| PWI | Need, scope boundary, committee fit, early supporter/opposition sensing |
| NP | Proposal package, title/scope confidence, participation plan, decision window |
| WD | Working outline, core definitions, technical issue list |
| CD | Committee draft, consultation, comment log, disposition method |
| DIS | Stable draft, reference readiness, editable figure source status |
| FDIS | Final decision package, clean export status, remaining editorial risks |
| PUBLICATION | Final DOCX, OSD companion report, editable source package |

## 3. Track Change Model

Track changes between 36, 24, and 18 months must recalculate:

| Recalculated Item | Reason |
| --- | --- |
| Target publication date | User must understand schedule compression or expansion |
| Stage target dates | Meeting and document missions depend on timing |
| Date delta by stage | Risk review needs exact change visibility |
| Accelerated-track warning | 18-month track leaves less room for unresolved scope, terms, references, and figures |
| Procedure window verification | Ballot and consultation duration values must be checked against current rules before automation |

## 3A. Meeting Mission Board

| Mission Area | Purpose |
| --- | --- |
| Presentation focus | What must be shown at the next meeting to keep the project moving |
| Circulation focus | What must be sent before or after the meeting |
| Stakeholder focus | Which supporter, concerned expert or objector needs engagement |
| Decision windows | Ballot and consultation checkpoints tied to the stage |

## 3C. Calendar Mission Overlay

| Overlay Area | Purpose |
| --- | --- |
| Days until checkpoint | Show urgency before meeting, ballot, consultation or stage target |
| Missing evidence | Mark what must be prepared before the checkpoint |
| Must present | Convert stage requirements into meeting presentation focus |
| Must circulate | Convert stage requirements into circulation package focus |
| Advisory memo | Explain whether the checkpoint is ready, watch, urgent, overdue or unscheduled |

## 3B. Meeting Participation Ledger

| Ledger Area | Purpose |
| --- | --- |
| Attendance | Show who joined or needs follow-up |
| Presentation | Mark whether the necessary stage material was presented |
| Circulation | Mark whether the required package or memo was circulated |
| Objection intent | Interpret scope, terminology, requirement, figure or reference concerns as advisory signals |
| Cooperation boundary | Record what kind of revision or evidence may make cooperation possible |
| Next mission themes | Convert meeting gaps into presentation, circulation and clarification tasks |

## 4. Consensus Guardrails

The system supports committee cooperation but does not pretend advisory guidance is official procedure.

| Guardrail | Requirement |
| --- | --- |
| Preserve facts | Original comments and rationale stay separate from AI interpretation |
| No misrepresentation | Stakeholder positions must not be distorted |
| Cooperation-first | Missions aim to clarify, negotiate, and document, not pressure |
| Advisory label | Consensus guidance is labeled advisory |

## 5. Phase 4 Cross-check

| Check | Required Result |
| --- | --- |
| Procedure diary route exists | Pass |
| Stage readiness route exists | Pass |
| Consensus risk route exists | Pass |
| 18/24/36 track profiles remain available | Pass |
| Diary contains meetings, ballots, consultations, must-present and must-circulate fields | Pass |
| Consensus risk map preserves advisory guardrails | Pass |
| Meeting participation ledger preserves advisory guardrails | Pass |
| Procedure window catalog avoids hardcoded official duration claims | Pass |
| Track compression risk report identifies high-risk accelerated stages | Pass |
| Meeting mission board connects presentation, circulation and stakeholder focus | Pass |
| Calendar mission overlay connects dates, missing evidence and checkpoint urgency | Pass |
| Route manifest covers all phase-4 endpoints | Pass |

Phase 4 remains source-only until DB-backed calendar, vote, meeting, comment, and audit records are enabled in a later execution phase.
