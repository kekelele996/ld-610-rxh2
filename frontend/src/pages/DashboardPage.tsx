import { useEffect } from "react";
import { useDashboardStore } from "../stores/DashboardStore";
import { StatCard } from "../components/common/StatCard";

export function DashboardPage() {
  const stats = useDashboardStore();
  const load = useDashboardStore((state) => state.load);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="entity-page">
      <header className="entity-head">
        <div>
          <p className="eyebrow">restoration workbench</p>
          <h1>修复工作台</h1>
          <p className="subtitle">病害转方案后，待审批数量与文物修复状态在此实时同步。</p>
        </div>
        <button type="button" className="btn ghost" onClick={() => void load()}>刷新指标</button>
      </header>

      <div className="metrics">
        <StatCard label="待审批方案" value={stats.pendingApprovalCount} />
        <StatCard label="重度 / 严重病害" value={stats.severeDamageCount} />
        <StatCard label="修复中文物" value={stats.inRestorationCount} />
        <StatCard label="在档文物" value={stats.totalRelicCount} />
      </div>

      <div className="panel">
        <h2>工作流说明</h2>
        <ol className="flow-list">
          <li>在「病害记录」中按严重等级筛选，定位重度、严重病害。</li>
          <li>点击「转修复方案」，填写方案标题与修复方法后提交，文物编号自动关联。</li>
          <li>提交后病害显示「已转方案」、文物显示「修复中」、待审批方案数量 +1。</li>
          <li>同一病害已有草稿或待审批方案时会被拦截，原记录与原方案保持不变。</li>
        </ol>
      </div>
    </section>
  );
}
