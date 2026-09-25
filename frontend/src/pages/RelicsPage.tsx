import { useEffect } from "react";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { RelicInfoCard } from "../components/common/RelicInfoCard";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge } from "../components/common/StatusBadge";

export function RelicsPage() {
  const { rows, loading, load } = useRelicItemStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="page-inner">
      <div className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>文物档案</h1>
        </div>
        <StatusBadge value="DATA_SYNCED" label="数据已同步" />
      </div>

      {loading ? (
        <EmptyState title="文物档案加载中…" />
      ) : rows.length === 0 ? (
        <EmptyState title="暂无文物档案" />
      ) : (
        <div className="card-grid">
          {rows.map((relic) => (
            <RelicInfoCard key={relic.id} relic={relic} />
          ))}
        </div>
      )}
    </section>
  );
}
