// BUILD-SPEC.md §7: trim, lowercase, ё=е, ignore trailing punctuation.
export function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ");
}

export function isCorrect(userInput: string, answer: string, acceptable: string[] = []): boolean {
  const u = normalize(userInput);
  if (!u) return false;
  return [answer, ...acceptable].some((a) => normalize(a) === u);
}
