import { seed } from "../seed";
import type { DamageRecord } from "../models/DamageRecord";

const rows: DamageRecord[] = seed.damageRecord.map((row) => ({ ...row }));

export const damageRecordRepository = {
  findAll: (): DamageRecord[] => rows,
  findById: (id: number): DamageRecord | undefined => rows.find((row) => row.id === id),
  insert: (row: DamageRecord): DamageRecord => {
    rows.push(row);
    return row;
  },
  updateStatus: (id: number, status: string): DamageRecord | undefined => {
    const row = rows.find((item) => item.id === id);
    if (row) row.status = status;
    return row;
  },
  save: (row: unknown) => {
    rows.push(row as DamageRecord);
    return row;
  }
};
