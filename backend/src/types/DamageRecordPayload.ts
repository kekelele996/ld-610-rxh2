export type DamageRecordPayload = Record<string, unknown>;

export interface ConvertToPlanPayload {
  plan_title: string;
  method: string;
  risk_assessment?: string;
}
