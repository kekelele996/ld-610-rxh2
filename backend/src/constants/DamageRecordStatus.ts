export const DamageRecordStatus = ["REGISTERED", "CONVERTED", "CLOSED"] as const;
export type DamageRecordStatus = (typeof DamageRecordStatus)[number];

export const DAMAGE_RECORD_STATUS = {
  REGISTERED: "REGISTERED",
  CONVERTED: "CONVERTED",
  CLOSED: "CLOSED"
} as const satisfies Record<DamageRecordStatus, DamageRecordStatus>;
