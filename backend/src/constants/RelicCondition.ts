export const RelicCondition = ["STABLE", "FRAGILE", "DAMAGED", "IN_RESTORATION", "SEALED"] as const;
export type RelicCondition = (typeof RelicCondition)[number];

export const RELIC_CONDITION = {
  STABLE: "STABLE",
  FRAGILE: "FRAGILE",
  DAMAGED: "DAMAGED",
  IN_RESTORATION: "IN_RESTORATION",
  SEALED: "SEALED"
} as const satisfies Record<RelicCondition, RelicCondition>;
