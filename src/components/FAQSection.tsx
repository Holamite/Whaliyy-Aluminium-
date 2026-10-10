import { Plus } from "lucide-react";
import { faqs } from "@/content/copy";
import { SectionHeading } from "./SectionHeading";

export function FAQSection() {
  return (
    <section aria-labelledby="faq-heading" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[86rem] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <SectionHeading
            id="faq-heading"
            title="Questions, answered."
            intro="If yours isn't here, call or message us — we're happy to talk it through."
            className="lg:sticky lg:top-28"
          />
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-midnight/10 border-y border-midnight/10">
            {faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[1.1rem] font-[620] text-midnight [font-stretch:110%] marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-midnight/15 text-royal transition-transform duration-300 group-open:rotate-45 group-open:border-royal">
                    <Plus className="size-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pr-12 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
