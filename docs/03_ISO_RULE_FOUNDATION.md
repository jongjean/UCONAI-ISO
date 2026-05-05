# 3. ISO Rule Foundation

Date: 2026-05-03
Status: Chapter 3 specification baseline

## 3.1 Official Source Map

The ISO platform must distinguish official rules from guidance and AI heuristics.

Primary official/reference sources:

| Source | URL | Use in ISO engine | Source class |
|---|---|---|---|
| ISO Directives and Policies | https://www.iso.org/directives-and-policies.html | Official rule map for standards development and drafting | `OFFICIAL_RULE_INDEX` |
| ISO/IEC Directives Part 1 and Consolidated ISO Supplement | https://www.iso.org/sites/directives/current/consolidated/ | Procedures for technical work, project stages and programme rules | `OFFICIAL_RULE` |
| ISO/IEC Directives Part 2 | https://www.iso.org/directives-and-policies.html | Drafting, structure and language rules | `OFFICIAL_RULE` |
| ISO Drafting Standards | https://www.iso.org/drafting-standards.html | Drafting templates, OSD default note, house style resources | `OFFICIAL_GUIDANCE` |
| ISO Deliverables | https://www.iso.org/deliverables-all.html | IS, TS, TR, PAS, IWA, Guide classification | `OFFICIAL_GUIDANCE` |
| OSD Knowledge Base | https://helpdesk-docs.iso.org/collection/604-online-standards-development-osd | OSD use, permissions, drafting, commenting, changes and validation | `OFFICIAL_GUIDANCE` |
| What is OSD | https://helpdesk-docs.iso.org/article/649-what-is-online-standards-development-osd | OSD concept and collaboration workflow | `OFFICIAL_GUIDANCE` |
| OSD adoption | https://helpdesk-docs.iso.org/article/784-osd-adoption-by-iso-committes-and-eligible-projects | OSD as default for eligible deliverables from January 2025 | `OFFICIAL_GUIDANCE` |

Policy:

- The system must store source URL, title, source class, date retrieved and confidence for every rule family.
- The AI must not present a heuristic as an official ISO rule.
- The UI must show whether a warning is official, guidance-based, project-policy-based or heuristic.

## 3.2 Rule Classification

| Class | Meaning | UI label | Can block workflow |
|---|---|---|---|
| `OFFICIAL_RULE` | Rule from ISO/IEC Directives or official procedure | Official rule | Yes |
| `OFFICIAL_GUIDANCE` | ISO/OSD guidance, templates, helpdesk or drafting support | Official guidance | Sometimes |
| `PROJECT_POLICY` | UCONAI/ISO project policy set by user/admin | Project policy | Yes |
| `EXPERT_HEURISTIC` | Practical committee/editor experience not directly codified | Expert advice | No by default |
| `AI_INFERENCE` | Model-generated interpretation requiring review | AI inference | No |
| `USER_NOTE` | User-entered memo or committee memory | Project note | No |

Blocking policy:

- `OFFICIAL_RULE` and approved `PROJECT_POLICY` can block stage transitions or final export.
- `OFFICIAL_GUIDANCE` can create strong warnings.
- `EXPERT_HEURISTIC` and `AI_INFERENCE` must remain advisory.

## 3.3 Deliverable Types

The platform must support deliverable-aware behavior.

| Deliverable | General purpose | Engine implication |
|---|---|---|
| IS | International Standard | Full normative structure, ballots, final publication readiness |
| TS | Technical Specification | Work still under development with possible future IS path |
| TR | Technical Report | Informative content; avoid treating all content as requirements |
| PAS | Publicly Available Specification | Urgent market need; feedback and possible future transformation |
| IWA | International Workshop Agreement | Workshop-based path; time-limited and transformation/withdrawal awareness |
| Guide | Guidance document | Guidance-specific wording and structure |

Controls:

- Deliverable type must be selected at project creation.
- Document template, roadmap, warning strength and export checklist depend on deliverable type.
- The system must prevent generic IS assumptions from being blindly applied to TR/TS/PAS/IWA/Guide.

## 3.4 Stage Model

Baseline stages:

| Stage | Engine role |
|---|---|
| PWI | Early concept, scope shaping, stakeholder sensing |
| NP | Proposal, justification, national body/committee decision risk |
| WD | Working draft, technical drafting, internal consensus building |
| CD | Committee draft, comments and dispositions become central |
| DIS | Draft International Standard or equivalent advanced ballot stage |
| FDIS | Final decision stage where applicable |
| Publication | Final document/package and source readiness |

Rules:

- Stage state must drive warnings, edit restrictions, required evidence and export readiness.
- Stage advancement must be explicit and auditable.
- Track change must recalculate roadmap and show consequences before confirmation.

## 3.5 OSD Readiness Model

OSD is treated as the official/default destination workflow, not as the internal authoring engine.

The ISO platform is a pre-OSD authoring and control environment.

Required readiness dimensions:

| Dimension | Requirement |
|---|---|
| Element structure | Content separated into title, scope, clauses, terms, notes, examples, references, annexes, figures and tables |
| Numbering | Automatic, structural numbering; no hardcoded AI numbering |
| References | Normative references separated from bibliography candidates |
| Terms | Structured term entries with source and notes |
| Figures | Editable source status tracked |
| Comments | Comment/disposition history preserved |
| Changes | Version and decision history preserved |
| Export | DOCX and OSD companion report bound to source versions |

## 3.6 Clause Drafting Rules

Initial drafting rule families:

| Rule family | Engine checks |
|---|---|
| Title | Clarity, scope fit, stage-change warning |
| Scope | Boundary clarity, exclusions, avoid requirements hidden in scope |
| Normative references | Relevance, necessity, currentness, separation from bibliography |
| Terms and definitions | Existing term search prompt, admitted/deprecated term handling |
| Abbreviations | Consistency, first use, duplicate definitions |
| Requirements | Shall/should/may/can consistency |
| Notes/examples | Non-normative treatment |
| Annexes | Normative vs informative marking |
| Tables | Editable structure, numbering, reference from text |
| Figures | Editable source, text editability, source package readiness |
| Bibliography | Deferred linking early; formal readiness later |

## 3.7 Tacit and Consensus Guidance

The system must support human consensus without pretending that all advice is official.

Advisory factors:

| Factor | Use |
|---|---|
| Meeting participation | Track whether key material was presented or circulated |
| Opposition intent | Record concern, rationale, possible cooperation path |
| Committee memory | Record historical reasons and unresolved sensitivities |
| Mission theme | Define what agreement must be secured before the next stage |
| Vote risk | Summarize support, opposition, abstention and missing evidence |

Guardrails:

- Do not manipulate or misrepresent stakeholder positions.
- Clearly label consensus guidance as advisory.
- Preserve facts, comments and decisions separately from AI interpretation.

## Chapter 3 Cross-check

| Check | Result |
|---|---|
| Official source classes defined | Passed |
| OSD default principle captured | Passed |
| Deliverable types separated | Passed |
| Stage model documented | Passed |
| Official/advisory boundary documented | Passed |
| Example projects excluded from rule foundation | Passed |

## Chapter 3 Exit Criteria

| Criterion | State |
|---|---|
| Official source map created | Complete |
| Rule classification defined | Complete |
| Deliverable families defined | Complete |
| Stage model baseline defined | Complete |
| OSD readiness dimensions defined | Complete |
| Drafting rule families defined | Complete |
| Tacit guidance boundary defined | Complete |
| Remaining work | Later chapters convert these specifications into DB tables and validation services |


