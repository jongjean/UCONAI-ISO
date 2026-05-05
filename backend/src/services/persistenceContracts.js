import { repositoryContractById, repositoryContracts, listRepositoryModels } from "../repositories/contracts.js";
import { createDisabledRepository } from "../repositories/disabledRepository.js";

export function listPersistenceContracts() {
  return {
    enabled: false,
    database: {
      provider: "postgresql",
      plannedName: "uconai_iso",
      schemaSource: "/uconai/projects/iso/backend/prisma/schema.prisma",
      executionState: "not-executed"
    },
    repositories: repositoryContracts.map((contract) => createDisabledRepository(contract).describe()),
    modelCoverage: listRepositoryModels(),
    protectedOperations: [
      "createProject",
      "createElement",
      "createSnapshot",
      "acquireLock",
      "registerReference",
      "registerFigure",
      "recordAiInteraction",
      "createExportJob",
      "recordUsage",
      "appendAuditLog"
    ],
    persistence: "disabled-until-db-enabled"
  };
}

export function validatePersistenceOperation(input = {}) {
  const contract = repositoryContractById(input.repository);
  const errors = [];
  const warnings = [];

  if (!contract) {
    errors.push({
      field: "repository",
      code: "UNKNOWN_REPOSITORY",
      message: "Repository contract is not registered."
    });
  }

  if (contract && ![...contract.readMethods, ...contract.writeMethods].includes(input.method)) {
    errors.push({
      field: "method",
      code: "UNKNOWN_REPOSITORY_METHOD",
      message: "Method is not part of the repository contract."
    });
  }

  const write = contract?.writeMethods.includes(input.method) === true;
  if (write) {
    warnings.push({
      code: "PERSISTENT_WRITE_DISABLED",
      message: "Persistent writes are disabled until DB execution is enabled."
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    repository: contract?.id || null,
    method: input.method || null,
    write,
    executionAllowed: false,
    persistence: "disabled-until-db-enabled"
  };
}

export function buildRepositoryImplementationPlan() {
  return {
    sequence: [
      {
        step: "db-bootstrap",
        output: "PostgreSQL database and app user created from reviewed plan"
      },
      {
        step: "prisma-client",
        output: "Generated Prisma client bound to DATABASE_URL"
      },
      {
        step: "repository-implementations",
        output: "Prisma-backed implementations replace disabled repositories"
      },
      {
        step: "transaction-boundaries",
        output: "Snapshot, audit and write operations run in explicit transactions"
      },
      {
        step: "integration-tests",
        output: "Repository tests run against non-production database"
      }
    ],
    requiredSafeguards: [
      "No canonical document write without active edit lock.",
      "Every canonical document write creates a version snapshot.",
      "Every high-value write appends audit or security event.",
      "Reference, figure and export storage keys stay project-scoped.",
      "Billing usage writes must preserve credit ledger consistency."
    ],
    persistence: "implementation-plan-only"
  };
}
