import { useSpeechContext } from "../lib/SpeechProvider";
import { VolumeIcon } from "./icons";

export function SpeakButton({ text, className = "" }: { text: string; className?: string }) {
  const { speak, speakingText } = useSpeechContext();
  const isPlaying = speakingText === text;

  return (
    <button
      type="button"
      className={`press inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-accent transition-colors hover:bg-accent-tint ${
        isPlaying ? "bg-accent-tint" : ""
      } ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      title="Tap to hear. Tap twice quickly to hear it slow."
      aria-label={`Listen: ${text}`}
    >
      <VolumeIcon className={isPlaying ? "animate-pulse" : ""} />
    </button>
  );
}
