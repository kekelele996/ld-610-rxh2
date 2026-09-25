import type { RelicItem } from "../models/RelicItem";
import { readTable, writeTable, nextId } from "./store";

export const relicItemRepository = {
  findAll: (): RelicItem[] => [...readTable("relicItem")],

  findById: (id: number): RelicItem | undefined =>
    readTable("relicItem").find((row) => row.id === id),

  update: (id: number, patch: Partial<RelicItem>): RelicItem => {
    const rows = readTable("relicItem");
    const target = rows.find((row) => row.id === id);
    if (!target) throw new Error(`relic item ${id} not found`);
    const updated = { ...target, ...patch, id };
    writeTable(
      "relicItem",
      rows.map((row) => (row.id === id ? updated : row))
    );
    return updated;
  },

  // 兼容既有 POST / 入口：按 id upsert
  save: (row: RelicItem): RelicItem => {
    const rows = readTable("relicItem");
    if (rows.some((item) => item.id === row.id)) {
      return relicItemRepository.update(row.id, row);
    }
    const saved: RelicItem = { ...row, id: row.id ?? nextId(rows) } as RelicItem;
    writeTable("relicItem", [...rows, saved]);
    return saved;
  }
};
