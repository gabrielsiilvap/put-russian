import { useMemo, useState } from "react";
import { SpeakButton } from "./SpeakButton";

export interface CardItem {
  key: string;
  ru: string;
  en: string;
  note?: string;
}

// Advancing (Got it / Again) fades + lifts the incoming card so it reads as
// motion continuous with the flip, instead of the content silently swapping.
export function FlashcardCarousel({
  items,
  direction = "ru-first",
  onGotIt,
  onMissed,
  onDeckCleared,
}: {
  items: CardItem[];
  direction?: "ru-first" | "en-first";
  onGotIt?: (item: CardItem) => void;
  onMissed?: (item: CardItem) => void;
  onDeckCleared?: () => void;
}) {
  const initialDeck = useMemo(() => items.map((_, i) => i), [items]);
  const [deck, setDeck] = useState<number[]>(initialDeck);
  const [flipped, setFlipped] = useState(false);
  const [entering, setEntering] = useState(false);

  const advance = (mutate: (d: number[]) => number[]) => {
    setFlipped(false);
    setDeck((d) => mutate(d));
    setEntering(true);
    requestAnimationFrame(() => setEntering(false));
  };

  if (deck.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper px-6 py-10 text-center">
        <p className="font-display text-lg text-ink">Deck cleared</p>
        <button
          type="button"
          onClick={() => {
            setDeck(initialDeck);
            onDeckCleared?.();
          }}
          className="press mt-3 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent"
        >
          Go again
        </button>
      </div>
    );
  }

  const item = items[deck[0]];
  const front = direction === "ru-first" ? item.ru : item.en;
  const back = direction === "ru-first" ? item.en : item.ru;
  const frontIsRu = direction === "ru-first";

  return (
    <div className="mx-auto max-w-sm">
      <p className="mb-2 text-center text-xs font-semibold text-muted">
        {items.length - deck.length + 1} / {items.length}
      </p>
      <div
        className="[perspective:1200px]"
        style={{ height: 200 }}
      >
        {/* Outer wrapper: only handles the card-advance enter transition (opacity + translateY). */}
        <div
          className={`h-full w-full transition-[opacity,transform] duration-200 ease-out-strong ${
            entering ? "translate-y-1.5 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {/* Inner wrapper: only handles the flip (rotateY), independent transform. */}
          <div
            className="relative h-full w-full cursor-pointer transition-transform duration-[320ms] ease-in-out-strong [transform-style:preserve-3d]"
            style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            aria-label="Flashcard, tap to flip"
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
          >
          <Face>
            <p className={frontIsRu ? "font-ru text-3xl font-bold text-ink" : "text-xl font-semibold text-ink"}>
              {front}
            </p>
            {frontIsRu && (
              <div onClick={(e) => e.stopPropagation()}>
                <SpeakButton text={item.ru} />
              </div>
            )}
            <p className="text-xs text-muted">tap to flip</p>
          </Face>
          <Face back>
            <p className={frontIsRu ? "text-xl font-semibold text-accent" : "font-ru text-3xl font-bold text-accent"}>
              {back}
            </p>
            {!frontIsRu && (
              <div onClick={(e) => e.stopPropagation()}>
                <SpeakButton text={item.ru} />
              </div>
            )}
            {item.note && <p className="text-xs text-muted">{item.note}</p>}
          </Face>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          className="press rounded-full border border-line px-5 py-2 text-sm font-semibold text-muted hover:border-ink"
          onClick={() => {
            onMissed?.(item);
            advance((d) => [...d.slice(1), d[0]]);
          }}
        >
          Again
        </button>
        <button
          type="button"
          className="press rounded-full bg-good px-5 py-2 text-sm font-semibold text-white"
          onClick={() => {
            onGotIt?.(item);
            advance((d) => d.slice(1));
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function Face({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-card border border-line bg-surface p-6 text-center [backface-visibility:hidden]"
      style={back ? { transform: "rotateY(180deg)" } : undefined}
    >
      {children}
    </div>
  );
}
