import Link from "next/link";
import { services } from "@/content/services";
import { ServiceCard } from "./ServiceCard";
import { SectionHeading } from "./SectionHeading";

/** Editorial rhythm: two wide, six narrow, two wide. */
const layout = (i: number) => (i < 2 || i > 7 ? "wide" : "narrow");

export function ServicesSection() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[86rem] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-heading"
            title="Aluminium and glass, made for the space it lives in."
            intro="From a single shower screen to a building façade, every job is measured, fabricated and installed to fit."
          />
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((service, i) => {
            const size = layout(i);
            return (
              <div key={service.slug} className={size === "wide" ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-2"}>
                <ServiceCard service={service} size={size} />
              </div>
            );
          })}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-[4px] border border-midnight/10 bg-frost p-7 sm:flex-row sm:items-center sm:p-10">
          <p className="text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-[640] leading-tight text-midnight [font-stretch:115%]">
            Have a project in mind? Let&rsquo;s discuss it.
          </p>
          <Link href="/quote" className="btn btn-primary shrink-0">
            Get a Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
