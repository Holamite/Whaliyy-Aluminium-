import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { business, fullAddress } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { processSteps } from "@/content/copy";

export const metadata: Metadata = {
  title: "Request a Free Quote — Aluminium & Glass Works in Lagos",
  description:
    "Request a free quote for aluminium doors and windows, frameless glass, shower cubicles, curtain walls, office partitions and more in Lagos. Send photos or drawings with your enquiry.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
  const { service } = await searchParams;
  const initialService = typeof service === "string" ? service : "";

  return (
    <div className="relative pb-10 pt-28 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] [background-image:linear-gradient(to_right,rgba(48,53,143,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(48,53,143,0.06)_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative mx-auto grid max-w-[86rem] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-10 lg:px-10 lg:items-start">
        <div className="lg:col-span-4">
          <h1 className="sash text-[clamp(2.4rem,1.6rem+3vw,4rem)] font-[660] text-midnight">Request a free quote.</h1>
          <p className="mt-5 text-lg text-muted">
            Tell us what you need and where. The more detail you share — measurements, photos or drawings — the more
            useful our first conversation will be.
          </p>
        </div>
        <div className="lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
          <div className="glass rounded-[6px] p-6 sm:p-10">
            <QuoteRequestForm initialService={initialService} idPrefix="quote" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <ol className="grid gap-5 border-t border-midnight/10 pt-8">
            {processSteps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="text-sm font-semibold tabular-nums text-royal">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-[640] text-midnight [font-stretch:110%]">{s.title}</p>
                  <p className="text-sm text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid gap-3 border-t border-midnight/10 pt-8">
            <p className="text-sm text-muted">Prefer to talk?</p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline justify-start">
              <WhatsAppIcon className="size-4 text-whatsapp" /> Chat on WhatsApp
            </a>
            {business.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="btn btn-outline justify-start">
                <Phone className="size-4" /> {p.display}
              </a>
            ))}
            <p className="mt-2 text-sm text-muted">{fullAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
