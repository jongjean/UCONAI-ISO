export function validateTermDraft(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.term || String(input.term).trim().length < 2) {
    errors.push({ field: "term", code: "TERM_REQUIRED", message: "Term is required." });
  }

  if (!input.definition || String(input.definition).trim().length < 10) {
    errors.push({ field: "definition", code: "DEFINITION_REQUIRED", message: "Definition needs substantive text." });
  }

  if (!input.source) {
    warnings.push({ field: "source", code: "SOURCE_MISSING", message: "Check existing ISO/IEC terminology before creating a new term." });
  }

  if (input.definition && /\bshall\b/i.test(input.definition)) {
    warnings.push({ code: "DEFINITION_CONTAINS_REQUIREMENT", message: "Definitions should not contain requirements." });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    normalized: {
      term: input.term ? String(input.term).trim() : "",
      definition: input.definition ? String(input.definition).trim() : "",
      source: input.source || null,
      admitted: input.admitted || null,
      deprecated: input.deprecated || null
    }
  };
}

export function buildClause3Preview(terms = []) {
  const validTerms = terms.map(validateTermDraft).filter((item) => item.ok).map((item) => item.normalized);
  return {
    heading: "3 Terms and definitions",
    intro: "For the purposes of this document, the following terms and definitions apply.",
    entries: validTerms.map((item, index) => ({
      number: `3.${index + 1}`,
      term: item.term,
      definition: item.definition,
      source: item.source
    }))
  };
}

export function buildTerminologyConsistencyReport(input = {}) {
  const terms = Array.isArray(input.terms) ? input.terms : [];
  const documentSections = Array.isArray(input.documentSections) ? input.documentSections : [];
  const validated = terms.map((term, index) => ({
    index,
    validation: validateTermDraft(term)
  }));

  const normalizedTerms = validated
    .filter((item) => item.validation.normalized.term)
    .map((item) => item.validation.normalized.term.toLowerCase());

  const duplicateTerms = normalizedTerms.filter((term, index) => normalizedTerms.indexOf(term) !== index);
  const sectionText = documentSections.map((section) => `${section.title || ""}\n${section.content || ""}`).join("\n").toLowerCase();
  const unusedTerms = validated
    .filter((item) => item.validation.normalized.term)
    .filter((item) => !sectionText.includes(item.validation.normalized.term.toLowerCase()))
    .map((item) => ({
      index: item.index,
      term: item.validation.normalized.term,
      code: "TERM_NOT_USED_IN_BODY",
      message: "Term is defined but not currently detected in body sections."
    }));

  return {
    ok: validated.every((item) => item.validation.ok) && duplicateTerms.length === 0,
    counts: {
      total: terms.length,
      invalid: validated.filter((item) => !item.validation.ok).length,
      duplicates: new Set(duplicateTerms).size,
      unused: unusedTerms.length
    },
    duplicateTerms: [...new Set(duplicateTerms)],
    unusedTerms,
    warnings: [
      ...validated.flatMap((item) => item.validation.warnings.map((warning) => ({ ...warning, index: item.index }))),
      ...unusedTerms
    ],
    guidance: {
      sourceCheck: "Check existing ISO/IEC terminology before creating or redefining a term.",
      requirementBoundary: "Definitions should not contain requirements or hidden normative force.",
      changeControl: "Term edits can affect title, scope, clauses, figures and stakeholder consensus."
    },
    persistence: "disabled-until-db-enabled"
  };
}


