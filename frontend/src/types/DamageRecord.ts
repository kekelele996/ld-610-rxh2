export interface DamageRecord {
  id: number;
  relic_id: number;
  damage_type: string;
  position_desc: string;
  severity: string;
  discovered_by: string;
  discovered_at: string;
  image_url: string;
  status: string;
}

export interface ConvertToPlanPayload {
  plan_title: string;
  method: string;
  risk_assessment?: string;
}

export interface ConvertToPlanResult {
  plan: import("./RestorationPlan").RestorationPlan;
  damage: DamageRecord;
}
