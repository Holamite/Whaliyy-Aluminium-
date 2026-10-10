import Image from "next/image";
import Link from "next/link";
import { images } from "@/content/images";
import { business } from "@/content/site";
import { Reveal } from "./Reveal";

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[86rem] items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <Reveal className="lg:col-span-5">
          <figure className="alu-frame mx-auto max-w-md lg:max-w-none">
            <div className="alu-inner aspect-[4/5]">
              <Image
                src={images.img01.src}
                alt="Completed two-storey residence with tall dark-glass windows and a glass balcony front"
                fill
                sizes="(min-width: 1024px) 36vw, 90vw"
                placeholder="blur"
                blurDataURL={images.img01.blur}
                className="object-cover"
              />
            </div>
            <figcaption className="sr-only">A completed residence by {business.name}</figcaption>
          </figure>
        </Reveal>

        <div className="lg:col-span-7 lg:pl-4">
          <h2 id="about-heading" className="sash text-[length:var(--text-h2)] font-[640] text-midnight">
            Craftsmanship that redefines your space.
          </h2>
          <div className="mt-8 grid max-w-[40rem] gap-5 text-[1.075rem] leading-[1.7] text-ink/85">
            <p>
              At {business.name}, we believe that the right aluminium and glass finishes can transform the look and
              feel of any space. We specialise in aluminium fabrication and architectural glass solutions for
              residential, commercial, and office environments.
            </p>
            <p>
              From elegant doors and windows to modern curtain walls, shower cubicles, and glass partitions, our focus
              is on delivering carefully crafted solutions that combine style, functionality, and quality workmanship.
            </p>
            <p>Our goal is to help every client create a space that reflects their taste, purpose, and vision.</p>
          </div>
          <div className="mt-10 flex flex-col gap-6 border-t border-midnight/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[640] text-midnight [font-stretch:112%]">{business.ceo}</p>
              <p className="text-sm text-muted">Chief Executive Officer</p>
              <p className="text-sm text-muted">Business registration {business.registrationNumber}</p>
            </div>
            <Link href="/#projects" className="btn btn-outline self-start sm:self-auto">
              Discover Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
