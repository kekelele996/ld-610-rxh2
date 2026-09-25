import { ERROR_CODES } from "./errorCodes";

export const ERROR_MESSAGES = {
  [ERROR_CODES.AUTH_REQUIRED]: "missing bearer token",
  [ERROR_CODES.RBAC_DENIED]: "role denied",
  [ERROR_CODES.VALIDATION_FAILED]: "invalid payload",
  [ERROR_CODES.RATE_LIMITED]: "too many requests",
  [ERROR_CODES.DAMAGE_RECORD_NOT_FOUND]: "damage record not found",
  [ERROR_CODES.RELIC_NOT_FOUND]: "relic item not found",
  [ERROR_CODES.DAMAGE_NOT_SEVERE]: "only HIGH or CRITICAL damage can be converted to a plan",
  [ERROR_CODES.PLAN_ALREADY_EXISTS]: "a draft or submitted restoration plan already exists for this damage record"
} as const;
