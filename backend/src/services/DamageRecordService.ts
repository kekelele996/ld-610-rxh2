import { damageRecordRepository } from "../repositories/DamageRecordRepository";
import { relicItemRepository } from "../repositories/RelicItemRepository";
import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { createDamageRecordDto } from "../constructors/DamageRecordDtoFactory";
import { createPlanFromDamageInput } from "../constructors/RestorationPlanDtoFactory";
import { isSevereDamage } from "../constants/DamageSeverity";
import { isActivePlanStatus } from "../constants/PlanApprovalStatus";
import { DAMAGE_RECORD_STATUS } from "../constants/DamageRecordStatus";
import { RELIC_CONDITION } from "../constants/RelicCondition";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { AppError } from "../utils/AppError";
import { writeBusinessLog } from "../utils/businessLog";
import type { DamageRecord } from "../models/DamageRecord";
import type { RestorationPlan } from "../models/RestorationPlan";
import type { ConvertToPlanPayload } from "../types/DamageRecordPayload";

export interface ConvertToPlanResult {
  plan: RestorationPlan;
  damage: DamageRecord;
}

const assertValidConvertPayload = (payload: ConvertToPlanPayload) => {
  if (!payload || !String(payload.plan_title ?? "").trim() || !String(payload.method ?? "").trim()) {
    throw new AppError(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED);
  }
};

export const damageRecordService = {
  list: (severity?: string): DamageRecord[] => {
    const rows = damageRecordRepository.findAll();
    return severity ? rows.filter((row) => row.severity === severity) : rows;
  },

  create: (row: unknown) => damageRecordRepository.save(createDamageRecordDto(row as Partial<DamageRecord>)),

  // 严重病害 -> 待审批修复方案：建方案、病害置为已转方案、文物置为修复中，三步一次落盘
  convertToPlan: (damageId: number, payload: ConvertToPlanPayload, ownerId = 1): ConvertToPlanResult => {
    assertValidConvertPayload(payload);

    const damage = damageRecordRepository.findById(damageId);
    if (!damage) {
      throw new AppError(404, ERROR_CODES.DAMAGE_NOT_FOUND, ERROR_MESSAGES.DAMAGE_NOT_FOUND);
    }

    // 只有重度 / 严重病害可以直接转方案
    if (!isSevereDamage(damage.severity)) {
      throw new AppError(400, ERROR_CODES.DAMAGE_NOT_SEVERE, ERROR_MESSAGES.DAMAGE_NOT_SEVERE);
    }

    // 同一病害已有草稿或待审批方案：原记录、原方案都不动
    const existing = restorationPlanRepository
      .findByDamageRecordId(damageId)
      .find((plan) => isActivePlanStatus(plan.approval_status));
    if (existing) {
      throw new AppError(409, ERROR_CODES.PLAN_ALREADY_EXISTS, ERROR_MESSAGES.PLAN_ALREADY_EXISTS);
    }

    const plan = restorationPlanRepository.insert(
      createPlanFromDamageInput(
        damage,
        {
          plan_title: String(payload.plan_title).trim(),
          method: String(payload.method).trim(),
          risk_assessment: payload.risk_assessment ? String(payload.risk_assessment).trim() : ""
        },
        ownerId
      )
    );

    const updatedDamage = damageRecordRepository.update(damageId, {
      status: DAMAGE_RECORD_STATUS.CONVERTED
    });
    relicItemRepository.update(damage.relic_id, {
      current_condition: RELIC_CONDITION.IN_RESTORATION
    });

    writeBusinessLog(LOG_TEMPLATES.DamageRecord[4], "DamageRecord", damageId, { plan_id: plan.id });
    writeBusinessLog(LOG_TEMPLATES.RestorationPlan[4], "RestorationPlan", plan.id, { damage_record_id: damageId });

    return { plan, damage: updatedDamage };
  }
};
