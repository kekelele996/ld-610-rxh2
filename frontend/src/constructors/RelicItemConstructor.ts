import type { RelicItem } from "../types/RelicItem";

export const createDefaultRelicItem = (overrides: Partial<RelicItem> = {}): RelicItem => ({
  id: 0,
  relic_code: "",
  name: "",
  era: "",
  material: "",
  collection_level: "",
  storage_location: "",
  current_condition: "STABLE",
  ...overrides
});

export const createRelicItemForm = createDefaultRelicItem;
export const createRelicItemResponse = createDefaultRelicItem;
