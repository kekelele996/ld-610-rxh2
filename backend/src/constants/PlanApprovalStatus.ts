export const PlanApprovalStatus = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "ARCHIVED"] as const;
export type PlanApprovalStatus = (typeof PlanApprovalStatus)[number];

// 同一病害已经存在草稿或待审批方案时，不允许再次转方案
export const ACTIVE_PLAN_APPROVAL_STATUSES: readonly PlanApprovalStatus[] = ["DRAFT", "SUBMITTED"];

export const isActivePlanStatus = (status: string): boolean =>
  (ACTIVE_PLAN_APPROVAL_STATUSES as readonly string[]).includes(status);
