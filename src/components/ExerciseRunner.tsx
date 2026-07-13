import type { Exercise, ExerciseMatchItem, ExerciseTextItem } from "../types/day";
import { MatchExercise } from "./exercises/MatchExercise";
import { FillExercise } from "./exercises/FillExercise";
import { TranslateExercise } from "./exercises/TranslateExercise";
import { McqExercise } from "./exercises/McqExercise";
import { OrderExercise } from "./exercises/OrderExercise";

export function ExerciseRunner({ exercise }: { exercise: Exercise }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-ink">{exercise.prompt}</p>
      <Body exercise={exercise} />
    </div>
  );
}

function Body({ exercise }: { exercise: Exercise }) {
  switch (exercise.type) {
    case "match":
      return <MatchExercise items={(exercise.items as ExerciseMatchItem[]) ?? []} />;
    case "fill":
    case "cloze":
      return <FillExercise items={(exercise.items as ExerciseTextItem[]) ?? []} />;
    case "translate":
      return <TranslateExercise items={(exercise.items as ExerciseTextItem[]) ?? []} />;
    case "mcq":
      return <McqExercise options={exercise.options ?? []} answer={exercise.answer ?? ""} />;
    case "order":
      return <OrderExercise tokens={exercise.tokens ?? []} answer={exercise.answer ?? ""} />;
    default:
      return null;
  }
}
