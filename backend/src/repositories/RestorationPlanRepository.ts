import { seed } from "../seed";
import type { RestorationPlan } from "../models/RestorationPlan";

const rows: RestorationPlan[] = seed.restorationPlan.map((row) => ({ ...row }));

export const restorationPlanRepository = {
  findAll: (): RestorationPlan[] => rows,
  findByDamageRecordId: (damageRecordId: number): RestorationPlan[] =>
    rows.filter((row) => row.damage_record_id === damageRecordId),
  existsByDamageRecordIdAndStatuses: (damageRecordId: number, statuses: readonly string[]): boolean =>
    rows.some((row) => row.damage_record_id === damageRecordId && statuses.includes(row.approval_status)),
  nextId: (): number => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1,
  insert: (row: RestorationPlan): RestorationPlan => {
    rows.push(row);
    return row;
  },
  countByStatus: (status: string): number => rows.filter((row) => row.approval_status === status).length,
  save: (row: unknown) => {
    rows.push(row as RestorationPlan);
    return row;
  }
};
