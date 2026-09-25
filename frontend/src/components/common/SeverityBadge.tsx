import { DamageSeverityText, type DamageSeverity } from "../../constants/DamageSeverity";
import { StatusBadge } from "./StatusBadge";

export function SeverityBadge({ value }: { value: string }) {
  const label = DamageSeverityText[value as DamageSeverity] ?? value;
  return <StatusBadge value={"SEVERITY_" + value} label={label} />;
}
