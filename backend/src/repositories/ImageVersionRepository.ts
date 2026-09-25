import { seed } from "../seed";
import type { ImageVersion } from "../models/ImageVersion";

const rows: ImageVersion[] = seed.imageVersion.map((row) => ({ ...row }));

export const imageVersionRepository = {
  findAll: (): ImageVersion[] => rows,
  insert: (row: ImageVersion): ImageVersion => {
    rows.push(row);
    return row;
  },
  save: (row: unknown) => {
    rows.push(row as ImageVersion);
    return row;
  }
};
