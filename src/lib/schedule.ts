const TOTAL_DAYS = 91;

// Normalize to a UTC-midnight timestamp so DST/timezone shifts don't cause
// off-by-one day counts.
function toUtcMidnight(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function expectedDayFor(startDate: string, today: string = todayIso()): number {
  const diffDays = Math.round((toUtcMidnight(today) - toUtcMidnight(startDate)) / 86_400_000);
  return Math.min(TOTAL_DAYS, Math.max(1, diffDays + 1));
}

export type ScheduleStatus = "on-track" | "behind" | "ahead" | "not-started" | "done";

export interface Schedule {
  expectedDay: number;
  actualDay: number; // furthest completed day + 1, i.e. the next day due
  deltaDays: number; // expectedDay - actualDay; positive = behind
  status: ScheduleStatus;
}

export function computeSchedule(startDate: string, actualDay: number, today?: string): Schedule {
  const expectedDay = expectedDayFor(startDate, today);
  const deltaDays = expectedDay - actualDay;
  let status: ScheduleStatus;
  if (actualDay > TOTAL_DAYS) status = "done";
  else if (deltaDays === 0) status = "on-track";
  else if (deltaDays > 0) status = "behind";
  else status = "ahead";
  return { expectedDay, actualDay, deltaDays, status };
}
