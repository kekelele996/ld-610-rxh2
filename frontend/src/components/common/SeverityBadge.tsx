import { DamageSeverityText, type DamageSeverity } from "../../constants/DamageSeverity";

export function SeverityBadge({ value }: { value: string }) {
  const key = String(value) as DamageSeverity;
  const label = DamageSeverityText[key] ?? value;
  return <span className={"badge severity-" + key.toLowerCase()}>{label}</span>;
}
