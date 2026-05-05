const roles = ["SYSTEM_ADMIN", "PROJECT_LEAD", "EDITOR", "RESEARCHER", "REVIEWER", "VIEWER"];
const userStatuses = ["PENDING", "ACTIVE", "REJECTED", "DISABLED"];
const actions = [
  "project.read",
  "project.manage",
  "member.manage",
  "document.read",
  "document.propose",
  "document.edit",
  "lock.acquire",
  "lock.transfer",
  "reference.manage",
  "figure.manage",
  "roadmap.manage",
  "comment.manage",
  "ai.use.local",
  "ai.use.premium",
  "export.preview",
  "export.run",
  "billing.view",
  "billing.manage",
  "audit.view"
];

const roleActionMap = {
  SYSTEM_ADMIN: actions,
  PROJECT_LEAD: [
    "project.read",
    "project.manage",
    "member.manage",
    "document.read",
    "document.propose",
    "document.edit",
    "lock.acquire",
    "lock.transfer",
    "reference.manage",
    "figure.manage",
    "roadmap.manage",
    "comment.manage",
    "ai.use.local",
    "ai.use.premium",
    "export.preview",
    "export.run",
    "billing.view",
    "audit.view"
  ],
  EDITOR: [
    "project.read",
    "document.read",
    "document.propose",
    "document.edit",
    "lock.acquire",
    "reference.manage",
    "figure.manage",
    "roadmap.manage",
    "comment.manage",
    "ai.use.local",
    "export.preview"
  ],
  RESEARCHER: [
    "project.read",
    "document.read",
    "document.propose",
    "reference.manage",
    "figure.manage",
    "comment.manage",
    "ai.use.local",
    "export.preview"
  ],
  REVIEWER: [
    "project.read",
    "document.read",
    "document.propose",
    "comment.manage",
    "ai.use.local",
    "export.preview"
  ],
  VIEWER: ["project.read", "document.read", "export.preview"]
};

export function authPolicy() {
  return {
    membershipDb: "iso-independent-postgresql",
    externalIdentityBridge: "future-optional",
    frontendStoresProviderSecrets: false,
    registrationDefaultStatus: "PENDING",
    firstAdminRequiresReview: true,
    roles,
    userStatuses,
    actions,
    roleActionMap,
    session: {
      transport: "http-only-cookie-or-bearer-token",
      persistence: "disabled-until-db-enabled",
      browserStoresProviderSecrets: false
    },
    persistence: "disabled-until-db-enabled"
  };
}

export function validateRegistrationDraft(input = {}) {
  const errors = [];
  const warnings = [];

  if (!input.email || !String(input.email).includes("@")) {
    errors.push({ field: "email", code: "EMAIL_REQUIRED", message: "Valid email is required." });
  }

  if (!input.displayName || String(input.displayName).trim().length < 2) {
    errors.push({ field: "displayName", code: "DISPLAY_NAME_REQUIRED", message: "Display name is required." });
  }

  if (input.requestedRole && !roles.includes(input.requestedRole)) {
    errors.push({ field: "requestedRole", code: "INVALID_ROLE", message: "Requested role is invalid." });
  }

  if (input.requestedRole === "SYSTEM_ADMIN") {
    warnings.push({
      field: "requestedRole",
      code: "FIRST_ADMIN_REVIEW_REQUIRED",
      message: "System admin assignment requires explicit administrator review and audit."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    normalized: {
      email: input.email ? String(input.email).trim().toLowerCase() : "",
      displayName: input.displayName ? String(input.displayName).trim() : "",
      requestedRole: input.requestedRole || "VIEWER",
      status: "PENDING"
    },
    persistence: "disabled-until-db-enabled"
  };
}

export function validateRoleAssignment(input = {}) {
  const errors = [];
  const warnings = [];

  if (!roles.includes(input.role)) {
    errors.push({ field: "role", code: "INVALID_ROLE", message: "Role is invalid." });
  }

  if (!input.projectId) {
    errors.push({ field: "projectId", code: "PROJECT_REQUIRED", message: "Project ID is required." });
  }

  if (!input.userId) {
    errors.push({ field: "userId", code: "USER_REQUIRED", message: "User ID is required." });
  }

  if (input.role === "EDITOR") {
    warnings.push({
      code: "EDITOR_LOCK_POLICY_APPLIES",
      message: "Editor role does not grant concurrent edit rights; edit ownership lock still applies."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    requiresAuditLog: true,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildPermissionMatrix() {
  return {
    roles,
    actions,
    matrix: roles.map((role) => ({
      role,
      actions: roleActionMap[role] || []
    })),
    lockSensitiveActions: ["document.edit", "lock.acquire", "lock.transfer"],
    premiumSensitiveActions: ["ai.use.premium", "billing.manage"],
    persistence: "disabled-until-db-enabled"
  };
}

export function validatePermissionCheck(input = {}) {
  const errors = [];
  const warnings = [];
  const role = input.role || "VIEWER";
  const action = input.action;
  const allowedActions = roleActionMap[role] || [];

  if (!roles.includes(role)) {
    errors.push({ field: "role", code: "INVALID_ROLE", message: "Role is invalid." });
  }

  if (!actions.includes(action)) {
    errors.push({ field: "action", code: "INVALID_ACTION", message: "Action is not registered." });
  }

  const roleAllowed = allowedActions.includes(action);

  if (action === "document.edit" && input.hasActiveLock !== true) {
    errors.push({
      field: "hasActiveLock",
      code: "ACTIVE_LOCK_REQUIRED",
      message: "Canonical document editing requires an active edit ownership lock."
    });
  }

  if (action === "lock.transfer" && !["SYSTEM_ADMIN", "PROJECT_LEAD"].includes(role)) {
    errors.push({
      field: "role",
      code: "LOCK_TRANSFER_ROLE_REQUIRED",
      message: "Lock transfer requires project lead or system admin role."
    });
  }

  if (action === "ai.use.premium" && input.billingEnabled !== true) {
    errors.push({
      field: "billingEnabled",
      code: "PREMIUM_BILLING_REQUIRED",
      message: "Premium AI requires enabled billing and credit controls."
    });
  }

  if (input.userStatus && input.userStatus !== "ACTIVE") {
    errors.push({
      field: "userStatus",
      code: "ACTIVE_USER_REQUIRED",
      message: "Only active users can perform project actions."
    });
  }

  if (roleAllowed && action === "document.edit") {
    warnings.push({
      code: "SNAPSHOT_AND_AUDIT_REQUIRED",
      message: "Document edit also requires version snapshot and audit event when persistence is enabled."
    });
  }

  return {
    ok: errors.length === 0 && roleAllowed,
    role,
    action,
    roleAllowed,
    errors,
    warnings,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildSessionEnvelope(input = {}) {
  const role = roles.includes(input.role) ? input.role : "VIEWER";
  const userStatus = userStatuses.includes(input.userStatus) ? input.userStatus : "PENDING";

  return {
    authenticated: input.authenticated === true,
    user: input.authenticated === true
      ? {
          id: input.userId || "preview-user",
          email: input.email || null,
          displayName: input.displayName || null,
          status: userStatus
        }
      : null,
    projectMembership: input.projectId
      ? {
          projectId: input.projectId,
          role,
          actions: roleActionMap[role] || []
        }
      : null,
    secretsExposedToBrowser: false,
    persistence: "disabled-until-db-enabled"
  };
}
