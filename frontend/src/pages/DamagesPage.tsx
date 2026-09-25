import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDamageRecordStore } from "../stores/DamageRecordStore";
import { useRestorationPlanStore } from "../stores/RestorationPlanStore";
import { useRelicItemStore } from "../stores/RelicItemStore";
import { SeverityBadge } from "../components/common/SeverityBadge";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { DamageSeverity, DamageSeverityText, type DamageSeverity as SeverityLevel } from "../constants/DamageSeverity";
import { DamageRecordStatusText, type DamageRecordStatus } from "../constants/DamageRecordStatus";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { createConvertToPlanForm } from "../constructors/RestorationPlanConstructor";
import { ApiError } from "../api/ApiError";
import { formatDate } from "../utils/formatters";
import type { DamageRecord } from "../types/DamageRecord";
import type { ConvertToPlanPayload } from "../types/ConvertToPlanPayload";

// 严重病害（高 / 严重）才允许一键转修复方案
const SEVERE_LEVELS: SeverityLevel[] = ["HIGH", "CRITICAL"];
// 已有草稿或待审批方案时，再次提交由后端按 409 PLAN_ALREADY_EXISTS 拒绝
const ACTIVE_PLAN_STATUSES = ["DRAFT", "SUBMITTED"];

type FilterValue = "ALL" | SeverityLevel;

export function DamagesPage() {
  const { rows, loading, load, convertToPlan, submitting } = useDamageRecordStore();
  const plans = useRestorationPlanStore((state) => state.rows);
  const loadPlans = useRestorationPlanStore((state) => state.load);
  const relics = useRelicItemStore((state) => state.rows);
  const loadRelics = useRelicItemStore((state) => state.load);

  const [severityFilter, setSeverityFilter] = useState<FilterValue>("ALL");
  const [target, setTarget] = useState<DamageRecord | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    load();
    loadPlans();
    loadRelics();
  }, [load, loadPlans, loadRelics]);

  const relicById = useMemo(() => new Map(relics.map((relic) => [relic.id, relic])), [relics]);
  const activePlanDamageIds = useMemo(
    () => new Set(plans.filter((plan) => ACTIVE_PLAN_STATUSES.includes(plan.approval_status)).map((plan) => plan.damage_record_id)),
    [plans]
  );

  const filteredRows = useMemo(
    () => (severityFilter === "ALL" ? rows : rows.filter((row) => row.severity === severityFilter)),
    [rows, severityFilter]
  );

  const handleSubmitted = async (record: DamageRecord, payload: ConvertToPlanPayload) => {
    await convertToPlan(record.id, payload);
    setTarget(null);
    setNotice(`病害 #${record.id} 已转修复方案，文物状态同步为“修复中”，方案进入待审批。`);
    await Promise.all([load(), loadPlans(), loadRelics()]);
  };

  return (
    <section className="page-inner">
      <div className="page-head">
        <div>
          <p className="eyebrow">relic-restore</p>
          <h1>病害记录</h1>
        </div>
        <StatusBadge value="DATA_SYNCED" label="数据已同步" />
      </div>

      <div className="toolbar">
        <span className="toolbar-label">等级筛选：</span>
        <div className="chips" role="group" aria-label="按病害等级筛选">
          <button type="button" className={"chip" + (severityFilter === "ALL" ? " active" : "")} onClick={() => setSeverityFilter("ALL")}>
            全部
          </button>
          {DamageSeverity.map((level) => (
            <button
              key={level}
              type="button"
              className={"chip" + (severityFilter === level ? " active" : "")}
              onClick={() => setSeverityFilter(level)}
            >
              {DamageSeverityText[level]}
            </button>
          ))}
        </div>
      </div>

      {notice && <div className="alert success" role="status">{notice}</div>}

      <div className="panel">
        {loading ? (
          <EmptyState title="病害记录加载中…" />
        ) : filteredRows.length === 0 ? (
          <EmptyState title="当前筛选条件下暂无病害记录" />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>编号</th>
                <th>文物编号 / 名称</th>
                <th>病害类型</th>
                <th>位置描述</th>
                <th>等级</th>
                <th>发现人 / 时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((record) => {
                const relic = relicById.get(record.relic_id);
                const isSevere = SEVERE_LEVELS.includes(record.severity as SeverityLevel);
                const converted = record.status === "CONVERTED";
                return (
                  <tr key={record.id}>
                    <td>#{record.id}</td>
                    <td>
                      <strong>{relic?.relic_code ?? `#${record.relic_id}`}</strong>
                      <span className="muted"> {relic?.name ?? ""}</span>
                    </td>
                    <td>{record.damage_type}</td>
                    <td>{record.position_desc}</td>
                    <td><SeverityBadge value={record.severity} /></td>
                    <td>
                      {record.discovered_by}
                      <span className="muted">{record.discovered_at ? formatDate(record.discovered_at) : ""}</span>
                    </td>
                    <td>
                      <StatusBadge
                        value={record.status}
                        label={DamageRecordStatusText[record.status as DamageRecordStatus] ?? record.status}
                      />
                    </td>
                    <td>
                      {converted ? (
                        <span className="muted">—</span>
                      ) : isSevere ? (
                        <button type="button" className="btn primary" onClick={() => setTarget(record)}>
                          {activePlanDamageIds.has(record.id) ? "再次转方案" : "转方案"}
                        </button>
                      ) : (
                        <span className="muted">非严重病害</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {target && (
        <ConvertPlanModal
          record={target}
          relicName={relicById.get(target.relic_id)?.name ?? ""}
          submitting={submitting}
          onClose={() => setTarget(null)}
          onSubmitted={handleSubmitted}
        />
      )}
    </section>
  );
}

function ConvertPlanModal({
  record,
  relicName,
  submitting,
  onClose,
  onSubmitted
}: {
  record: DamageRecord;
  relicName: string;
  submitting: boolean;
  onClose: () => void;
  onSubmitted: (record: DamageRecord, payload: ConvertToPlanPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<ConvertToPlanPayload>(() => createConvertToPlanForm());
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const planTitle = form.plan_title.trim();
    const method = form.method.trim();
    if (!planTitle || !method) {
      setError(ERROR_MESSAGES.VALIDATION_FAILED);
      return;
    }
    setError("");
    try {
      await onSubmitted(record, { plan_title: planTitle, method });
    } catch (err) {
      if (err instanceof ApiError) {
        // 409：该病害已有草稿或待审批方案，原记录和原方案保持不动
        setError(ERROR_MESSAGES[err.code] ?? err.message);
      } else {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      }
    }
  };

  return (
    <div className="modal-mask" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <h2>严重病害转修复方案</h2>
          <button type="button" className="btn ghost" onClick={onClose} aria-label="关闭">×</button>
        </div>
        <div className="modal-body">
          <p className="muted">
            病害 #{record.id}（{record.damage_type}）· 文物 {relicName}，文物编号由系统自动带入，无需重复抄写。
          </p>
          <label className="field">
            <span>方案标题 *</span>
            <input
              type="text"
              value={form.plan_title}
              maxLength={80}
              placeholder="例如：釉面开裂加固修复方案"
              onChange={(event) => setForm((prev) => ({ ...prev, plan_title: event.target.value }))}
            />
          </label>
          <label className="field">
            <span>修复方法 *</span>
            <textarea
              rows={4}
              value={form.method}
              maxLength={500}
              placeholder="描述拟采用的修复工艺、材料与操作要点"
              onChange={(event) => setForm((prev) => ({ ...prev, method: event.target.value }))}
            />
          </label>
          {error && <div className="alert error" role="alert">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn ghost" onClick={onClose}>取消</button>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? "提交中…" : "提交方案"}
          </button>
        </div>
      </form>
    </div>
  );
}
