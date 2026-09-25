import { EmptyState } from "./EmptyState";

export function ImageCompare({ before, after, note }: { before?: string; after?: string; note?: string }) {
  if (!before && !after) return <EmptyState title="暂无可对比影像" />;
  return (
    <div className="image-compare">
      <figure><div className="image-frame">{before ? <img src={before} alt="修复前" /> : <EmptyState title="无修复前影像" />}</div><figcaption>修复前</figcaption></figure>
      <figure><div className="image-frame">{after ? <img src={after} alt="修复后" /> : <EmptyState title="无修复后影像" />}</div><figcaption>修复后</figcaption></figure>
      {note && <p className="muted">{note}</p>}
    </div>
  );
}
