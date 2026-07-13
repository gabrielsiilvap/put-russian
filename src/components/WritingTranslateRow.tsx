import { useState } from "react";
import type { TranslateItem } from "../types/day";

export function WritingTranslateRow({ item }: { item: TranslateItem }) {
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <p className="text-sm text-ink">{item.en}</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="по-русски..."
        className="font-ru mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-[16px] text-ink focus:border-accent focus:outline-none"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <div className="mt-2">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="press rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink hover:border-accent"
          >
            Reveal model answer
          </button>
        ) : (
          <p className="font-ru text-sm text-accent">{item.answer}</p>
        )}
      </div>
    </div>
  );
}
