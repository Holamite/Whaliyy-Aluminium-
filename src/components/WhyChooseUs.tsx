import Image from "next/image";
import { images } from "@/content/images";
import { reasons } from "@/content/copy";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-heading" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[86rem] gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-7 lg:order-2">
          <SectionHeading
            id="why-heading"
            title="Why clients work with us."
            intro="Good glass and aluminium work is judged up close. Here is what we put into every job."
          />
          <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {reasons.map((r) => (
              <li key={r.title} className="border-t border-midnight/15 pt-5">
                <h3 className="text-[1.1rem] font-[640] text-midnight [font-stretch:112%]">{r.title}</h3>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <Reveal className="lg:col-span-5 lg:order-1">
          <div className="alu-frame lg:sticky lg:top-28">
            <div className="alu-inner aspect-[4/5]">
              <Image
                src={images.img23.src}
                alt="Frosted glass shower enclosure with gold hinges in a white marble bathroom"
                fill
                sizes="(min-width: 1024px) 36vw, 92vw"
                placeholder="blur"
                blurDataURL={images.img23.blur}
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
