import { useMemo, useState } from "react";
import type { ExerciseMatchItem } from "../../types/day";

export function MatchExercise({ items }: { items: ExerciseMatchItem[] }) {
  const rights = useMemo(() => shuffle(items.map((i) => i.right)), [items]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  const answerFor = (left: string) => items.find((i) => i.left === left)?.right;

  const pickRight = (right: string) => {
    if (!selectedLeft || matched.has(selectedLeft)) return;
    if (answerFor(selectedLeft) === right) {
      setMatched((m) => new Set(m).add(selectedLeft));
      setSelectedLeft(null);
    } else {
      setWrongPair(right);
      setTimeout(() => setWrongPair(null), 350);
    }
  };

  const allDone = matched.size === items.length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-2">
          {items.map((i) => {
            const isMatched = matched.has(i.left);
            const isSelected = selectedLeft === i.left;
            return (
              <button
                key={i.left}
                type="button"
                disabled={isMatched}
                onClick={() => setSelectedLeft(i.left)}
                className={`press font-ru rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isMatched
                    ? "border-good bg-good-tint text-good"
                    : isSelected
                    ? "border-accent bg-accent-tint text-ink"
                    : "border-line bg-paper text-ink hover:border-accent"
                }`}
              >
                {i.left}
              </button>
            );
          })}
        </div>
        <div className="grid gap-2">
          {rights.map((r) => {
            const isMatched = [...matched].some((l) => answerFor(l) === r);
            const isWrong = wrongPair === r;
            return (
              <button
                key={r}
                type="button"
                disabled={isMatched}
                onClick={() => pickRight(r)}
                className={`press rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isMatched
                    ? "border-good bg-good-tint text-good"
                    : isWrong
                    ? "border-bad bg-bad-tint text-bad"
                    : "border-line bg-paper text-ink hover:border-accent"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
      {allDone && <p className="mt-3 text-sm font-semibold text-good">All matched.</p>}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
