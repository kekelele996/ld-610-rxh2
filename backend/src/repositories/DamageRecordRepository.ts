import type { DamageRecord } from "../models/DamageRecord";
import { readTable, writeTable, nextId } from "./store";

export const damageRecordRepository = {
  findAll: (): DamageRecord[] => [...readTable("damageRecord")],

  findById: (id: number): DamageRecord | undefined =>
    readTable("damageRecord").find((row) => row.id === id),

  create: (row: Omit<DamageRecord, "id"> & { id?: number }): DamageRecord => {
    const rows = readTable("damageRecord");
    const saved: DamageRecord = { ...row, id: row.id ?? nextId(rows) } as DamageRecord;
    writeTable("damageRecord", [...rows, saved]);
    return saved;
  },

  update: (id: number, patch: Partial<DamageRecord>): DamageRecord => {
    const rows = readTable("damageRecord");
    const target = rows.find((row) => row.id === id);
    if (!target) throw new Error(`damage record ${id} not found`);
    const updated = { ...target, ...patch, id };
    writeTable(
      "damageRecord",
      rows.map((row) => (row.id === id ? updated : row))
    );
    return updated;
  },

  // 兼容既有 POST / 入口：按 id upsert
  save: (row: DamageRecord): DamageRecord => {
    const existing = readTable("damageRecord").find((item) => item.id === row.id);
    return existing
      ? damageRecordRepository.update(row.id, row)
      : damageRecordRepository.create(row);
  }
};
