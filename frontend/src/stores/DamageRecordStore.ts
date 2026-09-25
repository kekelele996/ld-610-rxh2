import { create } from "zustand";
import { listDamageRecord, convertDamageToPlan } from "../api/DamageRecord";
import type { DamageRecord, ConvertToPlanPayload, ConvertToPlanResult } from "../types/DamageRecord";

type State = {
  rows: DamageRecord[];
  loading: boolean;
  filterSeverity: string | undefined;
  setFilterSeverity: (severity: string | undefined) => void;
  load: (severity?: string) => Promise<void>;
  convertToPlan: (damageId: number, payload: ConvertToPlanPayload) => Promise<ConvertToPlanResult>;
  applyConvertedDamage: (damage: DamageRecord) => void;
};

export const useDamageRecordStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  filterSeverity: undefined,

  setFilterSeverity: (severity) =>
    set({ filterSeverity: severity }),

  async load(severity) {
    const next = severity ?? get().filterSeverity;
    set({ loading: true });
    try {
      set({ rows: await listDamageRecord(next), loading: false, filterSeverity: next });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // 调用转方案接口；成功后的联动刷新由页面协调方案/文物/工作台 store 完成
  async convertToPlan(damageId, payload) {
    const result = await convertDamageToPlan(damageId, payload);
    get().applyConvertedDamage(result.damage);
    return result;
  },

  // 用后端返回的病害记录替换本地对应行
  applyConvertedDamage(damage) {
    set((state) => ({
      rows: state.rows.map((row) => (row.id === damage.id ? damage : row))
    }));
  }
}));
