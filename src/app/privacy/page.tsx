import type { Metadata } from "next";
import { business, fullAddress } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: `How ${business.name} uses the information you send through this website.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-32 sm:px-6 sm:pt-40">
      <h1 className="sash text-[clamp(2.2rem,1.6rem+2.4vw,3.5rem)] font-[660] text-midnight">Privacy notice</h1>
      <div className="mt-10 grid gap-8 leading-relaxed text-ink/85 [&_h2]:text-xl [&_h2]:font-[640] [&_h2]:text-midnight [&_h2]:[font-stretch:112%]">
        <section className="grid gap-3">
          <h2>What we collect</h2>
          <p>
            When you send a quote request, we receive the details you enter: your name, phone number, email address
            (if given), the service you need, your project location and description, approximate dimensions, budget range
            (if given), your preferred contact method and any photos or drawings you attach.
          </p>
        </section>
        <section className="grid gap-3">
          <h2>How we use it</h2>
          <p>
            We use these details only to respond to your enquiry, prepare a quotation and discuss your project with you.
            We do not sell your information or use it for unrelated marketing.
          </p>
        </section>
        <section className="grid gap-3">
          <h2>How it is handled</h2>
          <p>
            Form submissions are sent by email to {business.name}. The website itself does not keep a database of
            submissions or publish them anywhere. If you contact us on WhatsApp, your messages are handled through
            WhatsApp under its own terms.
          </p>
          <p>This website does not use advertising or analytics tracking scripts.</p>
        </section>
        <section className="grid gap-3">
          <h2>Your choices</h2>
          <p>
            You can ask us to correct or delete the details you sent by calling{" "}
            {business.phones.map((p, i) => (
              <span key={p.tel}>
                {i > 0 ? " or " : ""}
                <a className="text-royal underline underline-offset-4" href={`tel:${p.tel}`}>
                  {p.display}
                </a>
              </span>
            ))}
            , or by visiting us at {fullAddress}.
          </p>
        </section>
      </div>
    </div>
  );
}
