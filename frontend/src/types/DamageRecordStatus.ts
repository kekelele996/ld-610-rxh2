export const DamageRecordStatus = ["REGISTERED", "CONVERTED", "CLOSED"] as const;
export type DamageRecordStatus = (typeof DamageRecordStatus)[number];
