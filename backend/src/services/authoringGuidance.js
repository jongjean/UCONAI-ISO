import { validateElementDraft } from "./documentStructure.js";

export const guidanceChannels = [
  "directives-osd",
  "standards-style",
  "scope-similarity",
  "consensus",
  "editable-source"
];

export function buildAuthoringGuidance(input = {}) {
  const element = input.element || {};
  const stage = input.stage || "PWI";
  const dialogueLanguage = input.dialogueLanguage || "ko";
  const findings = [];
  const suggestions = [];
  const validation = validateElementDraft(element);

  for (const warning of validation.warnings) {
    findings.push({
      channel: "directives-osd",
      severity: "warning",
      code: warning.code,
      message: warning.message,
      sourceClass: "project_policy"
    });
  }

  findings.push(...styleFindings(element.content || ""));
  findings.push(...scopeFindings(element));
  findings.push(...figureFindings(element, stage));
  suggestions.push(...consensusSuggestions(input));

  return {
    ok: validation.errors.length === 0,
    dialogueLanguage,
    stage,
    elementType: element.type || null,
    canonicalWriteAllowed: false,
    executionAllowed: false,
    findings: [
      ...validation.errors.map((error) => ({
        channel: "directives-osd",
        severity: "blocked",
        code: error.code,
        message: error.message,
        sourceClass: "project_policy"
      })),
      ...findings
    ],
    suggestions,
    outputContract: {
      leftEditor: "structured element remains human-edited",
      rightAgent: "findings, alternatives and cautions only",
      history: "accepted changes must later bind to snapshot and audit event",
      persistence: "disabled-until-db-enabled"
    }
  };
}

export function buildAgentWorkbenchPreview(input = {}) {
  const mode = input.mode || "single-monitor";
  return {
    mode,
    surfaces: [
      {
        id: "document-editor",
        side: "left",
        purpose: "structured clause editing",
        pageModes: ["one", "two", "four"]
      },
      {
        id: "agent-panel",
        side: "right",
        purpose: "rules, OSD, style, similarity and consensus guidance",
        collapsible: true
      },
      {
        id: "command-preview",
        side: mode === "dual-monitor" ? "right" : "stacked",
        purpose: "command validation and impact preview",
        canonicalWriteAllowed: false
      }
    ],
    responsiveRules: [
      "Dual monitor uses document surface left and guidance surface right.",
      "Single monitor stacks guidance below the document without hiding warnings.",
      "Page zoom and one/two/four page previews must not alter canonical structure."
    ]
  };
}

function styleFindings(content) {
  const findings = [];
  const sentences = content.split(/[.!?]\s+/).filter(Boolean);
  const longSentence = sentences.find((sentence) => sentence.trim().split(/\s+/).length > 35);

  if (/\b(should|may want to|we recommend)\b/i.test(content)) {
    findings.push({
      channel: "standards-style",
      severity: "warning",
      code: "MODAL_VERB_REVIEW",
      message: "Check whether the sentence needs standards-style requirement language or a non-requirement note.",
      sourceClass: "expert_heuristic"
    });
  }

  if (longSentence) {
    findings.push({
      channel: "standards-style",
      severity: "info",
      code: "LONG_SENTENCE_REVIEW",
      message: "Long academic sentences should be split before committee circulation.",
      sourceClass: "expert_heuristic"
    });
  }

  return findings;
}

function scopeFindings(element) {
  if (element.type !== "SCOPE") return [];
  const content = element.content || "";
  const findings = [];

  if (!/\b(specifies|establishes|provides|describes)\b/i.test(content)) {
    findings.push({
      channel: "scope-similarity",
      severity: "warning",
      code: "SCOPE_ACTION_VERB_MISSING",
      message: "Scope should clearly state what the document specifies, establishes, provides or describes.",
      sourceClass: "project_policy"
    });
  }

  if (/\b(all|any|every|universal|complete)\b/i.test(content)) {
    findings.push({
      channel: "scope-similarity",
      severity: "warning",
      code: "SCOPE_OVERBREADTH_REVIEW",
      message: "Broad scope words can trigger overlap, feasibility or committee-boundary concerns.",
      sourceClass: "expert_heuristic"
    });
  }

  return findings;
}

function figureFindings(element, stage) {
  if (element.type !== "FIGURE") return [];
  if (!["DIS", "FDIS", "PUBLICATION"].includes(stage)) return [];
  if (element.editableSourceAvailable === true) return [];

  return [
    {
      channel: "editable-source",
      severity: "blocked",
      code: "EDITABLE_SOURCE_REQUIRED_FOR_FORMAL_STAGE",
      message: "Formal-stage figure packages need editable source tracking, not only a flat preview image.",
      sourceClass: "project_policy"
    }
  ];
}

function consensusSuggestions(input) {
  const concerns = Array.isArray(input.opposingConcerns) ? input.opposingConcerns : [];
  if (concerns.length === 0) return [];

  return concerns.map((concern, index) => ({
    channel: "consensus",
    priority: index + 1,
    theme: concern.theme || "committee concern",
    mission: "Prepare a response that separates technical substance, scope boundary and cooperation path.",
    sourceClass: "expert_heuristic"
  }));
}
