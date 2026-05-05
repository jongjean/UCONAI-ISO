# 9. Structured Document Engine

Date: 2026-05-03
Status: Starter model and validation baseline

## Objective

The document must be stored as structured elements, not as one large HTML blob. This is required for clause numbering, OSD readiness, version history, references, AI review, and DOCX export.

## Element Families

| Family | Examples |
|---|---|
| Front matter | Title, foreword, introduction |
| Normative clauses | Scope, references, terms, requirements |
| Informative content | Notes, examples, annexes |
| Assets | Tables, figures, editable source references |
| Links | Normative references, bibliography candidates, cross references |

## Rules

- Numbering must be generated from hierarchy.
- Old snapshots are read-only by default.
- AI output must preserve element identity and numbering intent.
- Clause warnings must appear before text becomes difficult to change procedurally.

## Completion Criteria

- Elements can be added, moved, reordered and validated.
- Number labels recalculate automatically.
- OSD readiness report can be produced by element.
- Section risk matrix identifies OSD-sensitive sections and change control level by stage.
- Change impact report identifies stage-aware downstream effects before submit.

## Section Risk Matrix

| Section | Risk reason |
|---|---|
| Title | Project identity and committee expectation can shift |
| Scope | Clause 1 boundary affects votes, overlap and deliverable fit |
| Terms | Clause 3 wording propagates through the whole document |
| Normative references | Clause 2 links must be resolved before formal readiness |
| Figures | Editable source and callout binding are formal package evidence |

## Change Impact Preview

| Change Area | Preview Behavior |
|---|---|
| Title and scope | Flags consensus, overlap, OSD entry and comment response impact |
| Terms and definitions | Flags terminology propagation and clause usage impact |
| References and endnotes | Flags citation location and bibliography binding impact |
| Figures and tables | Flags editable source package and caption numbering impact |
| Numbering | Flags outline and cross-reference impact |

