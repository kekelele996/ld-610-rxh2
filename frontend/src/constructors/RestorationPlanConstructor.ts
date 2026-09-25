import type { RestorationPlan } from "../types/RestorationPlan";

export const createDefaultRestorationPlan = (overrides: Partial<RestorationPlan> = {}): RestorationPlan => ({
  id: 0,
  relic_id: 0,
  damage_record_id: 0,
  plan_title: "",
  method: "",
  risk_assessment: "",
  approval_status: "DRAFT",
  owner_id: 0,
  ...overrides
});

export const createRestorationPlanForm = createDefaultRestorationPlan;
export const createRestorationPlanResponse = createDefaultRestorationPlan;

// “病害转方案”弹窗的空表单
export const createConvertToPlanForm = (damageId: number) => ({
  damage_record_id: damageId,
  plan_title: "",
  method: "",
  risk_assessment: ""
});
