import { config } from "../config.js";

export function validateRuntimeConfig() {
  const checks = [
    {
      key: "ISO_API_PORT",
      ok: config.port === 4510,
      severity: "warning",
      message: "ISO_API_PORT should remain 4510 until port policy changes."
    },
    {
      key: "ISO_API_HOST",
      ok: config.host === "127.0.0.1",
      severity: "blocker",
      message: "ISO API must bind to 127.0.0.1 behind Caddy."
    },
    {
      key: "ISO_PUBLIC_BASE_PATH",
      ok: config.publicBasePath === "/iso/",
      severity: "blocker",
      message: "Frontend and Caddy expect /iso/ as the public base path."
    },
    {
      key: "ISO_DATA_ROOT",
      ok: config.dataRoot === "/uconai/data/iso",
      severity: "warning",
      message: "HP policy expects /uconai/data/iso as the data root."
    },
    {
      key: "ISO_STORAGE_ROOT",
      ok: config.storageRoot === "/uconai/data/iso/storage",
      severity: "warning",
      message: "HP policy expects /uconai/data/iso/storage as the project storage root."
    },
    {
      key: "ISO_LOG_DIR",
      ok: config.logDir === "/uconai/data/iso/logs",
      severity: "warning",
      message: "HP policy expects /uconai/data/iso/logs for ISO logs."
    },
    {
      key: "ISO_AI_DEFAULT_PROVIDER",
      ok: config.ai.defaultProvider === "ollama",
      severity: "warning",
      message: "Default AI provider should be ollama until premium provider billing is enabled."
    }
  ];

  const blockers = checks.filter((check) => !check.ok && check.severity === "blocker");
  return {
    ok: blockers.length === 0,
    checks,
    protectedOperations: [
      "db-create",
      "db-migrate",
      "caddy-change",
      "caddy-reload",
      "service-start",
      "service-restart",
      "deploy",
      "paid-ai-provider",
      "legacy-data-migration"
    ],
    expectedCaddyProxyTarget: "127.0.0.1:4510",
    persistence: "source-config-validation-only"
  };
}

export function buildExecutionModeMatrix() {
  return {
    modes: [
      {
        id: "frontend-preview",
        label: "Frontend preview",
        commandScope: "Vite dev server only",
        publicRouteChanges: false,
        serviceInstall: false,
        dbRequired: false,
        allowedBeforeDeployment: true,
        expectedUrl: "http://127.0.0.1:5174/iso/ through SSH tunnel"
      },
      {
        id: "internal-api-preview",
        label: "Internal API preview",
        commandScope: "temporary node process on 127.0.0.1:4510",
        publicRouteChanges: false,
        serviceInstall: false,
        dbRequired: false,
        allowedBeforeDeployment: true,
        expectedUrl: "http://127.0.0.1:4510 behind local tunnel or HP shell"
      },
      {
        id: "systemd-runtime",
        label: "HP systemd runtime",
        commandScope: "iso-api.service installation/start",
        publicRouteChanges: false,
        serviceInstall: true,
        dbRequired: false,
        allowedBeforeDeployment: false,
        expectedUrl: "Caddy proxy target 127.0.0.1:4510 after separate execution review"
      },
      {
        id: "public-deploy",
        label: "Public /iso/ deploy",
        commandScope: "frontend build copy to /uconai/www/iso and Caddy route activation",
        publicRouteChanges: true,
        serviceInstall: true,
        dbRequired: false,
        allowedBeforeDeployment: false,
        expectedUrl: "https://uconcreative.ddns.net/iso/"
      }
    ],
    protectedOperations: [
      "db-create",
      "db-migrate",
      "caddy-change",
      "caddy-reload",
      "service-start",
      "service-restart",
      "deploy",
      "paid-ai-provider",
      "legacy-data-migration"
    ],
    persistence: "source-config-validation-only"
  };
}

export function buildHpReadinessGate(input = {}) {
  const runtime = validateRuntimeConfig();
  const modeMatrix = buildExecutionModeMatrix();
  const requestedMode = input.mode || "frontend-preview";
  const mode = modeMatrix.modes.find((item) => item.id === requestedMode) || modeMatrix.modes[0];
  const blockers = runtime.checks
    .filter((check) => !check.ok && check.severity === "blocker")
    .map((check) => ({
      area: "runtime-config",
      code: check.key,
      message: check.message
    }));

  if (mode.serviceInstall && input.serviceReady !== true) {
    blockers.push({
      area: "service",
      code: "SERVICE_EXECUTION_REVIEW_REQUIRED",
      message: "Systemd runtime requires separate service execution review and active operator action."
    });
  }

  if (mode.publicRouteChanges && input.caddyValidated !== true) {
    blockers.push({
      area: "caddy",
      code: "CADDY_VALIDATION_REQUIRED",
      message: "Public route changes require Caddy syntax validation before activation."
    });
  }

  if (mode.publicRouteChanges && input.frontendBuildReady !== true) {
    blockers.push({
      area: "deploy",
      code: "FRONTEND_BUILD_REQUIRED",
      message: "Public deploy requires a verified frontend build artifact."
    });
  }

  return {
    mode,
    gateOpen: blockers.length === 0 && mode.allowedBeforeDeployment === true,
    runtime,
    blockers,
    nextChecks: [
      "run npm check",
      "run read-only HP preflight",
      "confirm deploy root boundary",
      "confirm ISO service state",
      "confirm no Codex CLI worker/process loop"
    ],
    persistence: "source-config-validation-only"
  };
}


