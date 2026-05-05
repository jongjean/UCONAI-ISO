# 17. Figures, Tables and Editable Sources

Date: 2026-05-03
Status: Editable-source policy baseline

## Objective

Figures may be previewed as images, but final submission needs editable sources when required. The system must warn users before a flat JPG becomes a publication blocker.

## Preferred Figure Sources

| Figure type | Preferred editable source |
|---|---|
| Flowchart | Mermaid, draw.io XML, PPTX shapes |
| Venn diagram | PPTX shapes or SVG with editable text |
| Process model | Mermaid or PPTX shapes |
| Concept diagram | PPTX shapes plus text boxes |

## Editable Source Blueprint

The figure engine must provide a source blueprint before any raster preview is treated as acceptable.

| Blueprint item | Requirement |
|---|---|
| PPTX shapes | Native shapes, connectors and text boxes remain editable |
| SVG editable | Text is stored as editable text elements, not flattened paths when possible |
| draw.io XML | Diagram cells retain editable values and shape styles |
| Mermaid | Used as code source for flowcharts and simple relationship diagrams |
| Source manifest | Preview image, editable source and quality checks are bound together |

For Venn diagrams and conceptual models, PPTX shapes or SVG editable source are preferred because internal labels and geometry can be edited by the committee.

## Completion Criteria

- Each figure records preview and editable source status.
- DIS and publication checks can block missing editable sources.
- AI provides source generation plans, not only raster prompts.
- The source blueprint identifies editable text objects, editable geometry and required source package files.

