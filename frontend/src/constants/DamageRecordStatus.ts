export const DamageRecordStatus = ["REGISTERED", "CONVERTED", "CLOSED"] as const;
export type DamageRecordStatus = (typeof DamageRecordStatus)[number];

export const DamageRecordStatusText: Record<DamageRecordStatus, string> = {
  REGISTERED: "已登记",
  CONVERTED: "已转方案",
  CLOSED: "已关闭"
};
