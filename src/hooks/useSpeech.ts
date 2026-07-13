import { useCallback, useEffect, useRef, useState } from "react";

// TTS for Russian text. The cancel()-then-speak() pattern is unsafe on its own:
// iOS/Safari can wedge the speechSynthesis engine when cancel() is immediately
// followed by speak(), silently dropping the utterance. The fix is a short
// debounce plus an explicit resume() before the new utterance, and re-priming
// the engine when the tab regains visibility (it can wedge on backgrounding too).
export function useSpeech() {
  const ruVoice = useRef<SpeechSynthesisVoice | null>(null);
  const unlocked = useRef(false);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastText = useRef<string>("");
  const lastAt = useRef(0);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [voiceMissing, setVoiceMissing] = useState(false);
  const [voiceChecked, setVoiceChecked] = useState(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const pickVoice = () => {
      const all = speechSynthesis.getVoices();
      if (!all.length) return;
      const ru = all.filter((v) => v.lang.toLowerCase().startsWith("ru"));
      ruVoice.current =
        ru.find((v) => /milena/i.test(v.name)) ||
        ru.find((v) => /google/i.test(v.name)) ||
        ru.find((v) => v.localService) ||
        ru[0] ||
        null;
      setVoiceMissing(ru.length === 0);
      setVoiceChecked(true);
    };
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;

    const unlock = () => {
      if (unlocked.current) return;
      unlocked.current = true;
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      speechSynthesis.speak(u);
      pickVoice();
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);

    const onVisible = () => {
      if (!document.hidden) speechSynthesis.resume();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("visibilitychange", onVisible);
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const sequenceToken = useRef(0);
  const [sequenceActive, setSequenceActive] = useState(false);

  const makeUtterance = useCallback((text: string, slow: boolean) => {
    const u = new SpeechSynthesisUtterance(text.normalize("NFD").replace(/́/g, "").normalize("NFC"));
    u.lang = "ru-RU";
    if (ruVoice.current) u.voice = ruVoice.current;
    u.rate = slow ? 0.7 : 0.9;
    return u;
  }, []);

  const stopSequence = useCallback(() => {
    sequenceToken.current++;
    speechSynthesis.cancel();
    setSequenceActive(false);
    setSpeakingText(null);
  }, []);

  // Plays a list of lines back to back with a short pause between each,
  // calling onItemStart right before that line begins (for shadow-mode
  // highlighting). Cancellable via stopSequence — a new call also
  // invalidates any sequence already in flight via the token.
  const speakSequence = useCallback(
    (items: { id: string; text: string }[], opts?: { onItemStart?: (id: string) => void; pauseMs?: number }) => {
      if (!("speechSynthesis" in window) || !unlocked.current) return;
      if (pending.current) clearTimeout(pending.current);
      speechSynthesis.cancel();
      const myToken = ++sequenceToken.current;
      setSequenceActive(true);

      const playAt = (i: number) => {
        if (myToken !== sequenceToken.current) return;
        if (i >= items.length) {
          setSequenceActive(false);
          setSpeakingText(null);
          return;
        }
        const { id, text } = items[i];
        opts?.onItemStart?.(id);
        const u = makeUtterance(text, false);
        u.onstart = () => setSpeakingText(text);
        u.onend = () => {
          if (myToken !== sequenceToken.current) return;
          setTimeout(() => playAt(i + 1), opts?.pauseMs ?? 450);
        };
        u.onerror = () => {
          if (myToken !== sequenceToken.current) return;
          playAt(i + 1);
        };
        speechSynthesis.resume();
        speechSynthesis.speak(u);
      };

      pending.current = setTimeout(() => playAt(0), 80);
    },
    [makeUtterance]
  );

  const speak = useCallback((text: string, opts?: { slow?: boolean }) => {
    if (!("speechSynthesis" in window) || !unlocked.current) return;
    if (pending.current) clearTimeout(pending.current);
    sequenceToken.current++; // invalidate any in-flight sequence
    setSequenceActive(false);
    speechSynthesis.cancel();

    const now = Date.now();
    const autoSlow = text === lastText.current && now - lastAt.current < 3000;
    lastText.current = text;
    lastAt.current = now;
    const slow = opts?.slow ?? autoSlow;

    const u = new SpeechSynthesisUtterance(text.normalize("NFD").replace(/́/g, "").normalize("NFC"));
    u.lang = "ru-RU";
    if (ruVoice.current) u.voice = ruVoice.current;
    u.rate = slow ? 0.7 : 0.9;
    u.onstart = () => setSpeakingText(text);
    u.onend = () => setSpeakingText((cur) => (cur === text ? null : cur));
    u.onerror = () => setSpeakingText((cur) => (cur === text ? null : cur));

    pending.current = setTimeout(() => {
      speechSynthesis.resume();
      speechSynthesis.speak(u);
    }, 80);
  }, []);

  return { speak, speakSequence, stopSequence, sequenceActive, speakingText, voiceMissing, voiceChecked };
}
