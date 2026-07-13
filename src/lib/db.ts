import Dexie, { type EntityTable } from "dexie";

export const BLOCK_IDS = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type BlockId = (typeof BLOCK_IDS)[number];

export interface DayProgress {
  day: number; // primary key
  completedBlocks: BlockId[];
  doneAt: number | null; // timestamp when all 7 blocks were marked done
  missionTicks: Record<number, boolean>; // task index -> yes/no
}

export interface FreeWrite {
  id?: number; // auto-increment
  day: number;
  text: string;
  createdAt: number;
}

export interface CourseSettings {
  id: 1; // singleton row
  startDate: string; // ISO date, "YYYY-MM-DD" — Day 1 lands on this calendar date
}

class PutDB extends Dexie {
  dayProgress!: EntityTable<DayProgress, "day">;
  freeWrites!: EntityTable<FreeWrite, "id">;
  settings!: EntityTable<CourseSettings, "id">;

  constructor() {
    super("put-b1");
    this.version(1).stores({
      dayProgress: "day, doneAt",
      freeWrites: "++id, day, createdAt",
    });
    this.version(2).stores({
      dayProgress: "day, doneAt",
      freeWrites: "++id, day, createdAt",
      settings: "id",
    });
  }
}

export const db = new PutDB();

export async function getDayProgress(day: number): Promise<DayProgress> {
  const existing = await db.dayProgress.get(day);
  return existing ?? { day, completedBlocks: [], doneAt: null, missionTicks: {} };
}

export async function toggleBlock(day: number, block: BlockId) {
  const cur = await getDayProgress(day);
  const has = cur.completedBlocks.includes(block);
  const completedBlocks = has
    ? cur.completedBlocks.filter((b) => b !== block)
    : [...cur.completedBlocks, block];
  const doneAt = completedBlocks.length === BLOCK_IDS.length ? Date.now() : null;
  await db.dayProgress.put({ ...cur, completedBlocks, doneAt });
}

export async function setMissionTick(day: number, taskIndex: number, value: boolean) {
  const cur = await getDayProgress(day);
  await db.dayProgress.put({
    ...cur,
    missionTicks: { ...cur.missionTicks, [taskIndex]: value },
  });
}

export async function saveFreeWrite(day: number, text: string) {
  await db.freeWrites.add({ day, text, createdAt: Date.now() });
}

export async function latestFreeWrite(day: number): Promise<FreeWrite | undefined> {
  return db.freeWrites.where("day").equals(day).last();
}

export async function allCompletedDays(): Promise<DayProgress[]> {
  return db.dayProgress.filter((d) => d.doneAt !== null).toArray();
}

// For days with no 7-block structure (checkpoint/test days) — mark the
// whole day done/undone directly rather than toggling individual blocks.
export async function markDayDone(day: number) {
  const cur = await getDayProgress(day);
  await db.dayProgress.put({ ...cur, doneAt: Date.now() });
}

export async function markDayUndone(day: number) {
  const cur = await getDayProgress(day);
  await db.dayProgress.put({ ...cur, doneAt: null });
}

export async function getCourseSettings(): Promise<CourseSettings | undefined> {
  return db.settings.get(1);
}

export async function setStartDate(startDate: string) {
  await db.settings.put({ id: 1, startDate });
}
