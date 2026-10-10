import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import { placeholderTestimonials, testimonials, type Testimonial } from "@/content/testimonials";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

const isDev = process.env.NODE_ENV !== "production";

export function TestimonialsSection() {
  const hasReal = testimonials.length > 0;
  const items = hasReal ? testimonials : isDev ? placeholderTestimonials : [];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-royal py-20 text-white sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_10%,rgba(255,255,255,0.14),transparent),radial-gradient(60%_60%_at_0%_100%,rgba(18,22,63,0.6),transparent)]"
      />
      <div className="relative mx-auto max-w-[86rem] px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 id="testimonials-heading" className="sash text-[length:var(--text-h2)] font-[640]">
            Trusted to bring every detail to life.
          </h2>
          <p className="mt-5 text-lg text-white/80">
            Every project is an opportunity to turn an idea into something lasting. Hear directly from clients who have
            experienced our work.
          </p>
        </div>

        {items.length > 0 ? (
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {items.map((t, i) => (
              <TestimonialCard key={i} t={t} placeholder={!hasReal} />
            ))}
          </ul>
        ) : (
          <div className="glass-dark mt-12 flex flex-col gap-6 rounded-[4px] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="flex gap-4">
              <MessageSquareQuote className="mt-1 size-7 shrink-0 text-white/70" aria-hidden="true" />
              <div>
                <p className="text-xl font-[620] [font-stretch:112%]">Worked with us recently?</p>
                <p className="mt-1 max-w-lg text-white/75">
                  We&rsquo;d love to hear how your project turned out. Send us your feedback on WhatsApp.
                </p>
              </div>
            </div>
            <a
              href={whatsappLink("Hello Whaliyy Aluminium Concept, I'd like to share feedback about my project.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light shrink-0"
            >
              <WhatsAppIcon className="size-4" /> Share your feedback
            </a>
          </div>
        )}

        <div className="mt-14">
          <Link href="/quote" className="btn btn-light">
            Let&rsquo;s Build Something Beautiful
          </Link>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, placeholder }: { t: Testimonial; placeholder: boolean }) {
  const initials = t.name
    .replace(/placeholder\s*—\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <li
      className={`glass-dark relative flex flex-col rounded-[4px] p-7 ${placeholder ? "border-dashed !border-white/40" : ""}`}
    >
      {placeholder ? (
        <span className="mb-4 self-start rounded-full bg-signal px-2.5 py-0.5 text-xs font-semibold">
          Placeholder — development only
        </span>
      ) : null}
      {t.rating ? (
        <p className="mb-3 text-sm text-white/80" aria-label={`Rated ${t.rating} out of 5`}>
          {"★".repeat(t.rating)}
          <span className="text-white/30">{"★".repeat(5 - t.rating)}</span>
        </p>
      ) : null}
      <blockquote className="flex-1 text-[1.05rem] leading-relaxed text-white/90">&ldquo;{t.quote}&rdquo;</blockquote>
      <div className="mt-6 flex items-center gap-3 border-t border-white/15 pt-5">
        <span className="flex size-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
          {initials}
        </span>
        <div>
          <p className="font-semibold">{t.name}</p>
          {t.projectType ? <p className="text-sm text-white/65">{t.projectType}</p> : null}
        </div>
      </div>
    </li>
  );
}
