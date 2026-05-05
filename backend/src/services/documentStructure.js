export const elementTypes = [
  "TITLE",
  "FOREWORD",
  "INTRODUCTION",
  "SCOPE",
  "NORMATIVE_REFERENCES",
  "TERM",
  "ABBREVIATION",
  "CLAUSE",
  "PARAGRAPH",
  "LIST",
  "NOTE",
  "EXAMPLE",
  "TABLE",
  "FIGURE",
  "ANNEX",
  "BIBLIOGRAPHY"
];

const preferredTopLevelOrder = [
  "TITLE",
  "FOREWORD",
  "INTRODUCTION",
  "SCOPE",
  "NORMATIVE_REFERENCES",
  "TERM",
  "ABBREVIATION"
];

export const starterElements = [
  { stableKey: "title", type: "TITLE", title: "Title", sortOrder: 0 },
  { stableKey: "foreword", type: "FOREWORD", title: "Foreword", sortOrder: 1 },
  { stableKey: "intro", type: "INTRODUCTION", title: "Introduction", sortOrder: 2 },
  { stableKey: "scope", type: "SCOPE", title: "Scope", sortOrder: 3, numbering: "1" },
  { stableKey: "normative-references", type: "NORMATIVE_REFERENCES", title: "Normative references", sortOrder: 4, numbering: "2" },
  { stableKey: "terms", type: "TERM", title: "Terms and definitions", sortOrder: 5, numbering: "3" },
  { stableKey: "abbreviations", type: "ABBREVIATION", title: "Symbols and abbreviated terms", sortOrder: 6, numbering: "4" }
];

export function validateElementDraft(element = {}) {
  const errors = [];
  const warnings = [];

  if (!element.stableKey) {
    errors.push({ code: "STABLE_KEY_REQUIRED", message: "Every element needs a stable key." });
  }

  if (!elementTypes.includes(element.type)) {
    errors.push({ code: "INVALID_ELEMENT_TYPE", message: "Element type is not supported." });
  }

  if (element.numbering && typeof element.numbering !== "string") {
    errors.push({ code: "INVALID_NUMBERING", message: "Numbering must be generated as a string label." });
  }

  if (element.type === "SCOPE" && element.content && /shall\b/i.test(element.content)) {
    warnings.push({ code: "SCOPE_CONTAINS_SHALL", message: "Scope should not hide requirements." });
  }

  if (element.content && /^\s*[-*]\s+/m.test(element.content)) {
    warnings.push({
      code: "BULLET_STYLE_REVIEW",
      message: "Check whether the list should use controlled numbering instead of informal bullets."
    });
  }

  if (element.type === "FIGURE" && element.previewOnly === true) {
    warnings.push({
      code: "EDITABLE_FIGURE_SOURCE_MISSING",
      message: "A flat preview image is not enough for final submission; keep an editable source."
    });
  }

  if (element.type === "TERM" && element.content && /\bshall\b/i.test(element.content)) {
    warnings.push({
      code: "TERM_CONTAINS_REQUIREMENT",
      message: "Definitions should not contain requirements."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

export function validateDocumentOutline(elements = []) {
  const errors = [];
  const warnings = [];
  const keys = new Set();

  elements.forEach((element, index) => {
    if (element.stableKey) {
      if (keys.has(element.stableKey)) {
        errors.push({
          code: "DUPLICATE_STABLE_KEY",
          message: `Duplicate stable key: ${element.stableKey}`,
          index
        });
      }
      keys.add(element.stableKey);
    }

    const result = validateElementDraft(element);
    for (const error of result.errors) errors.push({ ...error, index });
    for (const warning of result.warnings) warnings.push({ ...warning, index });
  });

  const firstTypes = elements.slice(0, preferredTopLevelOrder.length).map((item) => item.type);
  preferredTopLevelOrder.forEach((type, index) => {
    if (firstTypes[index] && firstTypes[index] !== type) {
      warnings.push({
        code: "STARTER_ORDER_REVIEW",
        message: `Expected early element ${index + 1} to be ${type}.`,
        index
      });
    }
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      elementCount: elements.length,
      figureCount: elements.filter((item) => item.type === "FIGURE").length,
      tableCount: elements.filter((item) => item.type === "TABLE").length,
      termCount: elements.filter((item) => item.type === "TERM").length
    }
  };
}

export function generateNumberingPreview(elements = []) {
  let clauseCounter = 0;

  return elements.map((element) => {
    const shouldNumber = ["SCOPE", "NORMATIVE_REFERENCES", "TERM", "ABBREVIATION", "CLAUSE", "ANNEX"].includes(element.type);
    if (!shouldNumber) {
      return { stableKey: element.stableKey, type: element.type, numbering: null };
    }

    if (element.type === "ANNEX") {
      return { stableKey: element.stableKey, type: element.type, numbering: `Annex ${element.annexLetter || "A"}` };
    }

    clauseCounter += 1;
    return { stableKey: element.stableKey, type: element.type, numbering: String(clauseCounter) };
  });
}

export function createStarterDocument() {
  return starterElements.map((element) => ({
    ...element,
    content: "",
    metadata: {
      source: "system-starter",
      osdReady: false
    }
  }));
}

export function buildDocumentGovernanceContract(input = {}) {
  const stage = input.stage || "PWI";
  return {
    stage,
    canonicalFlow: [
      { step: "draft", actor: "active-editor", output: "structured element proposal" },
      { step: "validate", actor: "system", output: "rule warnings and blockers" },
      { step: "snapshot", actor: "system", output: "read-only version capture" },
      { step: "commit", actor: "active-editor", output: "canonical element update" },
      { step: "audit", actor: "system", output: "project audit event" }
    ],
    safeguards: [
      { id: "stable-key", required: true, reason: "History and references bind to stable element keys." },
      { id: "single-editor", required: true, reason: "Canonical text updates require one active editor." },
      { id: "read-only-history", required: true, reason: "Past snapshots are browseable and not directly editable." },
      { id: "historical-unlock", required: true, reason: "High-risk historical changes require two-step confirmation and credential check." },
      { id: "numbering-preview", required: true, reason: "AI text must fit structural numbering before acceptance." }
    ],
    stageCautions: stageCautionsFor(stage),
    persistence: "disabled-until-db-enabled"
  };
}

export function buildSectionRiskMatrix(input = {}) {
  const stage = input.stage || "PWI";
  const rows = [
    {
      elementType: "TITLE",
      label: "Title",
      risk: "high",
      osdFocus: "Project identity and search/discovery wording",
      changeControl: ["NP", "CD", "DIS", "FDIS", "PUBLICATION"].includes(stage) ? "formal-review" : "editor-review",
      warning: "Title changes can reset stakeholder expectations and project differentiation work."
    },
    {
      elementType: "SCOPE",
      label: "Scope",
      risk: "high",
      osdFocus: "Clause 1 boundary, exclusions and deliverable fit",
      changeControl: ["NP", "CD", "DIS", "FDIS", "PUBLICATION"].includes(stage) ? "formal-review" : "editor-review",
      warning: "Scope changes can affect procedure, votes, overlap analysis and stakeholder confidence."
    },
    {
      elementType: "NORMATIVE_REFERENCES",
      label: "Normative references",
      risk: "medium",
      osdFocus: "Clause 2 source linkage and necessity",
      changeControl: ["DIS", "FDIS", "PUBLICATION"].includes(stage) ? "formal-review" : "editor-review",
      warning: "Formal stages require clear linkage or resolution."
    },
    {
      elementType: "TERM",
      label: "Terms and definitions",
      risk: "high",
      osdFocus: "Clause 3 concept precision and source consistency",
      changeControl: ["WD", "CD", "DIS", "FDIS", "PUBLICATION"].includes(stage) ? "formal-review" : "editor-review",
      warning: "Term edits can propagate through clauses, figures, abbreviations and committee decisions."
    },
    {
      elementType: "ABBREVIATION",
      label: "Symbols and abbreviated terms",
      risk: "medium",
      osdFocus: "First use, duplicate control and term alignment",
      changeControl: ["DIS", "FDIS", "PUBLICATION"].includes(stage) ? "formal-review" : "editor-review",
      warning: "Abbreviations must stay consistent with terms and body text."
    },
    {
      elementType: "FIGURE",
      label: "Figures",
      risk: "medium",
      osdFocus: "Editable source, callout and source package binding",
      changeControl: ["DIS", "FDIS", "PUBLICATION"].includes(stage) ? "formal-review" : "editor-review",
      warning: "Flat preview images are not enough for final source package readiness."
    }
  ];

  return {
    stage,
    rows,
    highRiskCount: rows.filter((row) => row.risk === "high").length,
    formalReviewCount: rows.filter((row) => row.changeControl === "formal-review").length,
    policy: {
      noBlindPasteToOsd: true,
      stableElementKeyRequired: true,
      aiProposalRequiresHumanReview: true
    },
    persistence: "section-risk-matrix-only-until-db-enabled"
  };
}

function stageCautionsFor(stage) {
  const cautions = {
    PWI: ["Keep title and scope exploratory until committee fit is clear."],
    NP: ["Treat title and scope changes as high-impact project signals."],
    WD: ["Resolve terms and definitions before they propagate through clauses."],
    CD: ["Preserve comments and disposition rationale beside text changes."],
    DIS: ["Avoid uncontrolled changes to scope, references, figures and terms."],
    FDIS: ["Limit edits to final decision readiness and export quality."],
    PUBLICATION: ["Package accepted content without introducing new substance."]
  };
  return cautions[stage] || cautions.PWI;
}

