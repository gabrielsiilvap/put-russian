import { useLiveQuery } from "dexie-react-hooks";
import { db, getDayProgress, getCourseSettings, type DayProgress, type CourseSettings } from "../lib/db";

export function useDayProgress(day: number): DayProgress | undefined {
  return useLiveQuery(() => getDayProgress(day), [day]);
}

export function useAllProgress(): DayProgress[] | undefined {
  return useLiveQuery(() => db.dayProgress.toArray(), []);
}

// undefined = still loading, null = no start date set yet
export function useCourseSettings(): CourseSettings | null | undefined {
  return useLiveQuery(async () => (await getCourseSettings()) ?? null, []);
}
