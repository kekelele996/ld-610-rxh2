import { create } from "zustand";
import { convertDamageRecordToPlan, listDamageRecord } from "../api/DamageRecord";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { DamageRecord } from "../types/DamageRecord";
import type { ConvertToPlanPayload } from "../types/ConvertToPlanPayload";
import type { RestorationPlan } from "../types/RestorationPlan";

type State = {
  rows: DamageRecord[];
  loading: boolean;
  submitting: boolean;
  load: () => Promise<void>;
  convertToPlan: (damageRecordId: number, payload: ConvertToPlanPayload) => Promise<RestorationPlan>;
};

export const useDamageRecordStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  submitting: false,
  async load() {
    set({ loading: true });
    set({ rows: await listDamageRecord(), loading: false });
  },
  async convertToPlan(damageRecordId, payload) {
    set({ submitting: true });
    try {
      const plan = await convertDamageRecordToPlan(damageRecordId, payload);
      console.info(LOG_TEMPLATES.DamageRecord[4], damageRecordId, LOG_TEMPLATES.RestorationPlan[4], plan.id);
      set((state) => ({
        rows: state.rows.map((row) => (row.id === damageRecordId ? { ...row, status: "CONVERTED" } : row))
      }));
      return plan;
    } finally {
      set({ submitting: false });
    }
  }
}));
