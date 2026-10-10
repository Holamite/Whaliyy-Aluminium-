import Link from "next/link";
import { business } from "@/content/site";

/** Vector recreation of the window mark on the business card. */
export function LogoMark({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 112" className={className} aria-hidden="true" focusable="false">
      <path d="M10 12h30v8H18v72h22v8H10z" fill="#30358F" />
      <path d="M26 2l50 15v7L35 12v88l38-8v7l-47 11z" fill="#ED1C2E" />
      <path d="M42 27l46-13v86l-46-7z" fill="#30358F" />
      <path d="M64 21v75M42 60l46-1" stroke="#fff" strokeWidth="3.5" />
      <path d="M42 27l46-13v86l-46-7z" fill="none" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const main = tone === "dark" ? "text-midnight" : "text-white";
  const sub = tone === "dark" ? "text-muted" : "text-white/70";
  return (
    <Link href="/#top" className="group flex items-center gap-3" aria-label={`${business.name} — home`}>
      <span className={tone === "light" ? "rounded-[3px] bg-white p-1.5" : ""}>
        <LogoMark className={tone === "light" ? "h-8 w-auto" : "h-10 w-auto"} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[1.2rem] font-[750] tracking-[-0.01em] [font-stretch:125%] ${main}`}>Whaliyy</span>
        <span className={`mt-1 text-[0.72rem] font-medium tracking-[0.02em] [font-stretch:110%] ${sub}`}>
          Aluminium Concept
        </span>
      </span>
    </Link>
  );
}
