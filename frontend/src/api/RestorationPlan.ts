import { mockData } from "../mocks/seedData";
import { requestJson } from "./request";
import type { RestorationPlan } from "../types/RestorationPlan";

const endpoint = "/api/restoration-plan";

export async function listRestorationPlan(): Promise<RestorationPlan[]> {
  try {
    return await requestJson<RestorationPlan[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.restorationPlan];
  }
}

export async function saveRestorationPlan(payload: RestorationPlan) {
  return requestJson<RestorationPlan>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}
