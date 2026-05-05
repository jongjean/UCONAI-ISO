import { buildFigureReadinessReport } from "./figurePolicy.js";
import { buildReferenceGovernanceMatrix } from "./referencePolicy.js";
import { buildTerminologyConsistencyReport } from "./terminologyPolicy.js";

const formalStages = ["DIS", "FDIS", "PUBLICATION"];

export function buildSupportingMaterialsReadiness(input = {}) {
  const stage = input.stage || "PWI";
  const documentSections = Array.isArray(input.documentSections) ? input.documentSections : [];
  const references = Array.isArray(input.references) ? input.references : [];
  const terms = Array.isArray(input.terms) ? input.terms : [];
  const figures = Array.isArray(input.figures) ? input.figures : [];
  const referenceMatrix = buildReferenceGovernanceMatrix({ stage, references });
  const termReport = buildTerminologyConsistencyReport({ terms, documentSections });
  const figureReport = buildFigureReadinessReport({ stage, figures, disStrictMode: input.disStrictMode });
  const blockers = [
    ...referenceMatrix.unresolved.filter((row) => row.action.status === "blocked").map((row) => ({
      area: "references",
      code: row.action.code,
      message: row.action.message,
      index: row.index
    })),
    ...termReport.unusedTerms.map((term) => ({
      area: "terms",
      code: term.code,
      message: term.message,
      index: term.index
    })),
    ...figureReport.blockers.map((blocker) => ({
      area: "figures",
      code: blocker.code,
      message: blocker.message,
      index: blocker.index
    }))
  ];
  const warnings = [
    ...referenceMatrix.unresolved.filter((row) => row.action.status === "warning").map((row) => ({
      area: "references",
      code: row.action.code,
      message: row.action.message,
      index: row.index
    })),
    ...termReport.warnings.map((warning) => ({ ...warning, area: "terms" })),
    ...figureReport.results.flatMap((result) =>
      result.validation.warnings.map((warning) => ({
        ...warning,
        area: "figures",
        index: result.index
      }))
    )
  ];

  return {
    stage,
    strictMode: formalStages.includes(stage),
    readiness: {
      references: scoreReferences(referenceMatrix),
      terms: scoreTerms(termReport),
      figures: scoreFigures(figureReport)
    },
    blockers,
    warnings,
    clauseBindings: buildClauseBindings({ references, terms, figures, documentSections }),
    nextActions: buildSupportingMaterialActions({ stage, blockers, warnings }),
    sourceBoundary: {
      references: "Normative references, bibliography candidates and AI-use modes stay separate.",
      terms: "Definitions remain controlled Clause 3 entries, not hidden requirements.",
      figures: "Preview images are not authoritative source; editable source packages must be tracked."
    },
    persistence: "disabled-until-db-and-storage-enabled"
  };
}

function scoreReferences(matrix) {
  const total = matrix.rows.length;
  if (total === 0) return 0;
  const ready = matrix.rows.filter((row) => row.action.status === "ready").length;
  return Math.round((ready / total) * 100);
}

function scoreTerms(report) {
  if (report.counts.total === 0) return 0;
  const penalty = report.counts.invalid + report.counts.duplicates + report.counts.unused;
  return Math.max(0, Math.round(((report.counts.total - penalty) / report.counts.total) * 100));
}

function scoreFigures(report) {
  if (report.counts.total === 0) return 0;
  const ready = report.results.filter((item) => item.sourceEditable && item.hasEditableSource).length;
  return Math.round((ready / report.counts.total) * 100);
}

function buildClauseBindings({ references, terms, figures, documentSections }) {
  const sectionKeys = new Set(documentSections.map((section) => section.stableKey).filter(Boolean));
  return {
    clause2: references.map((reference, index) => ({
      index,
      title: reference.title || `Reference ${index + 1}`,
      linkedElementStableKey: reference.linkedElementStableKey || null,
      targetExists: reference.linkedElementStableKey ? sectionKeys.has(reference.linkedElementStableKey) : false,
      normative: reference.normative === true
    })),
    clause3: terms.map((term, index) => ({
      index,
      term: term.term || `Term ${index + 1}`,
      source: term.source || null,
      usedInBody: termUsedInSections(term.term, documentSections)
    })),
    figureSources: figures.map((figure, index) => ({
      index,
      label: figure.label || `Figure ${index + 1}`,
      linkedElementStableKey: figure.linkedElementStableKey || null,
      targetExists: figure.linkedElementStableKey ? sectionKeys.has(figure.linkedElementStableKey) : false,
      sourceType: figure.sourceType || null,
      sourcePath: figure.sourcePath || figure.sourceUrl || null
    }))
  };
}

function termUsedInSections(term, sections) {
  if (!term) return false;
  const needle = String(term).toLowerCase();
  return sections.some((section) => `${section.title || ""}\n${section.content || ""}`.toLowerCase().includes(needle));
}

function buildSupportingMaterialActions({ stage, blockers, warnings }) {
  const actions = [];
  if (blockers.some((item) => item.area === "references")) {
    actions.push("Resolve Clause 2 linkage, AI-use mode and bibliography intent before formal package readiness.");
  }
  if (blockers.some((item) => item.area === "terms") || warnings.some((item) => item.area === "terms")) {
    actions.push("Review Clause 3 term usage, duplicate concepts, sources and requirement-boundary warnings.");
  }
  if (blockers.some((item) => item.area === "figures") || (formalStages.includes(stage) && warnings.some((item) => item.area === "figures"))) {
    actions.push("Attach editable figure source files and reject raster-only source packages.");
  }
  if (actions.length === 0) {
    actions.push("Keep supporting material metadata current and bind it to versioned document elements.");
  }
  return actions;
}
