import { create } from "zustand";
import { listRelicItem } from "../api/RelicItem";
import type { RelicItem } from "../types/RelicItem";

type State = {
  rows: RelicItem[];
  loading: boolean;
  load: () => Promise<void>;
  patchRelic: (id: number, patch: Partial<RelicItem>) => void;
};

export const useRelicItemStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listRelicItem(), loading: false });
  },

  // 转方案成功后把对应文物置为“修复中”
  patchRelic(id, patch) {
    set((state) => ({
      rows: state.rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    }));
  }
}));
