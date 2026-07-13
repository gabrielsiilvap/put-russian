import { Link } from "react-router-dom";

export function ComingSoonPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-surface px-8 py-14 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{body}</p>
      <Link
        to="/"
        className="press mt-6 inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
