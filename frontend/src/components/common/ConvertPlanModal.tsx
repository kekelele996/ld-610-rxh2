import { useEffect, useState } from "react";
import { createConvertToPlanForm } from "../../constructors/RestorationPlanConstructor";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import type { DamageRecord } from "../../types/DamageRecord";
import type { ConvertToPlanPayload } from "../../types/DamageRecord";

interface Props {
  damage: DamageRecord | null;
  relicName: string;
  submitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (payload: ConvertToPlanPayload) => Promise<void>;
}

export function ConvertPlanModal({ damage, relicName, submitting, errorMessage, onClose, onSubmit }: Props) {
  const [form, setForm] = useState(createConvertToPlanForm(0));

  useEffect(() => {
    if (damage) setForm(createConvertToPlanForm(damage.id));
  }, [damage]);

  if (!damage) return null;

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.plan_title.trim() || !form.method.trim()) return;
    await onSubmit({
      plan_title: form.plan_title,
      method: form.method,
      risk_assessment: form.risk_assessment
    });
  };

  return (
    <div className="modal-mask" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h2>严重病害转修复方案</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="关闭">×</button>
        </header>
        <form className="modal-body" onSubmit={handleSubmit}>
          <p className="modal-context">
            文物：<strong>{relicName}</strong>（编号无需填写，已自动关联病害 #{damage.id}）
          </p>
          <label className="field">
            <span>方案标题 *</span>
            <input
              value={form.plan_title}
              maxLength={80}
              placeholder="例如：贯穿裂纹清洗与粘接修复方案"
              onChange={(e) => update("plan_title", e.target.value)}
            />
          </label>
          <label className="field">
            <span>修复方法 *</span>
            <textarea
              rows={4}
              value={form.method}
              placeholder="描述清洗、加固、粘接、补全等修复方法"
              onChange={(e) => update("method", e.target.value)}
            />
          </label>
          <label className="field">
            <span>风险评估（选填）</span>
            <textarea
              rows={2}
              value={form.risk_assessment}
              placeholder="可能的修复风险与控制措施"
              onChange={(e) => update("risk_assessment", e.target.value)}
            />
          </label>
          {(!form.plan_title.trim() || !form.method.trim()) && (
            <p className="field-hint">{ERROR_MESSAGES.VALIDATION_FAILED}</p>
          )}
          {errorMessage && <p className="field-error" role="alert">{errorMessage}</p>}
          <footer className="modal-foot">
            <button type="button" className="btn ghost" onClick={onClose} disabled={submitting}>取消</button>
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? "提交中…" : "提交为待审批方案"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
