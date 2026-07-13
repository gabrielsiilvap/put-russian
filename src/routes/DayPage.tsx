import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Day, VocabItem } from "../types/day";
import { loadDay } from "../lib/content";
import { useDayProgress } from "../hooks/useDayProgress";
import { toggleBlock, setMissionTick, saveFreeWrite, latestFreeWrite, type BlockId } from "../lib/db";
import { Block } from "../components/Block";
import { FlashcardCarousel, type CardItem } from "../components/FlashcardCarousel";
import { SpeakButton } from "../components/SpeakButton";
import { DialogueView } from "../components/DialogueView";
import { ComprehensionRow } from "../components/ComprehensionRow";
import { ExerciseRunner } from "../components/ExerciseRunner";
import { MiniMarkdown } from "../components/MiniMarkdown";
import { WritingTranslateRow } from "../components/WritingTranslateRow";
import { MicIcon, CheckIcon, XIcon } from "../components/icons";

export function DayPage() {
  const { dayNum } = useParams();
  const n = Number(dayNum);
  const [day, setDay] = useState<Day | null | undefined>(undefined);
  const progress = useDayProgress(n);

  useEffect(() => {
    setDay(undefined);
    if (Number.isInteger(n) && n >= 1 && n <= 91) {
      loadDay(n).then(setDay);
    } else {
      setDay(null);
    }
  }, [n]);

  if (!Number.isInteger(n) || n < 1 || n > 91) return <Navigate to="/" replace />;
  if (day === undefined || progress === undefined) {
    return <div className="animate-pulse text-muted">Loading…</div>;
  }
  if (day === null) {
    return (
      <div className="rounded-card border border-dashed border-line bg-surface px-8 py-14 text-center">
        <p className="font-display text-lg text-ink">Content coming</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Day {n} hasn't been generated yet (Phase 3). Days 1–2 are fully built.
        </p>
        <Link to="/" className="press mt-6 inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const done = new Set(progress.completedBlocks);
  const toggle = (b: BlockId) => toggleBlock(n, b);
  const encodeCards: CardItem[] = day.vocab.map((v) => ({ key: v.id, ru: v.ru, en: v.en, note: v.note }));
  const recallCards: CardItem[] = day.vocab.map((v) => ({ key: v.id, ru: v.ru, en: v.en }));

  return (
    <div className="grid gap-5">
      <div>
        <Link to={`/week/${day.week}`} className="text-sm font-semibold text-muted hover:text-ink">
          ← Week {day.week}
        </Link>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-accent">
          Day {day.day} · {done.size}/7 blocks done
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold text-ink">{day.function}</h1>
        <p className="mt-1 text-sm text-muted">Can-do: {day.canDo}</p>
        {day.needsReview && (
          <p className="mt-2 inline-block rounded-full bg-bad-tint px-3 py-1 text-xs font-semibold text-bad">
            Flagged for tutor review
          </p>
        )}
      </div>

      <Block letter="A" title="SRS review" minutes={25} done={done.has("A")} onToggleDone={() => toggle("A")}>
        <p className="mb-3 text-sm text-muted">
          No cards are due yet — the spaced-review engine ships in Phase 2. For now, first-pass encode
          today's words: read it, hear it, say it out loud, then flip.
        </p>
        <FlashcardCarousel items={encodeCards} direction="ru-first" />
      </Block>

      <Block letter="B" title="New vocab" minutes={15} done={done.has("B")} onToggleDone={() => toggle("B")}>
        <div className="grid gap-2">
          {day.vocab.map((v) => (
            <VocabRow key={v.id} v={v} />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          These {day.vocab.length} words are added to your review deck automatically once the day is marked
          complete.
        </p>
      </Block>

      <Block letter="C" title="Dialogue: read + shadow" minutes={20} done={done.has("C")} onToggleDone={() => toggle("C")}>
        <div className="grid gap-4">
          {day.dialogues.map((d, i) => (
            <div key={i} className="rounded-lg border border-line bg-paper p-3">
              <DialogueView dialogue={d} />
            </div>
          ))}
        </div>
      </Block>

      <Block letter="D" title="Comprehension check" minutes={10} done={done.has("D")} onToggleDone={() => toggle("D")}>
        <div className="grid gap-2">
          {day.comprehension.map((c, i) => (
            <ComprehensionRow key={i} item={c} />
          ))}
        </div>
      </Block>

      <Block letter="E" title="Grammar + drills" minutes={20} done={done.has("E")} onToggleDone={() => toggle("E")}>
        <div className="mb-5 rounded-lg border-l-4 border-accent bg-paper p-4">
          <p className="font-display mb-1 text-base font-bold text-ink">{day.grammarPoint.title}</p>
          <MiniMarkdown text={day.grammarPoint.explanation} />
          <div className="mt-3 grid gap-1.5">
            {day.grammarPoint.examples.map((ex, i) => (
              <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-t border-line pt-1.5 first:border-0 first:pt-0">
                <span className="font-ru inline-flex items-center gap-1 text-[15px] text-ink">
                  <SpeakButton text={ex.ru} />
                  {ex.ru}
                </span>
                <span className="text-xs text-muted">
                  {ex.en}
                  {ex.note ? ` — ${ex.note}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4">
          {day.exercises.map((ex, i) => (
            <div key={i} className="rounded-lg border border-line bg-paper p-3">
              <ExerciseRunner exercise={ex} />
            </div>
          ))}
        </div>
      </Block>

      <Block letter="F" title="Written production" minutes={25} done={done.has("F")} onToggleDone={() => toggle("F")}>
        <div className="grid gap-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Translate</p>
            <div className="grid gap-2">
              {day.writing.translate.map((t, i) => (
                <WritingTranslateRow key={i} item={t} />
              ))}
            </div>
          </div>
          <BuildSentences instruction={day.writing.buildSentences.instruction} count={day.writing.buildSentences.count} />
          <FreeWrite day={n} prompt={day.writing.freeWrite.prompt} minSentences={day.writing.freeWrite.minSentences} modelAnswer={day.writing.freeWrite.modelAnswer} />
        </div>
      </Block>

      <Block letter="G" title="Self-test" minutes={10} done={done.has("G")} onToggleDone={() => toggle("G")}>
        <p className="mb-3 text-sm text-muted">
          Meaning shows first — recall the Russian out loud, then flip to check yourself.
        </p>
        <FlashcardCarousel items={recallCards} direction="en-first" />
      </Block>

      <MissionCard day={n} tasks={day.mission.tasks} verification={day.mission.verification} />
    </div>
  );
}

function VocabRow({ v }: { v: VocabItem }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-ru inline-flex items-center gap-1 text-[19px] font-semibold text-ink">
            <SpeakButton text={v.ru} />
            {v.ru}
          </p>
          <p className="text-sm text-accent">{v.en}</p>
          {v.note && <p className="mt-0.5 text-xs text-muted">{v.note}</p>}
        </div>
        {v.forvoUrl && (
          <a
            href={v.forvoUrl}
            target="_blank"
            rel="noreferrer"
            className="press flex-none rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted hover:border-accent hover:text-accent"
          >
            Forvo
          </a>
        )}
      </div>
      {v.example && (
        <p className="font-ru mt-2 border-t border-line pt-2 text-sm text-ink">
          {v.example.ru} <span className="font-sans text-xs text-muted">— {v.example.en}</span>
        </p>
      )}
    </div>
  );
}

function BuildSentences({ instruction, count }: { instruction: string; count: number }) {
  const [text, setText] = useState("");
  const written = text.split("\n").filter((l) => l.trim().length > 0).length;
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Build your own sentences</p>
      <p className="mb-2 text-sm text-ink">{instruction}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="one sentence per line…"
        className="font-ru w-full rounded-lg border border-line bg-paper px-3 py-2 text-[16px] text-ink focus:border-accent focus:outline-none"
      />
      <p className={`mt-1 text-xs font-semibold ${written >= count ? "text-good" : "text-muted"}`}>
        {written} / {count} sentences
      </p>
    </div>
  );
}

function FreeWrite({
  day,
  prompt,
  minSentences,
  modelAnswer,
}: {
  day: number;
  prompt: string;
  minSentences: number;
  modelAnswer?: string;
}) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    latestFreeWrite(day).then((fw) => {
      if (fw) setText(fw.text);
    });
  }, [day]);

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Free-write</p>
      <p className="mb-2 text-sm text-ink">
        {prompt} <span className="text-muted">(at least {minSentences} sentences)</span>
      </p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        rows={4}
        placeholder="Здравствуйте..."
        className="font-ru w-full rounded-lg border border-line bg-paper px-3 py-2 text-[16px] text-ink focus:border-accent focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={async () => {
            if (!text.trim()) return;
            await saveFreeWrite(day, text);
            setSaved(true);
          }}
          className="press rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white"
        >
          Save to archive
        </button>
        {saved && <p className="text-xs font-semibold text-good">Saved — visible in Progress once it ships.</p>}
        {modelAnswer && (
          <button
            type="button"
            onClick={() => setShowModel((s) => !s)}
            className="press text-xs font-semibold text-muted hover:text-ink"
          >
            {showModel ? "Hide" : "Show"} model answer
          </button>
        )}
      </div>
      {showModel && modelAnswer && <p className="font-ru mt-2 text-sm text-accent">{modelAnswer}</p>}
    </div>
  );
}

function MissionCard({ day, tasks, verification }: { day: number; tasks: string[]; verification: string }) {
  const [ticks, setTicks] = useState<Record<number, boolean | null>>({});

  return (
    <section className="rounded-card border-2 border-accent bg-accent-tint p-5">
      <div className="mb-3 flex items-center gap-2">
        <MicIcon className="text-accent" />
        <p className="font-display text-lg font-bold text-ink">The Mission</p>
      </div>
      <div className="grid gap-2">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2">
            <p className="text-sm text-ink">{t}</p>
            <div className="flex flex-none gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setTicks((tk) => ({ ...tk, [i]: true }));
                  setMissionTick(day, i, true);
                }}
                className={`press flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                  ticks[i] === true ? "border-good bg-good text-white" : "border-line text-transparent hover:border-good"
                }`}
                aria-label="Did it land? Yes"
              >
                <CheckIcon size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTicks((tk) => ({ ...tk, [i]: false }));
                  setMissionTick(day, i, false);
                }}
                className={`press flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  ticks[i] === false ? "border-bad bg-bad text-white" : "border-line text-transparent hover:border-bad"
                }`}
                aria-label="Did it land? No"
              >
                <XIcon size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">{verification}</p>
    </section>
  );
}
