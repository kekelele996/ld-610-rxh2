export const DamageRecordStatus = ["OPEN", "CONVERTED", "CLOSED"] as const;
export type DamageRecordStatus = (typeof DamageRecordStatus)[number];
