import Link from "next/link";
import { business, fullAddress, navigation } from "@/content/site";
import { services } from "@/content/services";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  return (
    <footer className="relative mt-20 bg-midnight text-white sm:mt-28">
      <div aria-hidden="true" className="h-[3px] w-full bg-[linear-gradient(90deg,var(--color-signal)_0_18%,var(--color-royal)_18%_100%)]" />
      <div className="mx-auto grid max-w-[86rem] gap-12 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-white/70">{business.description}</p>
          <p className="mt-4 text-sm italic text-white/60">We {business.tagline.toLowerCase()}.</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white/60">Explore</h2>
          <ul className="mt-4 grid gap-2">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-white/85 hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="text-white/85 hover:text-white">
                Request a Quote
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-white/60">Services</h2>
          <ul className="mt-4 grid gap-2">
            {services.slice(0, 7).map((s) => (
              <li key={s.slug}>
                <Link href={`/quote?service=${s.slug}`} className="text-white/85 hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#services" className="text-white/85 hover:text-white">
                All services
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-white/60">Contact</h2>
          <address className="mt-4 grid gap-3 not-italic text-white/85">
            <p>{fullAddress}</p>
            {business.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="hover:text-white">
                {p.display}
              </a>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp: {business.phones[1].display}
            </a>
          </address>
          {business.social.length ? (
            <ul className="mt-4 flex gap-4">
              {business.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[86rem] flex-col gap-3 px-4 py-6 pb-24 text-sm text-white/55 sm:flex-row sm:justify-between sm:px-6 sm:pb-6 lg:px-10">
          <p>
            &copy; <CurrentYear /> {business.name}. Business registration {business.registrationNumber}.
          </p>
          <Link href="/privacy" className="hover:text-white">
            Privacy notice
          </Link>
        </div>
      </div>
    </footer>
  );
}
