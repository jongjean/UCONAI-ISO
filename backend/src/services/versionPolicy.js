export function buildSnapshotPreview(element = {}, user = {}) {
  return {
    elementStableKey: element.stableKey || "unknown",
    elementType: element.type || "UNKNOWN",
    capturedAt: new Date().toISOString(),
    capturedBy: user.id || null,
    readOnly: true,
    snapshot: {
      title: element.title || null,
      content: element.content || "",
      numbering: element.numbering || null,
      metadata: element.metadata || {}
    }
  };
}

export function validateHistoricalUnlockRequest(input = {}) {
  const errors = [];

  if (input.confirmedRisk !== true) {
    errors.push({
      field: "confirmedRisk",
      code: "RISK_CONFIRMATION_REQUIRED",
      message: "Historical edit requires explicit risk confirmation."
    });
  }

  if (!input.reason || String(input.reason).trim().length < 12) {
    errors.push({
      field: "reason",
      code: "REASON_REQUIRED",
      message: "Historical edit requires a specific reason."
    });
  }

  if (!input.passwordProvided) {
    errors.push({
      field: "passwordProvided",
      code: "PASSWORD_REQUIRED",
      message: "Historical edit requires password/admin credential confirmation."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    lockedUntilDbEnabled: true,
    requiresAuditLog: true
  };
}

export function buildVersionDateBrowser(input = {}) {
  const snapshots = Array.isArray(input.snapshots) ? input.snapshots : [];
  const sorted = [...snapshots].sort((a, b) => String(b.capturedAt || "").localeCompare(String(a.capturedAt || "")));

  return {
    count: sorted.length,
    readOnly: true,
    dates: sorted.map((snapshot, index) => ({
      index,
      capturedAt: snapshot.capturedAt || null,
      capturedBy: snapshot.capturedBy || null,
      elementStableKey: snapshot.elementStableKey || snapshot.snapshot?.stableKey || "unknown",
      elementType: snapshot.elementType || snapshot.snapshot?.type || "UNKNOWN",
      title: snapshot.snapshot?.title || snapshot.title || null,
      contentPreview: previewText(snapshot.snapshot?.content || snapshot.content || ""),
      selectable: true,
      editable: false
    })),
    persistence: "disabled-until-db-enabled"
  };
}

export function buildVersionDiffPreview(input = {}) {
  const before = input.before || {};
  const after = input.after || {};
  const beforeSnapshot = before.snapshot || before;
  const afterSnapshot = after.snapshot || after;

  const fields = ["title", "content", "numbering"];
  const changes = fields
    .map((field) => ({
      field,
      before: beforeSnapshot[field] ?? null,
      after: afterSnapshot[field] ?? null,
      changed: (beforeSnapshot[field] ?? null) !== (afterSnapshot[field] ?? null)
    }))
    .filter((item) => item.changed);

  return {
    changed: changes.length > 0,
    changeCount: changes.length,
    changes,
    textDiff: buildLineDiff(String(beforeSnapshot.content || ""), String(afterSnapshot.content || "")),
    beforeReadOnly: true,
    afterReadOnly: true,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildExportVersionBindingPreview(input = {}) {
  const versionIds = Array.isArray(input.versionIds) ? input.versionIds : [];
  const missing = versionIds.length === 0;
  return {
    ok: !missing,
    versionIds,
    checksumSeed: versionIds.join("|"),
    warnings: missing
      ? [{ code: "VERSION_BINDING_MISSING", message: "Export should bind to at least one source version ID." }]
      : [],
    persistence: "disabled-until-db-enabled"
  };
}

export function buildChangeImpactReport(input = {}) {
  const stage = String(input.stage || "WD").toUpperCase();
  const changes = Array.isArray(input.changes) ? input.changes : [];
  const rows = changes.map((change, index) => {
    const elementType = String(change.elementType || change.type || "UNKNOWN").toUpperCase();
    const field = String(change.field || "content").toLowerCase();
    const impact = classifyChangeImpact({ stage, elementType, field, text: change.after || change.text || "" });

    return {
      index,
      elementStableKey: change.elementStableKey || change.stableKey || `change-${index + 1}`,
      elementType,
      field,
      stage,
      risk: impact.risk,
      reason: impact.reason,
      requiredChecks: impact.requiredChecks,
      downstream: impact.downstream,
      action: impact.action
    };
  });

  const blockers = rows
    .filter((row) => row.risk === "high")
    .map((row) => ({
      code: "HIGH_IMPACT_CHANGE_REVIEW",
      elementStableKey: row.elementStableKey,
      message: `${row.elementType} ${row.field} change requires focused technical and procedure review.`
    }));

  return {
    ok: blockers.length === 0,
    stage,
    rows,
    highRiskCount: rows.filter((row) => row.risk === "high").length,
    mediumRiskCount: rows.filter((row) => row.risk === "medium").length,
    blockers,
    policy: {
      historicalSnapshotsReadOnly: true,
      singleEditorSubmission: true,
      versionSnapshotBeforeCanonicalWrite: true,
      impactReportBeforeFormalStage: ["CD", "DIS", "FDIS", "PUB"].includes(stage)
    },
    persistence: "impact-report-only-until-db-enabled"
  };
}

function previewText(text) {
  const value = String(text).replace(/\s+/g, " ").trim();
  return value.length > 120 ? `${value.slice(0, 117)}...` : value;
}

function buildLineDiff(beforeText, afterText) {
  const beforeLines = beforeText.split(/\r?\n/);
  const afterLines = afterText.split(/\r?\n/);
  const max = Math.max(beforeLines.length, afterLines.length);
  const result = [];

  for (let index = 0; index < max; index += 1) {
    const before = beforeLines[index] ?? "";
    const after = afterLines[index] ?? "";
    if (before !== after) {
      result.push({
        line: index + 1,
        before,
        after
      });
    }
  }

  return result;
}

function classifyChangeImpact(change = {}) {
  const formal = ["CD", "DIS", "FDIS", "PUB"].includes(change.stage);
  const criticalElement = ["TITLE", "SCOPE", "TERM", "DEFINITION", "ABBREVIATION"].includes(change.elementType);
  const referenceElement = ["NORMATIVE_REFERENCE", "BIBLIOGRAPHY", "ENDNOTE"].includes(change.elementType);
  const figureElement = ["FIGURE", "TABLE"].includes(change.elementType);
  const field = change.field || "content";

  if (formal && criticalElement) {
    return {
      risk: "high",
      reason: "Formal-stage changes to title, scope, term or definition text can affect consensus, voting basis and OSD entry consistency.",
      requiredChecks: ["scope-boundary-check", "terminology-consistency-check", "committee-comment-recheck", "osd-entry-check"],
      downstream: ["roadmap", "comment-resolution", "export-package"],
      action: "create-revision-brief-before-canonical-submit"
    };
  }

  if (formal && referenceElement) {
    return {
      risk: "high",
      reason: "Reference and endnote changes at formal stages can alter citation evidence and final bibliography binding.",
      requiredChecks: ["citation-location-check", "endnote-binding-check", "bibliography-format-check"],
      downstream: ["reference-ledger", "docx-assembly", "osd-companion"],
      action: "bind-reference-change-to-element-key"
    };
  }

  if (formal && figureElement) {
    return {
      risk: "medium",
      reason: "Figures and tables need editable source package continuity and text consistency with surrounding clauses.",
      requiredChecks: ["editable-source-check", "caption-numbering-check", "source-manifest-check"],
      downstream: ["figure-package", "export-manifest"],
      action: "refresh-editable-source-package"
    };
  }

  if (field === "numbering") {
    return {
      risk: "medium",
      reason: "Numbering changes can invalidate clause references, notes, figures and table anchors.",
      requiredChecks: ["outline-numbering-check", "cross-reference-check"],
      downstream: ["outline", "references", "export-package"],
      action: "run-numbering-preview-before-submit"
    };
  }

  return {
    risk: "low",
    reason: "Draft-stage or non-critical text change can proceed with snapshot and normal consistency checks.",
    requiredChecks: ["snapshot-preview", "style-guidance-check"],
    downstream: ["version-history"],
    action: "capture-snapshot-and-submit-through-active-editor"
  };
}

