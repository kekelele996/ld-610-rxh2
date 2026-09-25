import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { createRestorationPlanDto } from "../constructors/RestorationPlanDtoFactory";
import type { RestorationPlan } from "../models/RestorationPlan";

export const restorationPlanService = {
  list: (): RestorationPlan[] => restorationPlanRepository.findAll(),

  create: (row: unknown) =>
    restorationPlanRepository.save(createRestorationPlanDto(row as Partial<RestorationPlan>)),

  // 工作台待审批数量：已提交待审批的方案
  countPendingApproval: (): number =>
    restorationPlanRepository.findAll().filter((plan) => plan.approval_status === "SUBMITTED").length
};
