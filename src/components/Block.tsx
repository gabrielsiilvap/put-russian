import { useState, type ReactNode } from "react";
import { CheckIcon, ChevronIcon } from "./icons";

export function Block({
  letter,
  title,
  minutes,
  done,
  onToggleDone,
  defaultOpen = true,
  children,
}: {
  letter: string;
  title: string;
  minutes: number;
  done: boolean;
  onToggleDone: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-card border border-line bg-surface">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={onToggleDone}
          aria-pressed={done}
          aria-label={done ? `Mark block ${letter} not done` : `Mark block ${letter} done`}
          className={`press flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 transition-colors ${
            done ? "border-good bg-good text-white" : "border-line text-transparent hover:border-accent"
          }`}
        >
          <CheckIcon size={15} />
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <span>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Block {letter} · {minutes} min
            </span>
            <span className="font-display block text-lg font-bold leading-tight text-ink">{title}</span>
          </span>
          <ChevronIcon
            size={18}
            className={`flex-none text-muted transition-transform duration-200 ease-out-strong ${
              open ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>
      {open && <div className="animate-fade-in-up border-t border-line p-4 pt-4">{children}</div>}
    </section>
  );
}
