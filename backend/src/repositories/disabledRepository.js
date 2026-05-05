export function createDisabledRepository(contract) {
  return {
    id: contract.id,
    aggregate: contract.aggregate,
    enabled: false,
    readMethods: contract.readMethods,
    writeMethods: contract.writeMethods,
    protectedWrites: contract.protectedWrites,
    reason: "Repository persistence is disabled until DB execution is enabled.",
    describe() {
      return {
        id: contract.id,
        aggregate: contract.aggregate,
        models: contract.models,
        readMethods: contract.readMethods,
        writeMethods: contract.writeMethods,
        enabled: false,
        persistence: "disabled-until-db-enabled"
      };
    }
  };
}
