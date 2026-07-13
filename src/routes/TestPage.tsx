import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Test } from "../types/test";
import { loadTest } from "../lib/content";
import { ExerciseRunner } from "../components/ExerciseRunner";
import { CheckIcon, MicIcon } from "../components/icons";

export function TestPage() {
  const { testId } = useParams();
  const [test, setTest] = useState<Test | null | undefined>(undefined);
  const [canDoTicks, setCanDoTicks] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setTest(undefined);
    if (testId) loadTest(testId).then(setTest);
  }, [testId]);

  if (!testId) return <Navigate to="/" replace />;
  if (test === undefined) return <div className="animate-pulse text-muted">Loading…</div>;
  if (test === null) {
    return (
      <div className="rounded-card border border-dashed border-line bg-surface px-8 py-14 text-center">
        <p className="font-display text-lg text-ink">Test coming</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          This checkpoint hasn't been generated yet (Phase 3).
        </p>
        <Link to="/" className="press mt-6 inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const ticked = Object.values(canDoTicks).filter(Boolean).length;

  return (
    <div className="grid gap-5">
      <Link to={`/week/${test.week}`} className="text-sm font-semibold text-muted hover:text-ink">
        ← Week {test.week}
      </Link>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          {test.isMajorMock ? "Major mock" : "Weekly checkpoint"} · pass {Math.round(test.passThreshold * 100)}%
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold text-ink">{test.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Auto-graded sections below check themselves as you go. Score isn't tallied automatically yet — use the
          can-do checklist as your real signal for this checkpoint.
        </p>
      </div>

      <div className="grid gap-4">
        {test.exercises.map((ex, i) => (
          <div key={i} className="rounded-card border border-line bg-surface p-4">
            <ExerciseRunner exercise={ex} />
          </div>
        ))}
      </div>

      {test.speakingTask && (
        <section className="rounded-card border-2 border-accent bg-accent-tint p-5">
          <div className="mb-2 flex items-center gap-2">
            <MicIcon className="text-accent" />
            <p className="font-display text-lg font-bold text-ink">Speaking task</p>
          </div>
          <p className="text-sm text-ink">{test.speakingTask.prompt}</p>
          <p className="mt-1 text-xs text-muted">Target: ~{test.speakingTask.targetSeconds}s</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Rubric</p>
          <ul className="mt-1 list-disc pl-4 text-sm text-ink">
            {test.speakingTask.rubric.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            In-app recording and scoring arrive in Phase 4 — for now, record yourself separately (voice memo) and
            self-score, or send it to a tutor.
          </p>
        </section>
      )}

      <div className="rounded-card border border-line bg-surface p-5">
        <p className="mb-3 text-sm font-semibold text-ink">
          Week {test.week} can-do checklist · {ticked}/{test.canDo.length}
        </p>
        <div className="grid gap-1">
          {test.canDo.map((c, i) => {
            const on = !!canDoTicks[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCanDoTicks((t) => ({ ...t, [i]: !t[i] }))}
                className="press flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-paper"
              >
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-md border-2 transition-colors ${
                    on ? "border-good bg-good text-white" : "border-line text-transparent"
                  }`}
                >
                  <CheckIcon size={13} />
                </span>
                <span className="text-sm text-ink">{c}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
