import type { RelicItem } from "../../types/RelicItem";
import { RelicConditionText, type RelicCondition } from "../../constants/RelicCondition";
import { StatusBadge } from "./StatusBadge";

export function RelicInfoCard({ relic }: { relic: RelicItem }) {
  return (
    <article className="panel relic-card">
      <div className="relic-card-head">
        <strong>{relic.name}</strong>
        <StatusBadge
          value={relic.current_condition}
          label={RelicConditionText[relic.current_condition as RelicCondition] ?? relic.current_condition}
        />
      </div>
      <p className="muted">{relic.relic_code} · {relic.era} · {relic.material}</p>
      <p className="muted">{relic.collection_level}文物 · 存放：{relic.storage_location}</p>
    </article>
  );
}
