import { useState } from "react";
import type { ComprehensionItem } from "../types/day";
import { isCorrect } from "../lib/grade";

export function ComprehensionRow({ item }: { item: ComprehensionItem }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const ok = checked && isCorrect(value, item.answer, item.acceptable);
  const isProduce = item.type === "produce";

  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm text-ink">{item.q}</p>
        <span className="flex-none rounded-full bg-line px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
          {item.type}
        </span>
      </div>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setChecked(false);
        }}
        onKeyDown={(e) => e.key === "Enter" && setChecked(true)}
        placeholder={isProduce ? "по-русски..." : "your answer..."}
        className={`font-ru w-full rounded-md border bg-surface px-3 py-2 text-[16px] text-ink focus:outline-none ${
          checked ? (ok ? "border-good" : "border-line") : "border-line focus:border-accent"
        }`}
        autoComplete="off"
        spellCheck={false}
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="press rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink hover:border-accent"
        >
          Check
        </button>
        {checked && (
          <p className={`text-xs font-semibold ${ok ? "text-good" : "text-muted"}`}>
            {ok ? "Correct." : `Answer: ${item.answer}`}
          </p>
        )}
      </div>
    </div>
  );
}
