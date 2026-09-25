import { useCallback, useState } from "react";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { useDashboardStore } from "../stores/DashboardStore";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { DamageRecord } from "../types/DamageRecord";
import type { ConvertToPlanPayload } from "../types/DamageRecord";
import { ApiError } from "../api/request";

const resolveErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    // PLAN_ALREADY_EXISTS / DAMAGE_NOT_SEVERE 等由后端错误码映射为本地文案
    return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] ?? error.message;
  }
  return error instanceof Error ? error.message : "提交失败，请稍后再试";
};

// 病害转方案的跨 store 编排：方案并入方案列表、文物置修复中、工作台计数刷新
export function useDamageConvert() {
  const [target, setTarget] = useState<DamageRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const convertToPlan = useDamageRecordStore((state) => state.convertToPlan);
  const upsertPlan = useRestorationPlanStore((state) => state.upsertPlan);
  const patchRelic = useRelicItemStore((state) => state.patchRelic);
  const loadDashboard = useDashboardStore((state) => state.load);

  const open = useCallback((damage: DamageRecord) => {
    setTarget(damage);
    setErrorMessage(null);
    setNotice(null);
  }, []);

  const close = useCallback(() => {
    if (submitting) return;
    setTarget(null);
    setErrorMessage(null);
  }, [submitting]);

  const submit = useCallback(
    async (payload: ConvertToPlanPayload) => {
      if (!target) return;
      setSubmitting(true);
      setErrorMessage(null);
      try {
        const result = await convertToPlan(target.id, payload);
        // 同一病害已有草稿/待审批方案时后端会直接 409，走到这里说明转换成功
        upsertPlan(result.plan);
        patchRelic(result.plan.relic_id, { current_condition: "IN_RESTORATION" });
        void loadDashboard();
        setNotice(`病害 #${target.id} 已转方案，文物已置为“修复中”`);
        setTarget(null);
      } catch (error) {
        // 原记录与原方案保持不动，仅提示
        setErrorMessage(resolveErrorMessage(error));
      } finally {
        setSubmitting(false);
      }
    },
    [target, convertToPlan, upsertPlan, patchRelic, loadDashboard]
  );

  return { target, submitting, errorMessage, notice, open, close, submit, clearNotice: () => setNotice(null) };
}
