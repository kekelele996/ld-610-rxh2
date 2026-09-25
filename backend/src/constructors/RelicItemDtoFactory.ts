import type { RelicItem } from "../models/RelicItem";

export const createRelicItemDto = (overrides: Partial<RelicItem> = {}): RelicItem => ({
  id: 1,
  relic_code: "GY-0000-000",
  name: "未命名藏品",
  era: "年代未知",
  material: "材质未知",
  collection_level: "一般",
  storage_location: "暂存区",
  current_condition: "STABLE",
  ...overrides
});
