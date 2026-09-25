import { useEffect, useMemo } from "react";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { ApprovalTimeline } from "../components/common/ApprovalTimeline";
import { PlanApprovalStatusText, type PlanApprovalStatus } from "../constants/PlanApprovalStatus";

export function PlansPage() {
  const { rows, loading, load } = useRestorationPlanStore();
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);

  useEffect(() => {
    load();
    loadRelics();
  }, [load, loadRelics]);

  const relicById = useMemo(() => new Map(relics.map((relic) => [relic.id, relic])), [relics]);

  return (
    <section className="page-inner">
      <div className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>修复方案</h1>
        </div>
        <StatusBadge value="DATA_SYNCED" label="数据已同步" />
      </div>

      <div className="panel">
        {loading ? (
          <EmptyState title="修复方案加载中…" />
        ) : rows.length === 0 ? (
          <EmptyState title="暂无修复方案" />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>编号</th>
                <th>方案标题</th>
                <th>文物 / 病害</th>
                <th>修复方法</th>
                <th>审批状态</th>
                <th>审批流程</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((plan) => {
                const relic = relicById.get(plan.relic_id);
                return (
                  <tr key={plan.id}>
                    <td>#{plan.id}</td>
                    <td><strong>{plan.plan_title}</strong></td>
                    <td>
                      {relic?.relic_code ?? `#${plan.relic_id}`} {relic?.name ?? ""}
                      <span className="muted">病害 #{plan.damage_record_id}</span>
                    </td>
                    <td>{plan.method}</td>
                    <td>
                      <StatusBadge
                        value={plan.approval_status}
                        label={PlanApprovalStatusText[plan.approval_status as PlanApprovalStatus] ?? plan.approval_status}
                      />
                    </td>
                    <td><ApprovalTimeline value={plan.approval_status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
