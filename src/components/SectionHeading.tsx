import type { ReactNode } from "react";

export function SectionHeading({
  id,
  title,
  intro,
  tone = "dark",
  className = "",
}: {
  id?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2
        id={id}
        className={`sash text-[length:var(--text-h2)] font-[640] ${tone === "dark" ? "text-midnight" : "text-white"}`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-5 max-w-xl text-lg ${tone === "dark" ? "text-muted" : "text-white/75"}`}>{intro}</p>
      ) : null}
    </div>
  );
}
