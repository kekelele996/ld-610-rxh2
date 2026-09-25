import type { DamageRecord } from "../types/DamageRecord";

export const createDefaultDamageRecord = (overrides: Partial<DamageRecord> = {}): DamageRecord => ({
  id: 1,
  relic_id: 1,
  damage_type: "釉面开裂",
  position_desc: "瓶身腹部 3cm 斜向裂纹",
  severity: "MEDIUM",
  discovered_by: "王修复",
  discovered_at: "2026-09-10T09:00:00Z",
  image_url: "/mock/damage-1.png",
  status: "OPEN",
  ...overrides
});

export const createDamageRecordForm = createDefaultDamageRecord;
export const createDamageRecordResponse = createDefaultDamageRecord;
