export class ApiError extends Error {
  constructor(status, code, message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const operationLocked = (message, details = {}) =>
  new ApiError(423, "OPERATION_LOCKED", message, details);

export const notImplemented = (message, details = {}) =>
  new ApiError(501, "NOT_IMPLEMENTED", message, details);

