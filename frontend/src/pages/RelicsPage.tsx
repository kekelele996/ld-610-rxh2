import { useEffect } from "react";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";

export function RelicsPage() {
  const rows = useRelicItemStore((state) => state.rows);
  const loading = useRelicItemStore((state) => state.loading);
  const load = useRelicItemStore((state) => state.load);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="entity-page">
      <header className="entity-head">
        <div>
          <p className="eyebrow">relic archive</p>
          <h1>文物档案</h1>
          <p className="subtitle">严重病害转出方案后，对应文物状态自动更新为「修复中」。</p>
        </div>
      </header>

      <div className="panel">
        {loading ? (
          <p className="loading-hint">加载中…</p>
        ) : rows.length === 0 ? (
          <EmptyState title="暂无文物档案" />
        ) : (
          <div className="table">
            <div className="table-row table-head">
              <span>编号</span>
              <span>名称 / 年代</span>
              <span>材质</span>
              <span>藏存位置</span>
              <span>当前状态</span>
            </div>
            {rows.map((relic) => (
              <div className="table-row" key={relic.id}>
                <span className="cell-primary">{relic.relic_code}</span>
                <span className="cell-primary">
                  <strong>{relic.name}</strong>
                  <em className="cell-sub">{relic.era} · {relic.collection_level}</em>
                </span>
                <span className="cell-sub">{relic.material}</span>
                <span className="cell-sub">{relic.storage_location}</span>
                <span><StatusBadge value={relic.current_condition} /></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
