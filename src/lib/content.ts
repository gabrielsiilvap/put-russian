import type { ContentIndex, Day } from "../types/day";
import type { Test } from "../types/test";

const base = import.meta.env.BASE_URL;

let indexCache: Promise<ContentIndex> | null = null;

export function loadIndex(): Promise<ContentIndex> {
  if (!indexCache) {
    indexCache = fetch(`${base}content/index.json`).then((r) => {
      if (!r.ok) throw new Error("Could not load content index");
      return r.json();
    });
  }
  return indexCache;
}

const dayCache = new Map<number, Promise<Day | null>>();

export function loadDay(n: number): Promise<Day | null> {
  if (!dayCache.has(n)) {
    const p = fetch(`${base}content/day-${String(n).padStart(2, "0")}.json`).then((r) => {
      if (!r.ok) return null;
      return r.json();
    });
    dayCache.set(n, p);
  }
  return dayCache.get(n)!;
}

const testCache = new Map<string, Promise<Test | null>>();

export function loadTest(id: string): Promise<Test | null> {
  if (!testCache.has(id)) {
    const p = fetch(`${base}content/${id}.json`).then((r) => {
      if (!r.ok) return null;
      return r.json();
    });
    testCache.set(id, p);
  }
  return testCache.get(id)!;
}
