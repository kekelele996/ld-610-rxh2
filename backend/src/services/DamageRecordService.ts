import { damageRecordRepository } from "../repositories/DamageRecordRepository";
import { restorationPlanRepository } from "../repositories/RestorationPlanRepository";
import { relicItemRepository } from "../repositories/RelicItemRepository";
import { createRestorationPlanDto } from "../constructors/RestorationPlanDtoFactory";
import { DamageSeverity } from "../constants/DamageSeverity";
import { DamageRecordStatus } from "../constants/DamageRecordStatus";
import { PlanApprovalStatus } from "../constants/PlanApprovalStatus";
import { RelicCondition } from "../constants/RelicCondition";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createHttpError } from "../utils/httpError";
import type { ConvertToPlanPayload } from "../types/ConvertToPlanPayload";

// Only 高 (HIGH) / 严重 (CRITICAL) damage can be converted to a restoration plan.
const CONVERTIBLE_SEVERITIES: DamageSeverity[] = ["HIGH", "CRITICAL"];
// An existing 草稿 (DRAFT) or 待审批 (SUBMITTED) plan blocks a second submission.
const ACTIVE_PLAN_STATUSES: PlanApprovalStatus[] = ["DRAFT", "SUBMITTED"];

const CONVERTED_STATUS = DamageRecordStatus[1];
const PENDING_STATUS = PlanApprovalStatus[1];
const IN_RESTORATION_CONDITION = RelicCondition[3];

export const damageRecordService = {
  list: () => damageRecordRepository.findAll(),
  create: (row: unknown) => damageRecordRepository.save(row),
  convertToPlan(damageRecordId: number, payload: Partial<ConvertToPlanPayload>, actor: { id: number }) {
    const damageRecord = damageRecordRepository.findById(Number(damageRecordId));
    if (!damageRecord) {
      throw createHttpError(404, ERROR_CODES.DAMAGE_RECORD_NOT_FOUND, ERROR_MESSAGES[ERROR_CODES.DAMAGE_RECORD_NOT_FOUND]);
    }

    const planTitle = typeof payload?.plan_title === "string" ? payload.plan_title.trim() : "";
    const method = typeof payload?.method === "string" ? payload.method.trim() : "";
    if (!planTitle || !method) {
      throw createHttpError(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES[ERROR_CODES.VALIDATION_FAILED]);
    }

    if (!CONVERTIBLE_SEVERITIES.includes(damageRecord.severity as DamageSeverity)) {
      throw createHttpError(400, ERROR_CODES.DAMAGE_NOT_SEVERE, ERROR_MESSAGES[ERROR_CODES.DAMAGE_NOT_SEVERE]);
    }

    // Duplicate guard: original damage record and existing plan must stay untouched.
    if (restorationPlanRepository.existsByDamageRecordIdAndStatuses(damageRecord.id, ACTIVE_PLAN_STATUSES)) {
      throw createHttpError(409, ERROR_CODES.PLAN_ALREADY_EXISTS, ERROR_MESSAGES[ERROR_CODES.PLAN_ALREADY_EXISTS]);
    }

    const relicItem = relicItemRepository.findById(damageRecord.relic_id);
    if (!relicItem) {
      throw createHttpError(404, ERROR_CODES.RELIC_NOT_FOUND, ERROR_MESSAGES[ERROR_CODES.RELIC_NOT_FOUND]);
    }

    const plan = createRestorationPlanDto({
      id: restorationPlanRepository.nextId(),
      relic_id: damageRecord.relic_id,
      damage_record_id: damageRecord.id,
      plan_title: planTitle,
      method,
      risk_assessment: "",
      approval_status: PENDING_STATUS,
      owner_id: actor?.id ?? 1
    });
    restorationPlanRepository.insert(plan);

    damageRecordRepository.updateStatus(damageRecord.id, CONVERTED_STATUS);
    relicItemRepository.updateCondition(relicItem.id, IN_RESTORATION_CONDITION);

    console.info(
      LOG_TEMPLATES.RestorationPlan[4],
      `plan#${plan.id}`,
      LOG_TEMPLATES.DamageRecord[4],
      `damage#${damageRecord.id}`,
      LOG_TEMPLATES.RelicItem[2],
      `relic#${relicItem.id}`
    );

    return plan;
  }
};
