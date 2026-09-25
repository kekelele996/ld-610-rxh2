import type { RestorationPlan } from "../models/RestorationPlan";

export const createRestorationPlanDto = (overrides: Partial<RestorationPlan> = {}): RestorationPlan => ({
  id: 1,
  relic_id: 1,
  damage_record_id: 1,
  plan_title: "plan title 1",
  method: "method 1",
  risk_assessment: "risk assessment 1",
  approval_status: "SUBMITTED",
  owner_id: 1,
  ...overrides
});

// 由严重病害转出的待审批方案：不预设 id，交给 repository 分配
export const createPlanFromDamageInput = (
  damage: { id: number; relic_id: number },
  input: { plan_title: string; method: string; risk_assessment?: string },
  ownerId = 1
): Omit<RestorationPlan, "id"> => ({
  relic_id: damage.relic_id,
  damage_record_id: damage.id,
  plan_title: input.plan_title,
  method: input.method,
  risk_assessment: input.risk_assessment ?? "",
  approval_status: "SUBMITTED",
  owner_id: ownerId
});
