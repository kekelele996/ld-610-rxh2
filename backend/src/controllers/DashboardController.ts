import type { Request, Response } from "express";
import { damageRecordService } from "../services/DamageRecordService";
import { restorationPlanService } from "../services/RestorationPlanService";
import { relicItemService } from "../services/RelicItemService";
import { SEVERE_DAMAGE_SEVERITIES } from "../constants/DamageSeverity";

// GET /api/dashboard/stats —— 工作台聚合指标
export const dashboardController = {
  stats: (_req: Request, res: Response) => {
    const damages = damageRecordService.list();
    const plans = restorationPlanService.list();
    const relics = relicItemService.list();

    res.json({
      pendingApprovalCount: plans.filter((plan) => plan.approval_status === "SUBMITTED").length,
      severeDamageCount: damages.filter((row) =>
        (SEVERE_DAMAGE_SEVERITIES as readonly string[]).includes(row.severity)
      ).length,
      inRestorationCount: relics.filter((relic) => relic.current_condition === "IN_RESTORATION").length,
      totalRelicCount: relics.length
    });
  }
};
