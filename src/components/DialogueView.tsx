import { useState } from "react";
import type { Dialogue } from "../types/day";
import { SpeakButton } from "./SpeakButton";
import { useSpeechContext } from "../lib/SpeechProvider";

export function DialogueView({ dialogue }: { dialogue: Dialogue }) {
  const { speakSequence, stopSequence, sequenceActive } = useSpeechContext();
  const [showEnglish, setShowEnglish] = useState(true);
  const [hideSide, setHideSide] = useState<"A" | "B" | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const lineId = (i: number) => String(i);

  const shadow = () => {
    if (sequenceActive) {
      stopSequence();
      setActiveLine(null);
      return;
    }
    speakSequence(
      dialogue.lines.map((l, i) => ({ id: lineId(i), text: l.ru })),
      {
        onItemStart: (id) => setActiveLine(Number(id)),
        pauseMs: 900,
      }
    );
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-display text-base font-bold text-ink">{dialogue.title}</p>
        {dialogue.note && <p className="text-xs italic text-muted">{dialogue.note}</p>}
      </div>

      {dialogue.glossWords && dialogue.glossWords.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {dialogue.glossWords.map((g) => (
            <span key={g.ru} className="font-ru rounded-full bg-accent-tint px-2.5 py-1 text-xs font-medium text-accent">
              {g.ru} <span className="text-muted">— {g.en}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        <ToolButton active={showEnglish} onClick={() => setShowEnglish((v) => !v)}>
          {showEnglish ? "Hide English" : "Show English"}
        </ToolButton>
        <ToolButton active={hideSide === "A"} onClick={() => setHideSide((s) => (s === "A" ? null : "A"))}>
          Practice as A
        </ToolButton>
        <ToolButton active={hideSide === "B"} onClick={() => setHideSide((s) => (s === "B" ? null : "B"))}>
          Practice as B
        </ToolButton>
        <ToolButton active={sequenceActive} onClick={shadow}>
          {sequenceActive ? "Stop" : "Shadow: play & repeat"}
        </ToolButton>
      </div>

      <div className="grid gap-2">
        {dialogue.lines.map((l, i) => {
          const isHiddenForPractice = hideSide === l.speaker && !revealed.has(i);
          const isActive = activeLine === i && sequenceActive;
          return (
            <div key={i} className={`flex gap-2 ${l.speaker === "B" ? "flex-row-reverse" : ""}`}>
              <span
                className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
                  l.speaker === "A" ? "bg-accent-tint text-accent" : "bg-line text-ink"
                }`}
              >
                {l.speaker}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl border px-3 py-2 transition-colors duration-150 ${
                  isActive ? "border-gold bg-gold-tint" : "border-line bg-paper"
                } ${l.speaker === "B" ? "text-right" : ""}`}
              >
                {isHiddenForPractice ? (
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => new Set(r).add(i))}
                    className="rounded-md border border-dashed border-line px-3 py-1 text-xs font-semibold text-muted hover:border-accent hover:text-accent"
                  >
                    your line — tap to reveal
                  </button>
                ) : (
                  <p className="font-ru inline-flex items-center gap-1 text-[16px] text-ink">
                    {l.speaker === "B" && <SpeakButton text={l.ru} />}
                    {l.ru}
                    {l.speaker === "A" && <SpeakButton text={l.ru} />}
                  </p>
                )}
                {showEnglish && !isHiddenForPractice && (
                  <p className="mt-0.5 text-xs text-muted">{l.en}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? "border-accent bg-accent text-white" : "border-line text-ink hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}
