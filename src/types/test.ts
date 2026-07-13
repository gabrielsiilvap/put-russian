import type { Exercise } from "./day";

export interface Test {
  id: string;
  week: number;
  title: string;
  passThreshold: number; // 0-1, default 0.8 per BUILD-SPEC §8
  isMajorMock: boolean;
  canDo: string[]; // this week's "I can..." checklist items
  exercises: Exercise[];
  speakingTask?: {
    prompt: string;
    targetSeconds: number;
    rubric: string[];
  };
}
