# Phase 7 DOCX and OSD Export Contract

This chapter covers chapter 19. It defines export readiness, DOCX assembly planning, OSD companion reporting, and final package checks before any worker creates files.

## 1. Phase 7 Objective

| Area | Contract | Source Artifact |
| --- | --- | --- |
| Export request | Type, project, source version binding | `validateExportRequest` |
| Readiness | Structured elements, versions, references, bibliography, figures, OSD report | `buildExportReadinessReport` |
| Manifest | Expected files and metadata | `buildExportManifestPreview` |
| DOCX assembly | Element-to-style map, version bindings, generated numbering | `buildDocxAssemblyPlan` |
| OSD companion report | Structure, warnings, blockers, manifest | `buildOsdCompanionReportPreview` |
| Final package | Supplied file checklist and blockers | `buildFinalPackageChecklist` |
| DOCX style map | Element type to DOCX style and OSD mapping policy | `buildDocxStyleMap` |
| Formal export gate | Readiness, assembly, manifest, OSD checklist and package blockers | `buildFormalExportGateReport` |
| Source package binding | Figure preview, editable source, and manifest completeness | `buildSourcePackageBindingReport` |

## 2. Export Types

| Type | Use |
| --- | --- |
| `WORKING_DRAFT_DOCX` | Internal draft download |
| `CLEAN_DOCX` | Clean review or formal package candidate |
| `REDLINE_DOCX` | Change review copy |
| `COMMENTED_DOCX` | Comment/disposition review copy |
| `OSD_COMPANION_REPORT` | OSD readiness support report |
| `ASSET_PACKAGE` | Editable figure/source package |

## 3. Binding Rules

| Binding | Reason |
| --- | --- |
| Source version IDs | Export must be reproducible from known document history |
| Stable element keys | DOCX paragraphs map back to structured source |
| Generated numbering | Avoid pasted or stale numbering |
| Reference report | Normative and bibliography status must be visible |
| Editable figure source references | Final package must not rely on flat preview images |
| Source manifest | Figure preview and editable source files must bind through `source-manifest.json` |

## 4. OSD Companion Report

The report is not a replacement for OSD. It is a pre-OSD support artifact that shows:

| Section | Purpose |
| --- | --- |
| Project/deliverable summary | Confirm context |
| Stage/track summary | Confirm procedural posture |
| Structured element map | Confirm OSD-ready structure |
| Version binding map | Confirm source history |
| Reference/bibliography readiness | Confirm formal source hygiene |
| Editable figure readiness | Confirm source package status |
| Warnings/blockers | Confirm unresolved risks |
| Export manifest | Confirm expected files |

## 5. Formal Export Gate

The formal gate report combines the export readiness checklist, DOCX assembly plan, manifest, package checklist and OSD entry checklist.

| Gate Area | Required Behavior |
| --- | --- |
| Readiness | Required checks must be complete for the target stage |
| Assembly | Every exported element keeps stable key, generated numbering and source version binding |
| OSD entry | DOCX, source version map, OSD report and figure source package are visible when required |
| Package | Required files are listed and missing files become blockers |
| Source package binding | `preview.png`, one editable source, and `source-manifest.json` are checked together |
| Execution | File generation stays disabled until storage and worker policy are enabled |

## 6. Phase 7 Cross-check

| Check | Required Result |
| --- | --- |
| DOCX assembly route exists | Pass |
| OSD companion report route exists | Pass |
| Final package checklist route exists | Pass |
| DOCX style map route exists | Pass |
| Formal export gate route exists | Pass |
| Source package binding route exists | Pass |
| DOCX style mapping exists | Pass |
| Source version binding warning exists | Pass |
| Editable figure source reference warning exists | Pass |
| Route manifest covers all phase-7 endpoints | Pass |

Phase 7 remains source-only until storage, worker execution, and version persistence are enabled.
