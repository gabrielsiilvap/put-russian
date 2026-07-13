import { useState } from "react";
import type { ExerciseTextItem } from "../../types/day";
import { isCorrect } from "../../lib/grade";

export function FillExercise({ items }: { items: ExerciseTextItem[] }) {
  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <FillRow key={i} item={it} />
      ))}
    </div>
  );
}

function FillRow({ item }: { item: ExerciseTextItem }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const parts = item.q.split("___");

  // Some items intentionally have no answer (the trick is that nothing fills
  // the blank at all) — show them as a note instead of an unfillable input.
  if (item.answer === "" && parts.length > 1) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-paper p-3">
        <p className="font-ru text-[17px] text-ink">{item.q}</p>
        {item.note && <p className="mt-1 text-xs text-muted">{item.note}</p>}
      </div>
    );
  }

  const ok = checked && isCorrect(value, item.answer, item.acceptable);

  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <p className="font-ru flex flex-wrap items-center gap-1 text-[17px] text-ink">
        <span>{parts[0]}</span>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && setChecked(true)}
          className={`font-ru w-28 rounded-md border-b-2 bg-transparent px-1 text-center focus:outline-none ${
            checked ? (ok ? "border-good text-good" : "border-bad text-bad") : "border-line"
          }`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <span>{parts[1]}</span>
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="press rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink hover:border-accent"
        >
          Check
        </button>
        {checked && (
          <p className={`text-xs font-semibold ${ok ? "text-good" : "text-bad"}`}>
            {ok ? "Correct" : `Answer: ${item.answer}`}
          </p>
        )}
      </div>
    </div>
  );
}
