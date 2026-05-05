# Phase 5 References, Terms, and Editable Figures

This chapter group covers chapters 15, 16, and 17. It defines how the ISO platform manages reference evidence, term discipline, and editable figure source readiness before storage or DB persistence is enabled.

## 1. Phase 5 Objective

| Area | Contract | Source Artifact |
| --- | --- | --- |
| Reference governance | Metadata, AI-use mode, normative vs bibliography intent, formal-stage linkage | `referencePolicy.js` |
| Source use decisions | Summarize, compare, limited quote or exclude by source and target element | `buildSourceUseDecisionReport` |
| Bibliography planning | Deferred link candidates before DIS, formal readiness later | `buildBibliographyLinkPreview` |
| Endnote binding | Lightweight early records, formal element/note binding after DIS | `buildEndnoteBindingPlan` |
| Terminology | Term/definition validation, source warning, requirement boundary, duplicate/unused checks | `terminologyPolicy.js` |
| Editable figures | PPTX/SVG/Mermaid/XLSX/DOCX source tracking and raster-only rejection | `figurePolicy.js` |
| Diagram planning | Editable text/shapes/connectors for Venn, flowchart, chart and conceptual diagrams | `buildEditableDiagramPlan` |
| Supporting materials readiness | Clause 2, Clause 3 and editable figure source readiness as one package | `buildSupportingMaterialsReadiness` |

## 2. Reference Governance

| Field | Required Meaning |
| --- | --- |
| `title` | Source title |
| `documentType` | ISO, IEC, regulation, paper, meeting material, internal note or other |
| `aiUseMode` | Exclude, summarize, compare, limited quote, pending |
| `normative` | Candidate for Clause 2 control |
| `bibliographyCandidate` | Candidate for later bibliography/endnote linkage |
| `linkedElementStableKey` | Clause/element where source relevance is recorded |

DIS and later require stricter review of reference intent, AI use mode, and target linkage.

Endnote binding remains deferred during early drafting. At DIS and later, bibliography candidates need a reference, target element stable key and note text so OSD entry can be prepared without guessing source location late in the project.

### Source Use Decision Report

| AI Use Mode | System Behavior |
| --- | --- |
| Exclude | Register the source, show awareness, block AI synthesis |
| Summarize | Create advisory notes without pasting canonical text |
| Compare | Compare scope, terms, method and differentiation claims |
| Limited quote | Require source location, quote limit check and element trace |
| Pending | Block source influence until the mode is selected |

Formal stages require target element linkage for normative and bibliography candidates before final binding.

## 3. Terminology Governance

| Check | Reason |
| --- | --- |
| Term and definition required | Clause 3 entries must be substantive |
| Existing source warning | Avoid unnecessary new terms or conflicting definitions |
| Requirement boundary | Definitions should not hide requirements |
| Duplicate term detection | Avoid inconsistent concept control |
| Body-use detection | Detect defined terms not yet used in the document |

Term edits are high-impact because they can affect title, scope, clauses, figures, and committee consensus.

## 4. Editable Figure Governance

The platform distinguishes previews from authoritative editable source.

| Source Type | Use |
| --- | --- |
| `PPTX_SHAPES` | Best practical handoff for committee editing |
| `SVG_EDITABLE` | Vector source with selectable text when authored correctly |
| `MERMAID` | Code-first flowcharts and simple relationships |
| `XLSX_CHART` | Editable charts backed by spreadsheet data |
| `DOCX_DRAWING` | Word-native drawing shapes where practical |

Raster-only PPTX files are not valid editable sources. PNG/JPG may be generated as previews, but they are not the source of truth.

### Editable Source Blueprint

Before figure generation, the figure engine returns a blueprint that separates preview files from source files. The blueprint defines native PPTX shape objects, editable SVG text elements, draw.io XML cells, Mermaid source where suitable, and a source manifest that binds each preview to its editable origin.

This is especially important for Venn diagrams and conceptual diagrams, where internal labels and geometry need to remain editable for committee review and final source package handoff.

## 5. Supporting Materials Readiness

The platform must treat references, terms and figure source files as one formal readiness package after draft exploration.

| Binding | Required Check |
| --- | --- |
| Clause 2 | Normative references link to document elements or are explicitly resolved |
| Clause 3 | Terms are valid, sourced, non-duplicated and used in the body where expected |
| Figure sources | Each figure tracks preview and editable source separately |
| Formal stages | DIS/FDIS/publication readiness blocks on unresolved linkage or missing editable sources |
| Source boundary | Normative references, bibliography candidates, terms and figure sources remain separate data types |

## 6. Phase 5 Cross-check

| Check | Required Result |
| --- | --- |
| Reference governance matrix route exists | Pass |
| Source use decision report route exists | Pass |
| Endnote binding plan route exists | Pass |
| Supporting materials readiness route exists | Pass |
| Term consistency report route exists | Pass |
| Figure diagram plan route exists | Pass |
| Figure source blueprint route exists | Pass |
| Figure authoring guidance route exists | Pass |
| Editable source types include PPTX, SVG, Mermaid, XLSX, DOCX drawing | Pass |
| Raster-only PPTX is rejected | Pass |
| Formal-stage reference linkage and AI-use checks exist | Pass |
| Route manifest covers all phase-5 endpoints | Pass |

Phase 5 remains source-only until DB and storage execution are enabled.
