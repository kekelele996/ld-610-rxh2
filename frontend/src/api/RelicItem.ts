import { mockData } from "../mocks/seedData";
import { requestJson } from "./request";
import type { RelicItem } from "../types/RelicItem";

const endpoint = "/api/relic-item";

export async function listRelicItem(): Promise<RelicItem[]> {
  try {
    return await requestJson<RelicItem[]>(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return [...mockData.relicItem];
  }
}

export async function saveRelicItem(payload: RelicItem) {
  return requestJson<RelicItem>(endpoint, { method: "POST", body: JSON.stringify(payload) });
}
