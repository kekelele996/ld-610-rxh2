import type { DamageRecord } from "../models/DamageRecord";

export const createDamageRecordDto = (overrides: Partial<DamageRecord> = {}): DamageRecord => ({
  id: 1,
  relic_id: 1,
  damage_type: "CRACK",
  position_desc: "position desc 1",
  severity: "HIGH",
  discovered_by: "discovered by 1",
  discovered_at: "2026-06-11T09:00:00Z",
  image_url: "/mock/image_url-1.png",
  status: "REGISTERED",
  ...overrides
});
