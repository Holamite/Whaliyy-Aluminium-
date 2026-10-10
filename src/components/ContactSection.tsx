import { MapPin, Phone } from "lucide-react";
import { business, fullAddress, mapEmbed, mapLink } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[86rem] gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-5">
          <h2 id="contact-heading" className="sash text-[length:var(--text-h2)] font-[640] text-midnight">
            Get in touch.
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">
            Call, send a WhatsApp message or visit us. For a quotation, the form is the quickest way to give us
            everything we need.
          </p>

          <address className="mt-10 grid gap-7 not-italic">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-royal" aria-hidden="true" />
              <div>
                <p className="font-[640] text-midnight [font-stretch:110%]">{business.name}</p>
                <p className="mt-1 text-muted">{fullAddress}</p>
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold text-royal underline underline-offset-4">
                  Open in Google Maps
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-royal" aria-hidden="true" />
              <div className="grid gap-1">
                {business.phones.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="inline-flex min-h-10 items-center text-lg font-[620] text-midnight hover:text-royal [font-stretch:110%]">
                    {p.display}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <WhatsAppIcon className="mt-1 size-5 shrink-0 text-whatsapp" />
              <div>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-lg font-[620] text-midnight hover:text-royal [font-stretch:110%]">
                  Chat on WhatsApp
                </a>
                <p className="text-sm text-muted">{business.phones[1].display}</p>
              </div>
            </div>
          </address>

          <div className="alu-frame mt-10">
            <div className="alu-inner aspect-[4/3] bg-silver">
              <iframe
                title={`Map showing ${business.name}, ${fullAddress}`}
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="glass rounded-[6px] p-6 sm:p-10">
            <h3 className="text-2xl font-[650] text-midnight [font-stretch:115%]">Request a free quote</h3>
            <p className="mt-2 mb-8 text-muted">Tell us about your project and we&rsquo;ll get back to you.</p>
            <QuoteRequestForm idPrefix="contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
