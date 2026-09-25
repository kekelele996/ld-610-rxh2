import { useEffect, useMemo } from "react";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { DamageSeverity, DamageSeverityText, isSevereDamage } from "../constants/DamageSeverity";
import { DamageRecordStatusText } from "../constants/DamageRecordStatus";
import { isActivePlanStatus } from "../constants/PlanApprovalStatus";
import { useDamageConvert } from "../hooks/useDamageConvert";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { formatDate } from "../utils/formatters";
import { SeverityBadge } from "../components/common/SeverityBadge";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { ConvertPlanModal } from "../components/common/ConvertPlanModal";
import type { DamageRecord } from "../types/DamageRecord";

const FILTER_OPTIONS: Array<{ value: string | undefined; label: string }> = [
  { value: undefined, label: "全部" },
  ...DamageSeverity.map((value) => ({ value, label: DamageSeverityText[value] }))
];

export function DamagesPage() {
  const rows = useDamageRecordStore((state) => state.rows);
  const loading = useDamageRecordStore((state) => state.loading);
  const filterSeverity = useDamageRecordStore((state) => state.filterSeverity);
  const setFilterSeverity = useDamageRecordStore((state) => state.setFilterSeverity);
  const loadDamages = useDamageRecordStore((state) => state.load);

  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);
  const plans = useRestorationPlanStore((state) => state.rows);
  const loadPlans = useRestorationPlanStore((state) => state.load);

  const { target, submitting, errorMessage, notice, open, close, submit, clearNotice } = useDamageConvert();

  useEffect(() => {
    void loadDamages();
    void loadRelics();
    void loadPlans();
  }, [loadDamages, loadRelics, loadPlans]);

  const relicMap = useMemo(() => new Map(relics.map((relic) => [relic.id, relic])), [relics]);

  // 同一病害是否已有草稿或待审批方案
  const hasActivePlan = (damageId: number) =>
    plans.some((plan) => plan.damage_record_id === damageId && isActivePlanStatus(plan.approval_status));

  const canConvert = (damage: DamageRecord) =>
    isSevereDamage(damage.severity) && damage.status !== "CONVERTED" && !hasActivePlan(damage.id);

  const convertBlockedReason = (damage: DamageRecord): string => {
    if (damage.status === "CONVERTED" || hasActivePlan(damage.id)) return "已有方案";
    if (!isSevereDamage(damage.severity)) return "不可转方案";
    return "";
  };

  const relicName = target ? relicMap.get(target.relic_id)?.name ?? `文物 #${target.relic_id}` : "";

  const handleFilter = (value: string | undefined) => {
    setFilterSeverity(value);
    void loadDamages(value);
  };

  return (
    <section className="entity-page">
      <header className="entity-head">
        <div>
          <p className="eyebrow">damage records</p>
          <h1>病害记录</h1>
          <p className="subtitle">重度 / 严重病害可直接转修复方案，文物编号自动关联，无需转抄。</p>
        </div>
      </header>

      <div className="filter-bar" role="group" aria-label="按严重等级筛选">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            className={"chip " + (filterSeverity === option.value ? "active" : "")}
            onClick={() => handleFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="notice success" role="status">
          <span>{notice}</span>
          <button type="button" className="icon-btn" onClick={clearNotice}>×</button>
        </div>
      )}

      <div className="panel">
        {loading ? (
          <p className="loading-hint">加载中…</p>
        ) : rows.length === 0 ? (
          <EmptyState title="当前等级下暂无病害记录" />
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <span>文物 / 病害</span>
              <span>位置描述</span>
              <span>等级</span>
              <span>发现人 / 时间</span>
              <span>状态</span>
              <span>操作</span>
            </div>
            {rows.map((damage) => {
              const relic = relicMap.get(damage.relic_id);
              const converted = damage.status === "CONVERTED";
              return (
                <div className="table-row" key={damage.id}>
                  <span className="cell-primary">
                    <strong>{relic?.name ?? `文物 #${damage.relic_id}`}</strong>
                    <em className="cell-sub">{relic?.relic_code ?? ""} · {damage.damage_type}</em>
                  </span>
                  <span className="cell-sub">{damage.position_desc}</span>
                  <span><SeverityBadge value={damage.severity} /></span>
                  <span className="cell-sub">
                    {damage.discovered_by}
                    <em className="cell-sub">{formatDate(damage.discovered_at)}</em>
                  </span>
                  <span><StatusBadge value={damage.status} /></span>
                  <span>
                    {canConvert(damage) ? (
                      <button type="button" className="btn primary small" onClick={() => open(damage)}>
                        转修复方案
                      </button>
                    ) : converted ? (
                      <span className="tag done">{DamageRecordStatusText.CONVERTED}</span>
                    ) : (
                      <span className="tag muted">{convertBlockedReason(damage)}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConvertPlanModal
        damage={target}
        relicName={relicName}
        submitting={submitting}
        errorMessage={errorMessage}
        onClose={close}
        onSubmit={submit}
      />
    </section>
  );
}
