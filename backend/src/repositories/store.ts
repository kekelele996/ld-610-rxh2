import fs from "fs";
import path from "path";
import { seed } from "../seed";
import type { RelicItem } from "../models/RelicItem";
import type { DamageRecord } from "../models/DamageRecord";
import type { RestorationPlan } from "../models/RestorationPlan";
import type { RestorationStep } from "../models/RestorationStep";
import type { ImageVersion } from "../models/ImageVersion";

// 轻量 JSON 持久层：首次启动时用种子数据落盘，之后所有写操作都写回文件，
// 让“转方案 / 文物状态变更 / 待审批计数”在进程重启（重新打开页面）后仍然保持。
const DATA_DIR = process.env.DATA_DIR?.trim() || path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

export interface DataShape {
  relicItem: RelicItem[];
  damageRecord: DamageRecord[];
  restorationPlan: RestorationPlan[];
  restorationStep: RestorationStep[];
  imageVersion: ImageVersion[];
}

const cloneSeed = (): DataShape => JSON.parse(JSON.stringify(seed));

const ensureLoaded = (): DataShape => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as DataShape;
    }
  } catch {
    // 落盘文件损坏时回退到种子数据，避免接口整体不可用
  }
  const initial = cloneSeed();
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  } catch {
    // 目录不可写时退化为内存态
  }
  return initial;
};

let cache: DataShape = ensureLoaded();

export const persist = () => {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(cache, null, 2));
  } catch {
    // 写入失败时至少保留当前进程内的内存态
  }
};

export const readTable = <K extends keyof DataShape>(table: K): DataShape[K] => cache[table];

export const writeTable = <K extends keyof DataShape>(table: K, rows: DataShape[K]) => {
  cache = { ...cache, [table]: rows };
  persist();
};

export const nextId = (rows: ReadonlyArray<{ id: number }>): number =>
  rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
