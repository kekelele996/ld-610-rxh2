import { requestJson } from "./request";
import { mockData } from "../mocks/seedData";
import { SEVERE_DAMAGE_SEVERITIES } from "../constants/DamageSeverity";

export interface DashboardStats {
  pendingApprovalCount: number;
  severeDamageCount: number;
  inRestorationCount: number;
  totalRelicCount: number;
}

const endpoint = "/api/dashboard/stats";

const fallbackStats = (): DashboardStats => ({
  pendingApprovalCount: mockData.restorationPlan.filter((plan) => plan.approval_status === "SUBMITTED").length,
  severeDamageCount: mockData.damageRecord.filter((row) =>
    (SEVERE_DAMAGE_SEVERITIES as readonly string[]).includes(row.severity)
  ).length,
  inRestorationCount: mockData.relicItem.filter((relic) => relic.current_condition === "IN_RESTORATION").length,
  totalRelicCount: mockData.relicItem.length
});

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    return await requestJson<DashboardStats>(endpoint);
  } catch {
    return fallbackStats();
  }
}
