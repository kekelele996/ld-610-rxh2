import { seed } from "../seed";
import type { RelicItem } from "../models/RelicItem";

const rows: RelicItem[] = seed.relicItem.map((row) => ({ ...row }));

export const relicItemRepository = {
  findAll: (): RelicItem[] => rows,
  findById: (id: number): RelicItem | undefined => rows.find((row) => row.id === id),
  updateCondition: (id: number, currentCondition: string): RelicItem | undefined => {
    const row = rows.find((item) => item.id === id);
    if (row) row.current_condition = currentCondition;
    return row;
  },
  save: (row: unknown) => {
    rows.push(row as RelicItem);
    return row;
  }
};
