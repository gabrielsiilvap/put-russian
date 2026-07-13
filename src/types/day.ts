// Mirrors day-schema.json (BUILD-SPEC.md §4).

export interface VocabExample {
  ru: string;
  en: string;
}

export interface VocabItem {
  id: string;
  ru: string;
  en: string;
  pos?: string;
  gender?: "m" | "f" | "n" | "pl" | "";
  aspectPartner?: string | null;
  note?: string;
  example?: VocabExample;
  forvoUrl?: string | null;
}

export interface DialogueLine {
  speaker: "A" | "B";
  ru: string;
  en: string;
}

export interface GlossWord {
  ru: string;
  en: string;
}

export interface Dialogue {
  title: string;
  note?: string;
  glossWords?: GlossWord[];
  lines: DialogueLine[];
}

export interface ComprehensionItem {
  q: string;
  type: "understand" | "produce";
  answer: string;
  acceptable?: string[];
}

export interface ExerciseMatchItem {
  left: string;
  right: string;
}

export interface ExerciseTextItem {
  q: string;
  answer: string;
  acceptable?: string[];
  note?: string;
}

export type ExerciseType = "match" | "fill" | "translate" | "mcq" | "cloze" | "order";

export interface Exercise {
  type: ExerciseType;
  prompt: string;
  items?: (ExerciseMatchItem | ExerciseTextItem)[];
  options?: string[];
  answer?: string;
  tokens?: string[];
}

export interface GrammarExample {
  ru: string;
  en: string;
  note?: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  examples: GrammarExample[];
}

export interface TranslateItem {
  en: string;
  answer: string;
  acceptable?: string[];
}

export interface Writing {
  translate: TranslateItem[];
  buildSentences: { instruction: string; count: number };
  freeWrite: { prompt: string; minSentences: number; modelAnswer?: string };
}

export interface Mission {
  tasks: string[];
  verification: string;
}

export type SrsCardType = "production" | "cloze" | "listening";

export interface SrsCard {
  type: SrsCardType;
  front: string;
  back: string;
  hint?: string;
}

export interface Day {
  day: number;
  week: number;
  theme: string;
  function: string;
  canDo: string;
  review?: boolean;
  test?: string | null;
  needsReview?: boolean;
  grammarPoint: GrammarPoint;
  vocab: VocabItem[];
  dialogues: Dialogue[];
  comprehension: ComprehensionItem[];
  exercises: Exercise[];
  writing: Writing;
  mission: Mission;
  srsCards: SrsCard[];
}

export interface IndexDay {
  day: number;
  week: number;
  theme: string;
  function: string;
  test: string | null;
  available: boolean;
}

export interface ContentIndex {
  days: IndexDay[];
}
