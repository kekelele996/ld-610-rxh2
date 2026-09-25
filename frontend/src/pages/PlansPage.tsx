import { useEffect } from "react";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";

export function PlansPage() {
  const rows = useRestorationPlanStore((state) => state.rows);
  const loading = useRestorationPlanStore((state) => state.loading);
  const loadPlans = useRestorationPlanStore((state) => state.load);
  const damages = useDamageRecordStore((state) => state.rows);
  const loadDamages = useDamageRecordStore((state) => state.load);

  useEffect(() => {
    void loadPlans();
    void loadDamages();
  }, [loadPlans, loadDamages]);

  const damageMap = new Map(damages.map((damage) => [damage.id, damage]));

  return (
    <section className="entity-page">
      <header className="entity-head">
        <div>
          <p className="eyebrow">restoration plans</p>
          <h1>修复方案</h1>
          <p className="subtitle">由严重病害转出的方案为「待审批」状态，等待专家审批。</p>
        </div>
      </header>

      <div className="panel">
        {loading ? (
          <p className="loading-hint">加载中…</p>
        ) : rows.length === 0 ? (
          <EmptyState title="暂无修复方案" />
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <span>方案标题</span>
              <span>来源病害</span>
              <span>修复方法</span>
              <span>审批状态</span>
            </div>
            {rows.map((plan) => {
              const damage = damageMap.get(plan.damage_record_id);
              return (
                <div className="table-row" key={plan.id}>
                  <span className="cell-primary"><strong>{plan.plan_title}</strong></span>
                  <span className="cell-sub">
                    {damage ? `#${damage.id} ${damage.damage_type}` : `病害 #${plan.damage_record_id}`}
                  </span>
                  <span className="cell-sub method-cell">{plan.method}</span>
                  <span><StatusBadge value={plan.approval_status} /></span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
