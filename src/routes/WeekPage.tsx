import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { loadIndex } from "../lib/content";
import { useAllProgress } from "../hooks/useDayProgress";
import type { ContentIndex } from "../types/day";
import { CAN_DO } from "../content/canDo";
import { CheckIcon, ChevronIcon } from "../components/icons";

export function WeekPage() {
  const { weekNum } = useParams();
  const week = Number(weekNum);
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const progress = useAllProgress();

  useEffect(() => {
    loadIndex().then(setIndex);
  }, []);

  if (!Number.isInteger(week) || week < 1 || week > 13) {
    return <Navigate to="/" replace />;
  }
  if (!index || progress === undefined) return <div className="animate-pulse text-muted">Loading…</div>;

  const days = index.days.filter((d) => d.week === week);
  const doneDays = new Set(progress.filter((p) => p.doneAt !== null).map((p) => p.day));

  return (
    <div className="grid gap-5">
      <Link to="/" className="text-sm font-semibold text-muted hover:text-ink">
        ← Dashboard
      </Link>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Week {week}</p>
        <h1 className="font-display mt-1 text-2xl font-bold text-ink">{days[0]?.theme}</h1>
        <p className="mt-2 max-w-lg text-sm text-muted">{CAN_DO[week]}</p>
      </div>

      <div className="grid gap-2">
        {days.map((d) => {
          const isDone = doneDays.has(d.day);
          const isCheckpoint = Boolean(d.test);
          const href = isCheckpoint ? `/test/${d.test}` : `/day/${d.day}`;
          return (
            <Link
              key={d.day}
              to={d.available ? href : "#"}
              aria-disabled={!d.available}
              onClick={(e) => {
                if (!d.available) e.preventDefault();
              }}
              className={`press flex items-center gap-4 rounded-card border border-line bg-surface p-4 transition-shadow ${
                d.available ? "hover:shadow-md" : "cursor-not-allowed opacity-60"
              }`}
            >
              <span
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border-2 text-sm font-bold ${
                  isDone
                    ? "border-accent bg-accent text-white"
                    : "border-line text-muted"
                }`}
              >
                {isDone ? <CheckIcon size={16} /> : d.day}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{d.function}</span>
                <span className="block text-xs text-muted">
                  Day {d.day}
                  {isCheckpoint ? " · checkpoint" : ""}
                  {!d.available ? " · content coming" : ""}
                </span>
              </span>
              {d.available && <ChevronIcon size={16} className="text-muted" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
