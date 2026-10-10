import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { images } from "@/content/images";
import { business } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

const panes = [
  { asset: images.img20, alt: "Contemporary three-storey house with wide aluminium-framed windows", pos: "50% 45%" },
  { asset: images.img29, alt: "Frameless glass staircase balustrade in a bright living room", pos: "72% 72%" },
  { asset: images.img04, alt: "Tinted frameless swing glass doors with gold handles", pos: "50% 50%" },
];

export function HeroSection() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      {/* Faint mullion grid behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(48,53,143,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(48,53,143,0.06)_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(48,53,143,0.14),transparent)]"
      />

      <div className="relative mx-auto grid max-w-[86rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="rise text-[length:var(--text-eyebrow)] font-semibold tracking-[0.14em] text-royal [font-stretch:110%]">
            PRECISION ALUMINIUM &amp; ARCHITECTURAL GLASS
          </p>
          <h1
            id="hero-heading"
            className="rise mt-6 text-[length:var(--text-display)] font-[680] leading-[0.98] text-midnight [font-stretch:112%]"
            style={{ animationDelay: "80ms" }}
          >
            Glass.
            <br />
            Aluminium.
            <br />
            Architecture.
            <br />
            Perfected.
          </h1>
          <p className="rise mt-7 max-w-[34rem] text-lg leading-relaxed text-muted" style={{ animationDelay: "160ms" }}>
            We transform residential and commercial spaces with expertly crafted aluminium installations and premium
            glass solutions, designed to elevate the beauty, functionality, and value of every project.
          </p>
          <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
            <Link href="/quote" className="btn btn-primary">
              Request a Free Quote
            </Link>
            <Link href="/#projects" className="btn btn-outline">
              Explore Our Projects
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-6">
          <div className="alu-frame">
            <div className="alu-inner grid h-[26rem] grid-cols-[1.3fr_1fr] gap-[6px] bg-[linear-gradient(180deg,#d9dde5,#aab1bf)] sm:h-[32rem] sm:grid-cols-[1.3fr_1fr_1fr] lg:h-[clamp(32rem,72vh,44rem)]">
              {panes.map((pane, i) => (
                <div
                  key={pane.asset.src}
                  className={`pane-open relative overflow-hidden bg-midnight ${i === 2 ? "hidden sm:block" : ""}`}
                  style={{ animationDelay: `${250 + i * 180}ms` }}
                >
                  <Image
                    src={pane.asset.src}
                    alt={pane.alt}
                    fill
                    priority={i < 2}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 55vw"
                    placeholder="blur"
                    blurDataURL={pane.asset.blur}
                    className="object-cover"
                    style={{ objectPosition: pane.pos }}
                  />
                </div>
              ))}
              <div className="glass-sheen" />
            </div>
          </div>

          {/* Frosted brand panel overlapping the window */}
          <div
            className="glass rise relative z-10 mx-3 -mt-14 rounded-[4px] p-5 sm:absolute sm:-bottom-10 sm:-left-8 sm:mx-0 sm:mt-0 sm:w-[21rem]"
            style={{ animationDelay: "900ms" }}
          >
            <p className="text-[1.05rem] font-[620] leading-snug text-midnight [font-stretch:112%]">
              {business.tagline}.
            </p>
            <p className="mt-1.5 text-sm text-muted">
              Talk to us about your doors, windows, glass or cladding project.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-[3px] bg-whatsapp px-3.5 text-sm font-semibold text-white transition hover:brightness-95"
              >
                <WhatsAppIcon className="size-4" /> Chat on WhatsApp
              </a>
              <a
                href={`tel:${business.phones[0].tel}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-[3px] border border-midnight/15 bg-white/70 px-3.5 text-sm font-semibold text-midnight transition hover:bg-white"
              >
                <Phone className="size-4" /> {business.phones[0].display}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
