import { useState } from "react";
import type { ExerciseTextItem } from "../../types/day";
import { isCorrect } from "../../lib/grade";

// Russian has many valid phrasings, so a non-match never gets marked "wrong"
// outright: the model answer is revealed and the learner self-judges. Per
// BUILD-SPEC §7 — teach, don't punish.
export function TranslateExercise({ items }: { items: ExerciseTextItem[] }) {
  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <TranslateRow key={i} item={it} />
      ))}
    </div>
  );
}

type State = "unchecked" | "auto-correct" | "self-judging" | "self-ok" | "self-fix";

function TranslateRow({ item }: { item: ExerciseTextItem }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>("unchecked");

  const check = () => {
    if (!value.trim()) return;
    setState(isCorrect(value, item.answer, item.acceptable) ? "auto-correct" : "self-judging");
  };

  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <p className="text-sm text-ink">{item.q}</p>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setState("unchecked");
        }}
        onKeyDown={(e) => e.key === "Enter" && check()}
        placeholder="по-русски..."
        className="font-ru mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-[17px] text-ink focus:border-accent focus:outline-none"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {state === "unchecked" && (
          <button
            type="button"
            onClick={check}
            className="press rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink hover:border-accent"
          >
            Check
          </button>
        )}
        {state === "auto-correct" && <p className="text-xs font-semibold text-good">Correct.</p>}
        {(state === "self-judging" || state === "self-ok" || state === "self-fix") && (
          <div className="w-full">
            <p className="font-ru text-sm text-ink">
              Model answer: <span className="font-semibold text-accent">{item.answer}</span>
            </p>
            {state === "self-judging" && (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setState("self-ok")}
                  className="press rounded-full border border-good px-3 py-1 text-xs font-semibold text-good"
                >
                  Close enough
                </button>
                <button
                  type="button"
                  onClick={() => setState("self-fix")}
                  className="press rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted"
                >
                  I'll fix it
                </button>
              </div>
            )}
            {state === "self-ok" && <p className="mt-1 text-xs font-semibold text-good">Marked as understood.</p>}
            {state === "self-fix" && <p className="mt-1 text-xs text-muted">Noted — revisit this one.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
