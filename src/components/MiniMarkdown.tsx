// Renders the small subset of markdown used in grammarPoint.explanation:
// paragraphs separated by blank lines, **bold** spans.
export function MiniMarkdown({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-2 text-[15px] leading-relaxed text-ink last:mb-0">
          {boldify(p)}
        </p>
      ))}
    </>
  );
}

function boldify(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-accent">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
