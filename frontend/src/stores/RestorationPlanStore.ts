import { create } from "zustand";
import { listRestorationPlan } from "../api/RestorationPlan";
import type { RestorationPlan } from "../types/RestorationPlan";

type State = {
  rows: RestorationPlan[];
  loading: boolean;
  load: () => Promise<void>;
  upsertPlan: (plan: RestorationPlan) => void;
};

export const useRestorationPlanStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listRestorationPlan(), loading: false });
  },

  // 转方案成功后把新生成的待审批方案并入列表，驱动工作台待审批数量 +1
  upsertPlan(plan) {
    set((state) =>
      state.rows.some((row) => row.id === plan.id)
        ? { rows: state.rows.map((row) => (row.id === plan.id ? plan : row)) }
        : { rows: [...state.rows, plan] }
    );
  }
}));
