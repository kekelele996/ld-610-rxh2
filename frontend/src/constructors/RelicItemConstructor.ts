import type { RelicItem } from "../types/RelicItem";

export const createDefaultRelicItem = (overrides: Partial<RelicItem> = {}): RelicItem => ({
  id: 1,
  relic_code: "WW-0001",
  name: "青花缠枝莲纹梅瓶",
  era: "明永乐",
  material: "瓷",
  collection_level: "一级",
  storage_location: "一号库房 A-03",
  current_condition: "STABLE",
  ...overrides
});

export const createRelicItemForm = createDefaultRelicItem;
export const createRelicItemResponse = createDefaultRelicItem;
