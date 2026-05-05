# Phase 3 Document, Version, and Edit Ownership Governance

This chapter group covers chapters 9, 10, and 11. It defines how canonical ISO text is structured, versioned, and protected by a one-editor model before database persistence is enabled.

## 1. Governance Contract

| Layer | Contract | Source Artifact |
| --- | --- | --- |
| Structured document | Stable element keys, ISO element types, numbering preview, drafting warnings | `documentStructure.js` |
| Section risk matrix | OSD-sensitive areas and stage-based change control | `buildSectionRiskMatrix` |
| Version history | Read-only snapshots, date browser, diff preview, change impact, export binding | `versionPolicy.js` |
| Edit ownership | Single canonical editor, transfer validation, proposal mode, stale edit rejection | `editLockPolicy.js` |

## 2. Canonical Text Flow

| Step | Actor | Output |
| --- | --- | --- |
| Draft | Active editor | Structured element proposal |
| Validate | System | Rule warnings and blockers |
| Snapshot | System | Read-only version capture |
| Commit | Active editor | Canonical element update |
| Audit | System | Project audit event |

No route in this phase writes canonical text or persists snapshots. All current endpoints are preview, validation, or locked-operation stubs.

## 3. Required Safeguards

| Safeguard | Reason |
| --- | --- |
| Stable key | History, references, comments, and exports bind to stable elements |
| Single editor | Prevents simultaneous canonical text edits |
| Read-only history | Past date snapshots are browsed, not edited directly |
| High-risk historical unlock | Requires two-step confirmation and credential check later |
| Numbering preview | AI text must fit structural numbering before acceptance |

## 4. Stage Cautions

| Stage | Primary Caution |
| --- | --- |
| PWI | Keep title and scope exploratory until committee fit is clear |
| NP | Treat title and scope changes as high-impact project signals |
| WD | Resolve terms and definitions before propagation |
| CD | Preserve comments and disposition rationale beside text changes |
| DIS | Avoid uncontrolled changes to scope, references, figures and terms |
| FDIS | Limit edits to final decision readiness and export quality |
| PUBLICATION | Package accepted content without new substance |

## 5. Section Risk Matrix

| Area | Required Behavior |
| --- | --- |
| Title | Mark as high-risk after proposal movement |
| Scope | Warn about votes, overlap and deliverable fit |
| Terms | Warn about propagation through clauses and objections |
| References | Track formal linkage and readiness |
| Figures | Track editable source and package binding |

## 6. Change Impact Report

| Trigger | Required System Response |
| --- | --- |
| Scope or title change at CD/DIS/FDIS | Mark high risk and require scope, comment and OSD entry checks |
| Term or definition change at CD/DIS/FDIS | Mark high risk and require terminology propagation checks |
| Figure or table change at DIS/FDIS | Require editable source, caption and manifest checks |
| Numbering change | Require outline and cross-reference preview before submit |

The report is a preview contract. It does not write canonical text or unlock historical snapshots.

## 7. Phase 3 Cross-check

| Check | Required Result |
| --- | --- |
| Governance contract endpoint exists | Pass |
| Section risk matrix endpoint exists | Pass |
| Change impact report endpoint exists | Pass |
| Document element validation exists | Pass |
| Numbering preview exists | Pass |
| Snapshot preview exists | Pass |
| Historical unlock validate endpoint exists | Pass |
| Lock policy and transfer validation exist | Pass |
| Stale canonical edit rejection exists | Pass |
| Route manifest covers the phase-3 endpoints | Pass |

Phase 3 is ready for deeper editor implementation only when these checks stay green.
