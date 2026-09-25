import { create } from "zustand";
import { fetchDashboardStats, type DashboardStats } from "../api/Dashboard";

type State = DashboardStats & {
  loading: boolean;
  load: () => Promise<void>;
};

export const useDashboardStore = create<State>((set) => ({
  pendingApprovalCount: 0,
  severeDamageCount: 0,
  inRestorationCount: 0,
  totalRelicCount: 0,
  loading: false,
  async load() {
    set({ loading: true });
    try {
      set({ ...(await fetchDashboardStats()), loading: false });
    } catch {
      // 工作台指标接口不可用时保留上一次的数值
      set({ loading: false });
    }
  }
}));
