import type { RestorationPlan } from "../models/RestorationPlan";
import { readTable, writeTable, nextId } from "./store";

export const restorationPlanRepository = {
  findAll: (): RestorationPlan[] => [...readTable("restorationPlan")],

  findById: (id: number): RestorationPlan | undefined =>
    readTable("restorationPlan").find((row) => row.id === id),

  // 同一病害下已存在的方案（用于“已有方案”拦截）
  findByDamageRecordId: (damageRecordId: number): RestorationPlan[] =>
    readTable("restorationPlan").filter((row) => row.damage_record_id === damageRecordId),

  create: (row: Omit<RestorationPlan, "id"> & { id?: number }): RestorationPlan => {
    const rows = readTable("restorationPlan");
    const saved: RestorationPlan = { ...row, id: row.id ?? nextId(rows) } as RestorationPlan;
    writeTable("restorationPlan", [...rows, saved]);
    return saved;
  },

  // 由病害转方案时调用：强制分配新 id，忽略入参里的占位 id
  insert: (row: Omit<RestorationPlan, "id">): RestorationPlan => {
    const rows = readTable("restorationPlan");
    const saved: RestorationPlan = { ...row, id: nextId(rows) };
    writeTable("restorationPlan", [...rows, saved]);
    return saved;
  },

  // 兼容既有 POST / 入口：按 id upsert
  save: (row: RestorationPlan): RestorationPlan => {
    const rows = readTable("restorationPlan");
    if (rows.some((item) => item.id === row.id)) {
      const updated = { ...row };
      writeTable(
        "restorationPlan",
        rows.map((item) => (item.id === row.id ? updated : item))
      );
      return updated;
    }
    return restorationPlanRepository.create(row);
  }
};
