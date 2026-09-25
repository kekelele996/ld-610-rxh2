export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  DAMAGE_NOT_FOUND: "damage record not found",
  DAMAGE_NOT_SEVERE: "only HIGH or CRITICAL damage can be converted to a restoration plan",
  PLAN_ALREADY_EXISTS: "an active restoration plan already exists for this damage record"
};
