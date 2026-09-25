import { useEffect, useMemo, useState } from "react";
import { useImageVersionStore } from "../stores/ImageVersionStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { ImageCompare } from "../components/common/ImageCompare";
import { useImageVersionCompare } from "../hooks/useImageVersionCompare";
import { formatDate } from "../utils/formatters";

const IMAGE_TYPE_TEXT: Record<string, string> = { BEFORE: "修复前", AFTER: "修复后", PROGRESS: "修复中" };

export function ImagesPage() {
  const { rows, loading, load } = useImageVersionStore();
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);
  const plans = useRestorationPlanStore((state) => state.rows);
  const loadPlans = useRestorationPlanStore((state) => state.load);

  useEffect(() => {
    load();
    loadRelics();
    loadPlans();
  }, [load, loadRelics, loadPlans]);

  const relicById = useMemo(() => new Map(relics.map((relic) => [relic.id, relic])), [relics]);
  const plansById = useMemo(() => new Map(plans.map((plan) => [plan.id, plan])), [plans]);
  const { pageRows, page, setPage, total } = useImageVersionCompare(rows);
  const [comparePlanId, setComparePlanId] = useState<number | null>(null);

  const compareRows = rows.filter((image) => image.plan_id === comparePlanId);
  const before = compareRows.find((image) => image.image_type === "BEFORE")?.file_path;
  const after = compareRows.find((image) => image.image_type === "AFTER")?.file_path;

  return (
    <section className="page-inner">
      <div className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>影像版本</h1>
        </div>
        <StatusBadge value="DATA_SYNCED" label="数据已同步" />
      </div>

      <div className="panel">
        {loading ? (
          <EmptyState title="影像版本加载中…" />
        ) : rows.length === 0 ? (
          <EmptyState title="暂无影像版本" />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>版本</th>
                <th>类型</th>
                <th>文物 / 方案</th>
                <th>拍摄时间</th>
                <th>说明</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((image) => {
                const relic = relicById.get(image.relic_id);
                return (
                  <tr key={image.id}>
                    <td>{image.version_no}</td>
                    <td><StatusBadge value={image.image_type} label={IMAGE_TYPE_TEXT[image.image_type] ?? image.image_type} /></td>
                    <td>{relic?.name ?? `文物 #${image.relic_id}`}<span className="muted">方案 #{image.plan_id}（{plansById.get(image.plan_id)?.plan_title ?? ""}）</span></td>
                    <td>{formatDate(image.capture_at)}</td>
                    <td>{image.note}</td>
                    <td><button type="button" className="btn ghost" onClick={() => setComparePlanId(image.plan_id)}>修复前后对比</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className="pager">
          <button type="button" className="btn ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</button>
          <span className="muted">第 {page} 页 · 共 {total} 条</span>
          <button type="button" className="btn ghost" disabled={pageRows.length < 8} onClick={() => setPage(page + 1)}>下一页</button>
        </div>
      </div>

      {comparePlanId !== null && (
        <div className="panel wide">
          <h2>方案 #{comparePlanId} 修复前后对比</h2>
          <ImageCompare before={before} after={after} />
        </div>
      )}
    </section>
  );
}
