export const repositoryContracts = [
  {
    id: "users",
    aggregate: "User",
    models: ["User", "ExternalIdentity", "ProjectMember"],
    readMethods: ["findById", "findByEmail", "listProjectMembers"],
    writeMethods: ["createUser", "updateStatus", "assignRole"],
    protectedWrites: true
  },
  {
    id: "projects",
    aggregate: "StandardProject",
    models: ["StandardProject", "DeliverableProfile", "ProjectMember"],
    readMethods: ["listProjects", "findProjectById", "findProjectBySlug"],
    writeMethods: ["createProject", "updateProject", "archiveProject"],
    protectedWrites: true
  },
  {
    id: "documents",
    aggregate: "DocumentElement",
    models: ["DocumentElement", "DocumentVersionSnapshot", "EditOwnershipLock"],
    readMethods: ["loadDocumentTree", "loadElement", "listSnapshots", "findActiveLock"],
    writeMethods: ["createElement", "updateElement", "moveElement", "createSnapshot", "acquireLock", "transferLock"],
    protectedWrites: true
  },
  {
    id: "roadmap",
    aggregate: "Roadmap",
    models: ["StageTrackPlan", "RoadmapEvent", "MeetingEvent", "VoteEvent"],
    readMethods: ["loadTrackPlan", "listRoadmapEvents", "listMeetingEvents", "listVoteEvents"],
    writeMethods: ["saveTrackPlan", "upsertRoadmapEvent", "recordMeeting", "recordVote"],
    protectedWrites: true
  },
  {
    id: "references",
    aggregate: "ReferenceDocument",
    models: ["ReferenceDocument", "NormativeReference", "BibliographyLinkCandidate"],
    readMethods: ["listReferences", "loadReference", "listBibliographyCandidates"],
    writeMethods: ["registerReference", "linkNormativeReference", "createBibliographyCandidate"],
    protectedWrites: true
  },
  {
    id: "figures",
    aggregate: "FigureAsset",
    models: ["FigureAsset", "AssetSourceValidation"],
    readMethods: ["listFigures", "loadFigure", "listFigureValidations"],
    writeMethods: ["registerFigure", "recordFigureValidation", "attachEditableSource"],
    protectedWrites: true
  },
  {
    id: "consensus",
    aggregate: "CommitteeConsensus",
    models: ["CommitteeActor", "CommentDisposition", "DecisionRecord"],
    readMethods: ["listActors", "listComments", "listDecisionRecords"],
    writeMethods: ["recordActor", "recordCommentDisposition", "recordDecision"],
    protectedWrites: true
  },
  {
    id: "ai",
    aggregate: "AiInteraction",
    models: ["AiInteraction", "AiProviderUsage"],
    readMethods: ["listAiInteractions", "listProviderUsage"],
    writeMethods: ["recordAiInteraction", "recordProviderUsage"],
    protectedWrites: true
  },
  {
    id: "exports",
    aggregate: "ExportJob",
    models: ["ExportJob"],
    readMethods: ["listExportJobs", "loadExportJob"],
    writeMethods: ["createExportJob", "updateExportJobStatus"],
    protectedWrites: true
  },
  {
    id: "billing",
    aggregate: "Billing",
    models: ["CreditAccount", "BillingEvent", "UsageLedger"],
    readMethods: ["loadCreditAccount", "listBillingEvents", "listUsageLedger"],
    writeMethods: ["createCreditAccount", "recordBillingEvent", "recordUsage"],
    protectedWrites: true
  },
  {
    id: "audit",
    aggregate: "Audit",
    models: ["AuditLog", "SecurityEvent"],
    readMethods: ["listAuditLogs", "listSecurityEvents"],
    writeMethods: ["appendAuditLog", "appendSecurityEvent"],
    protectedWrites: true
  }
];

export function repositoryContractById(id) {
  return repositoryContracts.find((contract) => contract.id === id) || null;
}

export function listRepositoryModels() {
  return [...new Set(repositoryContracts.flatMap((contract) => contract.models))].sort();
}
