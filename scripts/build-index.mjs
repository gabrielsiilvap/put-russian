// Generates public/content/index.json from CURRICULUM-MAP.md's day-by-day plan.
// Run with: node scripts/build-index.mjs
import { writeFileSync } from "node:fs";

// [weekTheme, testId|null, [dayFunction, ...6 or 7 entries]]
const WEEKS = [
  ["Survival present + \"I want\" + questions", "test-01", [
    "Greet, give name, say what you want",
    "Say where you live / what you do",
    "Ask \"you\" questions",
    "Say what you like doing",
    "Full present-tense control",
    "Consolidate + light review",
    "Weekly checkpoint test 1 + rest",
  ]],
  ["Doing things / daily life (accusative)", "test-02", [
    "Talk about objects you act on",
    "More daily actions",
    "Describe your routine",
    "Frequency & habits",
    "Ask & answer about daily life",
    "Consolidate + light review",
    "Weekly checkpoint test 2 + rest",
  ]],
  ["Having & not having (genitive)", "test-03", [
    "Say what you have",
    "Ask if someone has something",
    "Say what you lack",
    "Talk about family",
    "Quantities",
    "Consolidate + light review",
    "Weekly checkpoint test 3 + rest",
  ]],
  ["Numbers, age, money (genitive continued)", "test-04", [
    "Count things",
    "Prices & money",
    "Age",
    "Time & dates basics",
    "Shopping + age dialogue consolidation",
    "Full review of weeks 1–4",
    "MONTH-1 MAJOR MOCK",
  ]],
  ["Dative: liking, needing, giving", "test-05", [
    "The dative",
    "Say what you like",
    "Say what you need",
    "Give / help / call someone",
    "Opinions consolidation",
    "Consolidate + light review",
    "Weekly checkpoint test 5 + rest",
  ]],
  ["Prepositional: location & topics", "test-06", [
    "Say where things are",
    "Locations around town",
    "Talk \"about\" something",
    "в vs на",
    "Describe your neighborhood consolidation",
    "Consolidate + light review",
    "Weekly checkpoint test 6 + rest",
  ]],
  ["Instrumental: with & being", "test-07", [
    "Say \"with\" someone/something",
    "State your profession",
    "By what means",
    "Common instrumental verbs",
    "Six-case self-audit consolidation",
    "Consolidate + light review",
    "Weekly checkpoint test 7 (case-system checkpoint) + rest",
  ]],
  ["The past + aspect intro", "test-08", [
    "Past tense",
    "Past of your core verbs",
    "Aspect, the big idea",
    "Aspect in the past",
    "Tell a story about yesterday",
    "Full review weeks 5–8",
    "MONTH-2 MAJOR MOCK",
  ]],
  ["Future & plans", "test-09", [
    "Compound future",
    "Simple (perfective) future",
    "Choosing aspect in the future",
    "Intentions & hopes",
    "Talk about your week ahead",
    "Consolidate + light review",
    "Weekly checkpoint test 9 + rest",
  ]],
  ["Verbs of motion", "test-10", [
    "Going on foot",
    "Going by vehicle",
    "Arrive / leave",
    "Enter / exit / reach / approach",
    "Ask the way",
    "Consolidate + light review",
    "Weekly checkpoint test 10 + rest",
  ]],
  ["Complex sentences", "test-11", [
    "Report thoughts",
    "Give reasons",
    "Purpose & condition",
    "Time clauses",
    "Describe with relative clauses",
    "Consolidate + light review",
    "Weekly checkpoint test 11 + rest",
  ]],
  ["Requests, politeness, would-like", "test-12", [
    "Give instructions",
    "Polite requests",
    "Obligation",
    "Hypotheticals & wishes",
    "Handle a service interaction politely",
    "Consolidate + light review",
    "Weekly checkpoint test 12 + rest",
  ]],
  ["Integration & fluency push", "test-13", [
    "Compare things",
    "Best/most",
    "Full review — the six cases",
    "Full review — verbs (aspect, tense, motion)",
    "Free conversation",
    "Final consolidation across all functions",
    "FINAL B1 SPEAKING MOCK",
  ]],
];

const AVAILABLE = new Set([1, 2]);

const days = [];
let dayNum = 0;
WEEKS.forEach(([theme, testId, functions], wi) => {
  functions.forEach((fn, di) => {
    dayNum++;
    const isTestDay = di === functions.length - 1;
    days.push({
      day: dayNum,
      week: wi + 1,
      theme,
      function: fn,
      test: isTestDay ? testId : null,
      available: AVAILABLE.has(dayNum),
    });
  });
});

writeFileSync(
  new URL("../public/content/index.json", import.meta.url),
  JSON.stringify({ days }, null, 2) + "\n"
);
console.log(`Wrote ${days.length} days to public/content/index.json`);
