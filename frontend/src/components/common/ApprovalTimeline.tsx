import { PlanApprovalStatusText, type PlanApprovalStatus } from "../../constants/PlanApprovalStatus";
import { StatusBadge } from "./StatusBadge";

const FLOW: PlanApprovalStatus[] = ["DRAFT", "SUBMITTED", "APPROVED"];

export function ApprovalTimeline({ value }: { value: string }) {
  const current = FLOW.indexOf(value as PlanApprovalStatus);
  return (
    <ol className="timeline">
      {FLOW.map((stage, index) => (
        <li key={stage} className={index <= Math.max(current, value === "REJECTED" ? 1 : -1) ? "done" : ""}>
          <StatusBadge value={stage} label={PlanApprovalStatusText[stage]} />
          {index < FLOW.length - 1 && <span className="timeline-link" />}
        </li>
      ))}
      {value === "REJECTED" && <li className="rejected">审批驳回</li>}
    </ol>
  );
}
