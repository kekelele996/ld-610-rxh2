import { DamageRecordStatusText } from "../../constants/DamageRecordStatus";
import { PlanApprovalStatusText } from "../../constants/PlanApprovalStatus";
import { RelicConditionText } from "../../constants/RelicCondition";

const TEXT_MAP: Record<string, string> = {
  ...RelicConditionText,
  ...PlanApprovalStatusText,
  ...DamageRecordStatusText
};

export function StatusBadge({ value }: { value: string }) {
  const key = String(value);
  const label = TEXT_MAP[key] ?? key.replace(/_/g, " ");
  return <span className={"badge " + key.toLowerCase().replace(/_/g, "-")}>{label}</span>;
}
