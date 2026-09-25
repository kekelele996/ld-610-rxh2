import { useEffect, useMemo } from "react";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { PlanApprovalStatusText } from "../constants/PlanApprovalStatus";
import { formatNumber } from "../utils/formatters";

const SEVERE_LEVELS = ["HIGH", "CRITICAL"];

export function DashboardPage() {
  const plans = useRestorationPlanStore((state) => state.rows);
  const loadPlans = useRestorationPlanStore((state) => state.load);
  const damages = useDamageRecordStore((state) => state.rows);
  const loadDamages = useDamageRecordStore((state) => state.load);
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);

  useEffect(() => {
    loadPlans();
    loadDamages();
    loadRelics();
  }, [loadPlans, loadDamages, loadRelics]);

  const pendingPlans = useMemo(() => plans.filter((plan) => plan.approval_status === "SUBMITTED"), [plans]);
  const severeOpenCount = useMemo(
    () => damages.filter((row) => SEVERE_LEVELS.includes(row.severity) && row.status === "OPEN").length,
    [damages]
  );
  const inRestorationCount = useMemo(
    () => relics.filter((relic) => relic.current_condition === "IN_RESTORATION").length,
    [relics]
  );

  const relicById = useMemo(() => new Map(relics.map((relic) => [relic.id, relic])), [relics]);

  return (
    <section className="page-inner">
      <div className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>修复工作台</h1>
        </div>
        <StatusBadge value="DATA_SYNCED" label="数据已同步" />
      </div>

      <section className="metrics">
        <StatCard label="待审批方案" value={formatNumber(pendingPlans.length)} />
        <StatCard label="重度待处理病害" value={formatNumber(severeOpenCount)} />
        <StatCard label="修复中文物" value={formatNumber(inRestorationCount)} />
      </section>

      <section className="workbench">
        <div className="panel wide">
          <h2>待审批方案（{pendingPlans.length}）</h2>
          {pendingPlans.length === 0 ? (
            <EmptyState title="暂无待审批方案" />
          ) : (
            <div className="table">
              {pendingPlans.map((plan) => {
                const relic = relicById.get(plan.relic_id);
                return (
                  <article key={plan.id} className="row">
                    <strong>
                      {plan.plan_title}
                      <span className="muted"> 病害 #{plan.damage_record_id} · {relic?.relic_code ?? ""} {relic?.name ?? ""}</span>
                    </strong>
                    <span className="muted">{plan.method}</span>
                    <StatusBadge value={plan.approval_status} label={PlanApprovalStatusText.SUBMITTED} />
                  </article>
                );
              })}
            </div>
          )}
        </div>
        <div className="panel">
          <h2>联动检查</h2>
          <p className="muted">
            在“病害记录”页把严重病害转为方案后：病害标记“已转方案”、文物变为“修复中”、此处待审批数量立即增加；重新打开页面状态保持不变。
          </p>
        </div>
      </section>
    </section>
  );
}
