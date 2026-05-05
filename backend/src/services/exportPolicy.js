const exportTypes = [
  "WORKING_DRAFT_DOCX",
  "CLEAN_DOCX",
  "REDLINE_DOCX",
  "COMMENTED_DOCX",
  "OSD_COMPANION_REPORT",
  "ASSET_PACKAGE"
];

const formalStages = ["DIS", "FDIS", "PUBLICATION"];

export function validateExportRequest(input = {}) {
  const errors = [];
  const warnings = [];

  if (!exportTypes.includes(input.type)) {
    errors.push({ field: "type", code: "INVALID_EXPORT_TYPE", message: "Export type is not supported." });
  }

  if (!input.projectId) {
    errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  }

  if (!input.sourceVersionIds || input.sourceVersionIds.length === 0) {
    warnings.push({ field: "sourceVersionIds", code: "VERSION_BINDING_MISSING", message: "Export should bind to source version IDs." });
  }

  return { ok: errors.length === 0, errors, warnings, exportTypes };
}

export function buildReadinessChecklist(input = {}) {
  const stage = input.stage || "PWI";
  return {
    stage,
    checks: [
      { id: "structured-elements", label: "Structured document elements", required: true },
      { id: "version-binding", label: "Version-bound source snapshot", required: true },
      { id: "references", label: "Normative references reviewed", required: ["DIS", "FDIS", "PUBLICATION"].includes(stage) },
      { id: "bibliography", label: "Bibliography/endnote links reviewed", required: ["DIS", "FDIS", "PUBLICATION"].includes(stage) },
      { id: "editable-figures", label: "Editable figure source package", required: ["PUBLICATION"].includes(stage) },
      { id: "osd-report", label: "OSD companion report", required: ["DIS", "FDIS", "PUBLICATION"].includes(stage) }
    ]
  };
}

export function buildExportReadinessReport(input = {}) {
  const stage = input.stage || "PWI";
  const checklist = buildReadinessChecklist(input).checks;
  const provided = new Set(input.completedChecks || []);
  const checks = checklist.map((check) => ({
    ...check,
    complete: provided.has(check.id) || check.required === false,
    blocking: check.required === true && !provided.has(check.id)
  }));

  return {
    stage,
    ready: checks.every((check) => !check.blocking),
    checks,
    blockers: checks.filter((check) => check.blocking),
    warnings: buildExportWarnings(input),
    persistence: "disabled-until-storage-worker-enabled"
  };
}

export function buildExportManifestPreview(input = {}) {
  const type = input.type || "WORKING_DRAFT_DOCX";
  const validation = validateExportRequest({
    ...input,
    projectId: input.projectId || "preview-only"
  });

  return {
    validation,
    manifest: {
      type,
      projectId: input.projectId || null,
      stage: input.stage || "PWI",
      sourceVersionIds: input.sourceVersionIds || [],
      files: plannedFilesFor(type, input.stage || "PWI"),
      metadata: {
        generatedBy: "iso-export-preview",
        executionAllowed: false,
        blockedReason: "Export job execution requires storage, version binding and worker enablement review."
      }
    },
    persistence: "disabled-until-storage-worker-enabled"
  };
}

export function buildDocxAssemblyPlan(input = {}) {
  const elements = Array.isArray(input.elements) ? input.elements : [];
  const stage = input.stage || "PWI";
  const sections = elements.map((element, index) => ({
    index,
    stableKey: element.stableKey || `element-${index + 1}`,
    type: element.type || "CLAUSE",
    numbering: element.numbering || null,
    title: element.title || null,
    includeInDocx: element.includeInDocx !== false,
    style: docxStyleFor(element.type || "CLAUSE"),
    sourceVersionId: element.sourceVersionId || null,
    warnings: elementWarnings(element, stage)
  }));

  return {
    stage,
    outputType: input.type || "WORKING_DRAFT_DOCX",
    assemblyAllowed: false,
    sections,
    requiredBindings: [
      "sourceVersionId per exported element",
      "stableKey to DOCX paragraph/style map",
      "numbering generated from structure",
      "figure preview plus editable source reference",
      "reference and bibliography report for formal stages"
    ],
    blockedReason: "DOCX assembly waits for storage, version binding and worker execution.",
    persistence: "disabled-until-storage-worker-enabled"
  };
}

export function buildOsdCompanionReportPreview(input = {}) {
  const stage = input.stage || "PWI";
  const readiness = buildExportReadinessReport(input);
  const manifest = buildExportManifestPreview({
    ...input,
    type: input.type || "OSD_COMPANION_REPORT",
    projectId: input.projectId || "preview-only"
  }).manifest;

  return {
    stage,
    report: {
      title: "OSD companion readiness report",
      purpose: "Help the editor understand what must be checked before entering or updating OSD.",
      structure: [
        "project and deliverable summary",
        "stage and track summary",
        "structured element map",
        "version binding map",
        "reference and bibliography readiness",
        "editable figure source readiness",
        "open warnings and blockers",
        "export manifest"
      ],
      readiness,
      manifest
    },
    persistence: "disabled-until-storage-worker-enabled"
  };
}

export function buildFinalPackageChecklist(input = {}) {
  const stage = input.stage || "PWI";
  const files = plannedFilesFor(input.type || "CLEAN_DOCX", stage);
  const supplied = new Set(input.suppliedFiles || []);
  const items = files.map((file) => ({
    ...file,
    supplied: supplied.has(file.name),
    blocking: file.required === true && !supplied.has(file.name)
  }));

  return {
    stage,
    packageReady: items.every((item) => !item.blocking),
    items,
    blockers: items.filter((item) => item.blocking),
    warnings: buildExportWarnings(input),
    persistence: "disabled-until-storage-worker-enabled"
  };
}

export function buildDocxStyleMap(input = {}) {
  const elementTypes = Array.isArray(input.elementTypes) && input.elementTypes.length > 0
    ? input.elementTypes
    : ["TITLE", "FOREWORD", "INTRODUCTION", "SCOPE", "NORMATIVE_REFERENCES", "TERM", "ABBREVIATION", "CLAUSE", "PARAGRAPH", "LIST", "NOTE", "EXAMPLE", "TABLE", "FIGURE", "ANNEX", "BIBLIOGRAPHY"];

  return {
    styles: elementTypes.map((type) => ({
      elementType: type,
      docxStyle: docxStyleFor(type),
      numberingGenerated: ["SCOPE", "NORMATIVE_REFERENCES", "TERM", "ABBREVIATION", "CLAUSE", "ANNEX"].includes(type),
      osdMappingRequired: ["TITLE", "SCOPE", "NORMATIVE_REFERENCES", "TERM", "FIGURE", "ANNEX", "BIBLIOGRAPHY"].includes(type)
    })),
    policy: {
      hardcodedNumberingBlocked: true,
      stableElementKeyRequired: true,
      styleMapVersioned: true
    },
    persistence: "disabled-until-storage-worker-enabled"
  };
}

export function buildFormalExportGateReport(input = {}) {
  const stage = input.stage || "PWI";
  const readiness = buildExportReadinessReport(input);
  const assembly = buildDocxAssemblyPlan(input);
  const manifest = buildExportManifestPreview({
    ...input,
    projectId: input.projectId || "preview-only",
    type: input.type || "CLEAN_DOCX"
  }).manifest;
  const finalPackage = buildFinalPackageChecklist(input);
  const blockers = [
    ...readiness.blockers.map((item) => ({
      area: "readiness",
      code: item.id,
      message: `${item.label} is required.`
    })),
    ...assembly.sections.flatMap((section) =>
      section.warnings
        .filter((warning) => formalStages.includes(stage) || warning.code === "SOURCE_VERSION_BINDING_MISSING")
        .map((warning) => ({
          area: "docx-assembly",
          code: warning.code,
          message: warning.message,
          stableKey: section.stableKey
        }))
    ),
    ...finalPackage.blockers.map((item) => ({
      area: "package",
      code: "PACKAGE_FILE_MISSING",
      message: `${item.name} is required in the export package.`
    }))
  ];

  return {
    stage,
    type: input.type || "CLEAN_DOCX",
    formalStage: formalStages.includes(stage),
    gateOpen: blockers.length === 0,
    readiness,
    assembly,
    manifest,
    finalPackage,
    blockers,
    osdEntryChecklist: buildOsdEntryChecklist({ stage, manifest, blockers }),
    persistence: "disabled-until-storage-worker-enabled"
  };
}

export function buildSourcePackageBindingReport(input = {}) {
  const stage = input.stage || "PWI";
  const figures = Array.isArray(input.figures) ? input.figures : [];
  const formalStage = formalStages.includes(stage);
  const rows = figures.map((figure, index) => {
    const deliverables = Array.isArray(figure.deliverables) ? new Set(figure.deliverables) : new Set();
    const hasPreview = deliverables.has("preview.png") || Boolean(figure.previewPath || figure.previewUrl);
    const hasPptxSource = deliverables.has("source.pptx") || Boolean(figure.pptxSourcePath);
    const hasSvgSource = deliverables.has("source.svg") || Boolean(figure.svgSourcePath);
    const hasDrawioSource = deliverables.has("source.drawio") || Boolean(figure.drawioSourcePath);
    const hasManifest = deliverables.has("source-manifest.json") || Boolean(figure.manifestPath);
    const editableSourceCount = [hasPptxSource, hasSvgSource, hasDrawioSource].filter(Boolean).length;
    const missing = [];

    if (!hasPreview) missing.push("preview.png");
    if (editableSourceCount === 0) missing.push("source.pptx/source.svg/source.drawio");
    if (!hasManifest) missing.push("source-manifest.json");

    return {
      index,
      label: figure.label || `Figure ${index + 1}`,
      hasPreview,
      hasEditableSource: editableSourceCount > 0,
      hasManifest,
      sourceTypes: [
        hasPptxSource ? "PPTX_SHAPES" : null,
        hasSvgSource ? "SVG_EDITABLE" : null,
        hasDrawioSource ? "DRAWIO_XML" : null
      ].filter(Boolean),
      ready: missing.length === 0,
      missing,
      blocking: formalStage && missing.length > 0
    };
  });

  return {
    stage,
    formalStage,
    packageName: input.packageName || "figure-source-package.zip",
    requiredManifest: "source-manifest.json",
    rows,
    ready: rows.every((row) => !row.blocking),
    blockers: rows
      .filter((row) => row.blocking)
      .map((row) => ({
        area: "figure-source-package",
        code: "FIGURE_SOURCE_BINDING_INCOMPLETE",
        label: row.label,
        missing: row.missing
      })),
    packageFiles: [
      "preview.png",
      "source.pptx",
      "source.svg",
      "source.drawio",
      "source-manifest.json"
    ],
    persistence: "binding-report-only-until-storage-worker-enabled"
  };
}

function buildExportWarnings(input) {
  const warnings = [];
  if (!input.sourceVersionIds || input.sourceVersionIds.length === 0) {
    warnings.push({
      code: "VERSION_BINDING_MISSING",
      message: "Export should bind to source version IDs before it is treated as official."
    });
  }
  if (["DIS", "FDIS", "PUBLICATION"].includes(input.stage) && input.referenceReady !== true) {
    warnings.push({
      code: "REFERENCE_READINESS_MISSING",
      message: "Formal-stage export should include reference readiness evidence."
    });
  }
  if (["FDIS", "PUBLICATION"].includes(input.stage) && input.figureSourcesReady !== true) {
    warnings.push({
      code: "FIGURE_SOURCE_PACKAGE_MISSING",
      message: "Final-stage export should include editable figure source package status."
    });
  }
  return warnings;
}

function buildOsdEntryChecklist({ stage, manifest, blockers }) {
  return [
    {
      id: "docx",
      label: "DOCX file generated from structured source",
      ready: manifest.files.some((file) => file.name === "document.docx") && blockers.every((blocker) => blocker.code !== "structured-elements")
    },
    {
      id: "source-map",
      label: "Source version map included",
      ready: manifest.files.some((file) => file.name === "source-version-map.json") && blockers.every((blocker) => blocker.code !== "VERSION_BINDING_MISSING")
    },
    {
      id: "osd-report",
      label: "OSD companion report included for formal stage",
      ready: !formalStages.includes(stage) || manifest.files.some((file) => file.name === "osd-readiness-report.md")
    },
    {
      id: "figure-sources",
      label: "Editable figure source package present when required",
      ready: !["FDIS", "PUBLICATION"].includes(stage) || manifest.files.some((file) => file.name === "figure-source-package.zip")
    }
  ];
}

function plannedFilesFor(type, stage) {
  const base = [
    { name: "document.docx", required: true },
    { name: "export-metadata.json", required: true },
    { name: "source-version-map.json", required: true }
  ];

  if (["DIS", "FDIS", "PUBLICATION"].includes(stage) || type === "OSD_COMPANION_REPORT") {
    base.push({ name: "osd-readiness-report.md", required: true });
    base.push({ name: "reference-readiness-report.md", required: true });
  }

  if (type === "ASSET_PACKAGE" || ["FDIS", "PUBLICATION"].includes(stage)) {
    base.push({ name: "figure-source-package.zip", required: true });
  }

  if (type === "COMMENTED_DOCX") {
    base.push({ name: "comment-disposition-report.md", required: true });
  }

  return base;
}

function docxStyleFor(type) {
  const styles = {
    TITLE: "Title",
    FOREWORD: "ISO Foreword",
    INTRODUCTION: "ISO Introduction",
    SCOPE: "Heading 1",
    NORMATIVE_REFERENCES: "Heading 1",
    TERM: "Heading 1",
    ABBREVIATION: "Heading 1",
    CLAUSE: "Heading 1",
    PARAGRAPH: "Body Text",
    LIST: "ISO Numbered List",
    NOTE: "ISO Note",
    EXAMPLE: "ISO Example",
    TABLE: "ISO Table",
    FIGURE: "ISO Figure",
    ANNEX: "ISO Annex",
    BIBLIOGRAPHY: "ISO Bibliography"
  };
  return styles[type] || "Body Text";
}

function elementWarnings(element, stage) {
  const warnings = [];
  if (!element.sourceVersionId) {
    warnings.push({ code: "SOURCE_VERSION_BINDING_MISSING", message: "Element should bind to a source version before export." });
  }
  if (element.type === "FIGURE" && !element.editableSourceRef && ["DIS", "FDIS", "PUBLICATION"].includes(stage)) {
    warnings.push({ code: "EDITABLE_FIGURE_SOURCE_REF_MISSING", message: "Formal-stage figure should reference editable source." });
  }
  if (element.numbering && /[0-9]+\.[0-9]+\./.test(String(element.numbering)) && element.hardcodedNumbering === true) {
    warnings.push({ code: "HARDCODED_NUMBERING_RISK", message: "Numbering should be generated from structure, not pasted as text." });
  }
  return warnings;
}

