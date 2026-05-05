export function validateLockRequest(input = {}) {
  const errors = [];

  if (!input.projectId) {
    errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  }

  if (!input.userId) {
    errors.push({ field: "userId", code: "USER_REQUIRED", message: "User ID is required." });
  }

  if (input.force === true && (!input.reason || String(input.reason).trim().length < 12)) {
    errors.push({ field: "reason", code: "FORCE_REASON_REQUIRED", message: "Forced transfer requires a clear reason." });
  }

  return {
    ok: errors.length === 0,
    errors,
    policy: {
      singleEditorOnly: true,
      nonEditorsCanComment: true,
      nonEditorsCanPropose: true,
      forcedTransferRequiresAudit: true
    }
  };
}

export function describeCollaborationPolicy() {
  return {
    canonicalEditing: "single-editor-lock",
    otherParticipants: ["comment", "memo", "proposal"],
    transfer: {
      voluntary: "current editor can transfer",
      forced: "project lead/admin with reason and audit"
    },
    conflictHandling: "stale canonical edits must be rejected"
  };
}

export function validateTransferRequest(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.projectId) errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  if (!input.fromUserId) errors.push({ field: "fromUserId", code: "FROM_USER_REQUIRED", message: "Current editor is required." });
  if (!input.toUserId) errors.push({ field: "toUserId", code: "TO_USER_REQUIRED", message: "Target editor is required." });

  if (input.fromUserId && input.toUserId && input.fromUserId === input.toUserId) {
    errors.push({ field: "toUserId", code: "SAME_USER_TRANSFER", message: "Transfer target must differ from current editor." });
  }

  if (input.force === true && (!input.reason || String(input.reason).trim().length < 12)) {
    errors.push({ field: "reason", code: "FORCE_REASON_REQUIRED", message: "Forced transfer requires a clear reason." });
  }

  if (input.force === true) {
    warnings.push({ code: "FORCED_TRANSFER_AUDIT", message: "Forced transfer requires project lead/admin authority and audit log." });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    requiresAuditLog: true,
    persistence: "disabled-until-db-enabled"
  };
}

export function validateProposalDraft(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.projectId) errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  if (!input.elementStableKey) errors.push({ field: "elementStableKey", code: "ELEMENT_REQUIRED", message: "Target element is required." });
  if (!input.proposedText || String(input.proposedText).trim().length < 3) {
    errors.push({ field: "proposedText", code: "PROPOSAL_TEXT_REQUIRED", message: "Proposal text is required." });
  }

  if (input.writeCanonical === true) {
    errors.push({ field: "writeCanonical", code: "CANONICAL_WRITE_BLOCKED", message: "Proposal mode must not write canonical text directly." });
  }

  if (!input.reason) {
    warnings.push({ field: "reason", code: "REASON_RECOMMENDED", message: "Proposal should include rationale for committee/audit review." });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    mode: "proposal-only",
    persistence: "disabled-until-db-enabled"
  };
}

export function validateStaleEdit(input = {}) {
  const errors = [];
  const warnings = [];
  const clientVersion = Number(input.clientVersion || 0);
  const latestVersion = Number(input.latestVersion || 0);

  if (!input.lockId) errors.push({ field: "lockId", code: "LOCK_REQUIRED", message: "Edit lock ID is required." });
  if (!input.userId) errors.push({ field: "userId", code: "USER_REQUIRED", message: "User ID is required." });

  const stale = latestVersion > clientVersion;
  if (stale) {
    errors.push({
      field: "clientVersion",
      code: "STALE_EDIT_REJECTED",
      message: "Client edit is stale and must be refreshed before canonical submission."
    });
  }

  if (input.lockOwnerId && input.userId && input.lockOwnerId !== input.userId) {
    errors.push({
      field: "userId",
      code: "NOT_LOCK_OWNER",
      message: "Only the active lock owner can submit canonical edits."
    });
  }

  if (!stale) {
    warnings.push({ code: "CANONICAL_WRITE_STILL_AUDITED", message: "Accepted canonical edits still require version snapshot and audit." });
  }

  return {
    ok: errors.length === 0,
    stale,
    errors,
    warnings,
    persistence: "disabled-until-db-enabled"
  };
}

