import { seed } from "../seed";
import type { RestorationStep } from "../models/RestorationStep";

const rows: RestorationStep[] = seed.restorationStep.map((row) => ({ ...row }));

export const restorationStepRepository = {
  findAll: (): RestorationStep[] => rows,
  insert: (row: RestorationStep): RestorationStep => {
    rows.push(row);
    return row;
  },
  save: (row: unknown) => {
    rows.push(row as RestorationStep);
    return row;
  }
};
