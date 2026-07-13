import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadIndex } from "../lib/content";
import { useAllProgress } from "../hooks/useDayProgress";
import type { ContentIndex } from "../types/day";
import { FlameIcon, ChevronIcon } from "../components/icons";

const TOTAL_DAYS = 91;

export function DashboardPage() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const progress = useAllProgress();

  useEffect(() => {
    loadIndex().then(setIndex);
  }, []);

  if (!index || progress === undefined) {
    return <DashboardSkeleton />;
  }

  const doneDays = new Set(progress.filter((p) => p.doneAt !== null).map((p) => p.day));
  let currentDay = 1;
  while (doneDays.has(currentDay) && currentDay <= TOTAL_DAYS) currentDay++;
  const streak = currentDay - 1;
  const current = index.days.find((d) => d.day === currentDay) ?? index.days[0];
  const nextTest = index.days.find((d) => d.test && d.day >= currentDay);
  const pct = Math.round((doneDays.size / TOTAL_DAYS) * 100);

  return (
    <div className="grid gap-6">
      <section className="rounded-card border border-line bg-surface p-6">
        <p className="eyebrow text-xs font-bold uppercase tracking-widest text-accent">
          Week {current.week} · Day {current.day}
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold leading-tight text-ink">
          {current.function}
        </h1>
        <p className="mt-1 text-sm text-muted">{current.theme}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to={`/day/${current.day}`}
            className="press rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            {doneDays.has(current.day) ? "Review today's lesson" : "Start today's lesson"}
          </Link>
          <Link
            to={`/week/${current.week}`}
            className="press inline-flex items-center gap-1 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-accent"
          >
            Week {current.week} overview
            <ChevronIcon size={14} />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Days in a row" value={String(streak)} icon={<FlameIcon size={16} className="text-accent" />} />
        <Stat label="Days completed" value={`${doneDays.size} / ${TOTAL_DAYS}`} />
        <Stat label="Cards due today" value="—" hint="starts in Phase 2" />
        <Stat label="Retention" value="—" hint="starts in Phase 2" />
      </section>

      <section className="rounded-card border border-line bg-surface p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-sm font-semibold text-ink">Course progress</p>
          <p className="text-xs font-semibold text-muted">{pct}%</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-500 ease-out-strong"
            style={{ width: `${pct}%` }}
          />
        </div>
        {nextTest && (
          <p className="mt-3 text-xs text-muted">
            Next checkpoint: <span className="font-semibold text-ink">Day {nextTest.day}</span> ·{" "}
            {nextTest.function}
          </p>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        {icon}
        {label}
      </div>
      <p className="font-display mt-1 text-xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6" aria-busy="true">
      <div className="h-40 animate-pulse rounded-card border border-line bg-surface" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-card border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}
