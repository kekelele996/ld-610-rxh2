import type { RestorationPlan } from "../types/RestorationPlan";
import type { ConvertToPlanPayload } from "../types/ConvertToPlanPayload";

export const createDefaultRestorationPlan = (overrides: Partial<RestorationPlan> = {}): RestorationPlan => ({
  id: 1,
  relic_id: 1,
  damage_record_id: 1,
  plan_title: "plan title 1",
  method: "method 1",
  risk_assessment: "",
  approval_status: "SUBMITTED",
  owner_id: 1,
  ...overrides
});

export const createRestorationPlanForm = createDefaultRestorationPlan;
export const createRestorationPlanResponse = createDefaultRestorationPlan;

// Form object for "病害记录 → 修复方案": the relic / damage ids are taken from the source
// record (no retyping the relic code); the team only enters the plan title and repair method.
export const createConvertToPlanForm = (overrides: Partial<ConvertToPlanPayload> = {}): ConvertToPlanPayload => ({
  plan_title: "",
  method: "",
  ...overrides
});
