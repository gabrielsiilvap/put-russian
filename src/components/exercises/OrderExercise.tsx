import { useMemo, useState } from "react";
import { normalize } from "../../lib/grade";

export function OrderExercise({ tokens, answer }: { tokens: string[]; answer: string }) {
  const scrambled = useMemo(() => shuffle(tokens), [tokens]);
  const [picked, setPicked] = useState<number[]>([]); // indices into scrambled
  const [checked, setChecked] = useState(false);

  const built = picked.map((i) => scrambled[i]).join(" ");
  // Tokens can never reproduce internal punctuation (commas, etc.), so strip
  // all of it from the target answer too, not just the trailing period.
  const ok = checked && normalize(built) === normalize(answer).replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

  const pick = (i: number) => {
    if (picked.includes(i)) return;
    setChecked(false);
    setPicked((p) => [...p, i]);
  };
  const reset = () => {
    setPicked([]);
    setChecked(false);
  };

  return (
    <div>
      <div className="font-ru min-h-11 rounded-lg border border-line bg-paper p-3 text-[17px] text-ink">
        {built || <span className="text-muted">tap the words below in order…</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {scrambled.map((tok, i) => (
          <button
            key={i}
            type="button"
            disabled={picked.includes(i)}
            onClick={() => pick(i)}
            className="font-ru press rounded-full border border-line bg-surface px-3 py-1.5 text-[15px] font-medium text-ink hover:border-accent disabled:opacity-30"
          >
            {tok}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={picked.length !== tokens.length}
          className="press rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink hover:border-accent disabled:opacity-40"
        >
          Check
        </button>
        <button
          type="button"
          onClick={reset}
          className="press text-xs font-semibold text-muted hover:text-ink"
        >
          Reset
        </button>
        {checked && (
          <p className={`text-xs font-semibold ${ok ? "text-good" : "text-bad"}`}>
            {ok ? "Correct." : `Answer: ${answer}`}
          </p>
        )}
      </div>
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
