export const DamageRecordStatus = ["OPEN","CONVERTED","CLOSED"] as const;
export type DamageRecordStatus = (typeof DamageRecordStatus)[number];
export const DamageRecordStatusText: Record<DamageRecordStatus, string> = {
  OPEN: "待处理",
  CONVERTED: "已转方案",
  CLOSED: "已关闭"
};
