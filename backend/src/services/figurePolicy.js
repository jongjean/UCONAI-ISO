const editableSourceTypes = ["PPTX_SHAPES", "SVG_EDITABLE", "MERMAID", "XLSX_CHART", "DOCX_DRAWING"];
const strictStages = ["FDIS", "PUBLICATION"];

export function validateFigureAsset(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.label) {
    errors.push({ field: "label", code: "LABEL_REQUIRED", message: "Figure label is required." });
  }

  if (!input.sourceType) {
    warnings.push({ field: "sourceType", code: "SOURCE_TYPE_MISSING", message: "Editable source type is not identified." });
  } else if (!editableSourceTypes.includes(input.sourceType)) {
    warnings.push({ field: "sourceType", code: "NON_EDITABLE_OR_UNKNOWN_SOURCE", message: "Source type is not recognized as editable." });
  }

  if (input.pptxContainsOnlyRaster === true) {
    errors.push({ field: "source", code: "RASTER_ONLY_PPTX", message: "PPTX containing only a pasted raster image is not an editable figure source." });
  }

  const stage = input.stage || "PWI";
  const strictRequired = ["PUBLICATION"].includes(stage) || (stage === "DIS" && input.disStrictMode === true);
  if (strictRequired && !editableSourceTypes.includes(input.sourceType)) {
    errors.push({ field: "sourceType", code: "EDITABLE_SOURCE_REQUIRED", message: "Editable source is required at this stage." });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    editableSourceTypes
  };
}

export function buildFigureSpec(input = {}) {
  return {
    label: input.label || "Figure X",
    preferredSource: input.preferredSource || "PPTX_SHAPES",
    previewFormat: "PNG",
    editableRequirements: [
      "Internal text must be editable.",
      "Shapes/connectors should be editable where possible.",
      "Raster preview alone is not sufficient as source.",
      "Source file must be included in final asset package when required."
    ],
    suggestedObjects: input.objects || []
  };
}

export function buildFigureReadinessReport(input = {}) {
  const stage = input.stage || "PWI";
  const figures = Array.isArray(input.figures) ? input.figures : [];
  const results = figures.map((figure, index) => ({
    index,
    label: figure.label || `Figure ${index + 1}`,
    validation: validateFigureAsset({ ...figure, stage }),
    sourceEditable: editableSourceTypes.includes(figure.sourceType),
    hasPreview: Boolean(figure.previewPath || figure.previewUrl),
    hasEditableSource: Boolean(figure.sourcePath || figure.sourceUrl || editableSourceTypes.includes(figure.sourceType))
  }));

  const missingEditableSource = results.filter((item) => !item.hasEditableSource || !item.sourceEditable);
  const rasterOnly = results.filter((item) =>
    item.validation.errors.some((error) => error.code === "RASTER_ONLY_PPTX")
  );

  return {
    stage,
    strictMode: strictStages.includes(stage) || (stage === "DIS" && input.disStrictMode === true),
    counts: {
      total: figures.length,
      missingEditableSource: missingEditableSource.length,
      rasterOnly: rasterOnly.length
    },
    blockers: (strictStages.includes(stage) || (stage === "DIS" && input.disStrictMode === true))
      ? missingEditableSource.map((item) => ({
          code: "EDITABLE_FIGURE_SOURCE_REQUIRED",
          message: "Editable figure source is required for formal package readiness.",
          index: item.index,
          label: item.label
        }))
      : [],
    results,
    persistence: "disabled-until-storage-enabled"
  };
}

export function buildEditableSourcePackagePreview(input = {}) {
  const figures = Array.isArray(input.figures) ? input.figures : [];
  return {
    packageName: input.packageName || "iso-figure-sources",
    requiredItems: figures.map((figure, index) => ({
      index,
      label: figure.label || `Figure ${index + 1}`,
      preview: figure.previewPath || figure.previewUrl || null,
      editableSource: figure.sourcePath || figure.sourceUrl || null,
      expectedSourceType: figure.sourceType || "PPTX_SHAPES",
      ready: Boolean(figure.sourcePath || figure.sourceUrl) && editableSourceTypes.includes(figure.sourceType)
    })),
    persistence: "disabled-until-storage-enabled"
  };
}

export function buildEditableDiagramPlan(input = {}) {
  const diagramType = input.diagramType || "flowchart";
  const nodes = Array.isArray(input.nodes) ? input.nodes : [];
  const relationships = Array.isArray(input.relationships) ? input.relationships : [];

  return {
    diagramType,
    recommendedSourceTypes: recommendSourceTypes(diagramType),
    objects: nodes.map((node, index) => ({
      id: node.id || `node-${index + 1}`,
      text: node.text || `Label ${index + 1}`,
      editableText: true,
      shape: node.shape || defaultShapeFor(diagramType),
      role: node.role || "concept"
    })),
    relationships: relationships.map((relationship, index) => ({
      id: relationship.id || `rel-${index + 1}`,
      from: relationship.from || null,
      to: relationship.to || null,
      connectorEditable: true,
      label: relationship.label || null
    })),
    generationModes: [
      {
        mode: "pptx-shapes",
        use: "Best for committee editing and final source package handoff."
      },
      {
        mode: "svg-editable",
        use: "Good for web preview and vector editing where text remains selectable."
      },
      {
        mode: "mermaid",
        use: "Good for flowcharts and simple relationship diagrams as code source."
      },
      {
        mode: "drawio-xml",
        use: "Useful when complex diagrams need later visual editing."
      }
    ],
    rasterWarning: "PNG/JPG previews may be generated, but they are previews and not the editable source.",
    persistence: "disabled-until-storage-enabled"
  };
}

export function buildEditableFigureSourceBlueprint(input = {}) {
  const diagramType = input.diagramType || "venn";
  const title = input.title || "Editable figure source blueprint";
  const nodes = Array.isArray(input.nodes) && input.nodes.length > 0
    ? input.nodes
    : [
        { id: "a", text: "Concept A", shape: "ellipse" },
        { id: "b", text: "Concept B", shape: "ellipse" },
        { id: "intersection", text: "Shared area", shape: "intersection" }
      ];

  const textObjects = nodes.map((node, index) => ({
    id: node.id || `text-${index + 1}`,
    text: node.text || `Label ${index + 1}`,
    editable: true,
    binding: `figure.${node.id || index + 1}.text`
  }));

  return {
    title,
    diagramType,
    sourceBlueprint: {
      pptxShapes: {
        recommended: true,
        objects: nodes.map((node, index) => ({
          id: node.id || `shape-${index + 1}`,
          shape: node.shape || defaultShapeFor(diagramType),
          fillTransparency: String(diagramType).toLowerCase().includes("venn") ? 35 : 0,
          textObjectId: textObjects[index]?.id,
          editableGeometry: true,
          editableText: true
        })),
        exportNote: "Use native PPTX shapes and text boxes; do not paste a single raster image as the only source."
      },
      svgEditable: {
        recommended: true,
        textElements: textObjects.map((text) => ({ id: text.id, text: text.text, tag: "text", editable: true })),
        shapeElements: nodes.map((node, index) => ({ id: node.id || `shape-${index + 1}`, tag: svgTagFor(node.shape || defaultShapeFor(diagramType)) }))
      },
      drawioXml: {
        recommended: true,
        cells: nodes.map((node, index) => ({
          id: node.id || `cell-${index + 1}`,
          value: node.text || `Label ${index + 1}`,
          style: drawioStyleFor(node.shape || defaultShapeFor(diagramType)),
          editableText: true
        }))
      },
      mermaid: {
        recommended: recommendSourceTypes(diagramType).includes("MERMAID"),
        source: buildMermaidSketch(diagramType, nodes)
      }
    },
    deliverables: [
      "preview.png",
      "source.pptx",
      "source.svg",
      "source.drawio",
      "source-manifest.json"
    ],
    qualityChecks: [
      "Internal text remains editable.",
      "Shapes or connectors remain editable where the format supports it.",
      "Preview image is linked to the source manifest.",
      "Raster-only PPTX is rejected for formal package readiness."
    ],
    persistence: "blueprint-only-until-storage-enabled"
  };
}

export function buildFigureAuthoringGuidance(input = {}) {
  const stage = input.stage || "PWI";
  return {
    stage,
    guidance: [
      "Use code-first or shape-first generation for flowcharts, Venn diagrams, process diagrams and conceptual models.",
      "Keep diagram text as editable text objects whenever possible.",
      "Attach preview images only as previews, not as the authoritative source.",
      "Require editable source package readiness at final formal stages."
    ],
    preferredForVenn: ["PPTX_SHAPES", "SVG_EDITABLE", "DOCX_DRAWING"],
    preferredForFlowchart: ["MERMAID", "PPTX_SHAPES", "SVG_EDITABLE"],
    requiredAtStage: {
      DIS: input.disStrictMode === true ? "editable-source-required" : "strong-warning",
      FDIS: "editable-source-required",
      PUBLICATION: "editable-source-required"
    },
    persistence: "disabled-until-storage-enabled"
  };
}

function recommendSourceTypes(diagramType) {
  const normalized = String(diagramType).toLowerCase();
  if (normalized.includes("venn")) return ["PPTX_SHAPES", "SVG_EDITABLE", "DOCX_DRAWING"];
  if (normalized.includes("flow")) return ["MERMAID", "PPTX_SHAPES", "SVG_EDITABLE"];
  if (normalized.includes("chart")) return ["XLSX_CHART", "PPTX_SHAPES"];
  return ["PPTX_SHAPES", "SVG_EDITABLE", "MERMAID"];
}

function defaultShapeFor(diagramType) {
  const normalized = String(diagramType).toLowerCase();
  if (normalized.includes("venn")) return "ellipse";
  if (normalized.includes("flow")) return "rounded-rectangle";
  return "rectangle";
}

function svgTagFor(shape) {
  if (String(shape).toLowerCase().includes("ellipse")) return "ellipse";
  return "rect";
}

function drawioStyleFor(shape) {
  if (String(shape).toLowerCase().includes("ellipse")) return "ellipse;whiteSpace=wrap;html=1;";
  if (String(shape).toLowerCase().includes("intersection")) return "ellipse;whiteSpace=wrap;html=1;opacity=70;";
  return "rounded=1;whiteSpace=wrap;html=1;";
}

function buildMermaidSketch(diagramType, nodes) {
  const normalized = String(diagramType).toLowerCase();
  if (normalized.includes("flow")) {
    return [
      "flowchart LR",
      ...nodes.map((node, index) => `  ${node.id || `N${index + 1}`}[\"${node.text || `Label ${index + 1}`}\"]`)
    ].join("\n");
  }

  return [
    "flowchart LR",
    "  note[\"Mermaid is a planning source for this diagram type; use PPTX/SVG for editable Venn geometry.\"]",
    ...nodes.map((node, index) => `  ${node.id || `N${index + 1}`}((\"${node.text || `Label ${index + 1}`}\"))`)
  ].join("\n");
}

