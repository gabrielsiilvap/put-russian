import { useState } from "react";

export function McqExercise({ options, answer }: { options: string[]; answer: string }) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const isPicked = picked === opt;
        const isRight = opt === answer;
        const show = picked !== null;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setPicked(opt)}
            disabled={picked !== null}
            className={`font-ru press rounded-lg border px-3 py-2 text-left text-[15px] font-medium transition-colors ${
              show && isRight
                ? "border-good bg-good-tint text-good"
                : show && isPicked && !isRight
                ? "border-bad bg-bad-tint text-bad"
                : "border-line bg-paper text-ink hover:border-accent"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
