import { mockData } from "../mocks/seedData";
import { requestJson } from "./request";
import type { DamageRecord, ConvertToPlanPayload, ConvertToPlanResult } from "../types/DamageRecord";

const endpoint = "/api/damage-record";

export async function listDamageRecord(severity?: string): Promise<DamageRecord[]> {
  try {
    const query = severity ? `?severity=${encodeURIComponent(severity)}` : "";
    return await requestJson<DamageRecord[]>(`${endpoint}${query}`);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    const rows = mockData.damageRecord;
    return severity ? rows.filter((row) => row.severity === severity) : [...rows];
  }
}

export async function saveDamageRecord(payload: DamageRecord) {
  return requestJson<DamageRecord>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}

// 严重病害转待审批方案；已有草稿/待审批方案时后端返回 409 PLAN_ALREADY_EXISTS
export async function convertDamageToPlan(damageId: number, payload: ConvertToPlanPayload): Promise<ConvertToPlanResult> {
  return requestJson<ConvertToPlanResult>(`${endpoint}/${damageId}/convert-to-plan`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
