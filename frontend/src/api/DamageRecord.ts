import { mockData } from "../mocks/seedData";
import { ApiError } from "./ApiError";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { DamageRecord } from "../types/DamageRecord";
import type { RestorationPlan } from "../types/RestorationPlan";
import type { ConvertToPlanPayload } from "../types/ConvertToPlanPayload";

const endpoint = "/api/damage-record";

export async function listDamageRecord(): Promise<DamageRecord[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.damageRecord as unknown as DamageRecord[])];
}

export async function saveDamageRecord(payload: DamageRecord) {
  console.info("save DamageRecord", payload);
  return payload;
}

// 严重病害一键转修复方案：服务端负责查重、写方案、回写病害/文物状态。
export async function convertDamageRecordToPlan(
  damageRecordId: number,
  payload: ConvertToPlanPayload
): Promise<RestorationPlan> {
  const res = await fetch(`${endpoint}/${damageRecordId}/convert-to-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) return (await res.json()) as RestorationPlan;

  let code: string | undefined;
  let serverMessage = "";
  try {
    const body = await res.json();
    code = body?.code;
    serverMessage = body?.message ?? "";
  } catch {
    // non-json error body, fall back to local message table
  }
  throw new ApiError(res.status, code, serverMessage || ERROR_MESSAGES[code ?? "NETWORK_ERROR"] || ERROR_MESSAGES.NETWORK_ERROR);
}
