export const DamageSeverity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type DamageSeverity = (typeof DamageSeverity)[number];

export const DamageSeverityText: Record<DamageSeverity, string> = {
  LOW: "轻度",
  MEDIUM: "中度",
  HIGH: "重度",
  CRITICAL: "严重"
};

// 严重病害：只有这两个等级允许直接转修复方案
export const SEVERE_DAMAGE_SEVERITIES: readonly DamageSeverity[] = ["HIGH", "CRITICAL"];

export const isSevereDamage = (severity: string): boolean =>
  (SEVERE_DAMAGE_SEVERITIES as readonly string[]).includes(severity);
