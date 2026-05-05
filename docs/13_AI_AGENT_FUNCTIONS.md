# 13. AI Agent Functions

Date: 2026-05-03
Status: Agent contract baseline

## Objective

The AI layer is a team of controlled assistants, not one unconstrained chatbot.

## Agent Set

| Agent | Mission |
|---|---|
| Chief standard development agent | Coordinate document consistency, schedule, OSD readiness, specialist findings and final recommendations |
| Title and scope specialist | Review title, scope boundary, differentiation and committee fit |
| Terms and abbreviations specialist | Govern Clause 3, abbreviations, definitions and terminology consistency |
| Form 4 and draft specialist | Check NP proposal package, Form 4, draft maturity and proposal evidence |
| Directives checker | Detect rule, structure and process risks |
| OSD readiness checker | Prepare OSD-compatible structured content |
| Drafting style editor | Convert academic language into standards language |
| Scope and similarity reviewer | Identify overlap, ambiguity and scope creep |
| Consensus advisor | Suggest meeting missions and response themes |
| Figure source planner | Create editable diagram specifications |
| Bibliography assistant | Track citation candidates and later linkage |

## Chief Agent Council

The chief agent may organize a specialist council when a change affects more than one area. Specialist agents provide independent findings, risks and proposals. The chief agent compares them, exposes conflicts, and returns a single recommendation for the human editor.

| Council Element | Required Behavior |
|---|---|
| Specialist roster | Narrow role, explicit scope and output contract |
| Generated specialist | Created only when a task-specific gap is detected |
| Opinion conflict | Shown as a visible conflict, not hidden |
| Chief brief | Summarizes cross-chapter impact, OSD risk, schedule impact and next mission |
| Human editor | Remains the only actor who can accept changes into canonical text |

## Agent Brain Panel

The brain panel is the visible operating surface for the chief agent council.

| Brain Area | Purpose |
|---|---|
| Chief summary | Overall health, OSD readiness, schedule risk and next best action |
| Active context | Selected chapter, clause, stage and affected area |
| Specialist council | Agent opinions, stance, severity and proposal-only findings |
| Conflict board | Exposes disagreement between specialists and chief resolution |
| Mission queue | Converts findings into review, circulation, meeting or drafting tasks |
| Evidence links | Shows project policy, rule, reference or meeting evidence used by the panel |
| Human decision | Accept, defer, reject, memo or assign specialist without direct canonical write |

Agents are roles, not separate model or GPU allocations. Model and GPU execution is centralized by the AI gateway.

The frontend implementation now binds the brain panel to the selected chapter and selected clause. Specialist opinions, conflict board items, evidence links and action log entries change around the active editing context so the panel behaves like a working review console instead of a static status card.

## Completion Criteria

- Each agent has input/output contract.
- Each agent reports confidence and source type.
- The chief agent can coordinate specialists and generate narrow task-specific specialists.
- Advisory guidance is separated from official rules.

## Authoring Guidance Preview

| Channel | Role |
|---|---|
| Directives and OSD | Convert structure warnings into right-panel findings |
| Standards style | Detect academic phrasing, modal verb risk and long sentences |
| Scope and similarity | Flag overbroad or unclear scope wording before circulation |
| Consensus | Convert committee concerns into meeting mission themes |
| Editable source | Require editable figure source tracking at formal stages |

The preview API returns findings and suggestions only. It never writes canonical text and remains disabled for model execution until provider configuration, persistence and usage logging exist.

