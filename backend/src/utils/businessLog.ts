import { toAuditTarget } from "./formatters";

// 业务写操作的审计日志，与 auditLogMiddleware 的访问日志互补
export const writeBusinessLog = (template: string, type: string, id: number | string, extra?: Record<string, unknown>) => {
  console.info("business-log", template, toAuditTarget(type, id), extra ?? "");
};
