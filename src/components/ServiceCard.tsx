"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/services";
import { serviceWhatsAppLink } from "@/lib/whatsapp";
import { requestGalleryFilter } from "@/lib/galleryFilter";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

export function ServiceCard({ service, size }: { service: Service; size: "wide" | "narrow" }) {
  const aspect = size === "wide" ? "aspect-[16/11]" : "aspect-[4/5]";

  const actions = (dark: boolean) => (
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.92rem] font-semibold">
      <Link
        href={`/quote?service=${service.slug}`}
        className={`inline-flex min-h-10 items-center gap-1.5 underline decoration-1 underline-offset-[6px] transition-colors ${
          dark ? "text-white decoration-white/40 hover:decoration-white" : "text-royal decoration-royal/30 hover:decoration-royal"
        }`}
      >
        Request a quote <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
      {service.galleryFilter ? (
        <a
          href="#projects"
          onClick={() => requestGalleryFilter(service.galleryFilter!)}
          className={`inline-flex min-h-10 items-center ${dark ? "text-white/80 hover:text-white" : "text-muted hover:text-midnight"}`}
        >
          See projects
        </a>
      ) : null}
      <a
        href={serviceWhatsAppLink(service.name)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ask about ${service.name} on WhatsApp`}
        className={`ml-auto inline-flex size-10 items-center justify-center rounded-full border transition-colors ${
          dark
            ? "border-white/25 text-white hover:border-white"
            : "border-midnight/15 text-whatsapp hover:border-whatsapp"
        }`}
      >
        <WhatsAppIcon className="size-[1.1rem]" />
      </a>
    </div>
  );

  if (!service.image) {
    // No project photo supplied yet: typographic card, no stand-in imagery.
    return (
      <article className="relative flex h-full flex-col justify-end overflow-hidden rounded-[4px] bg-royal p-7 text-white sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div className="relative">
          <h3 className="text-[1.6rem] font-[650] [font-stretch:118%]">{service.name}</h3>
          <p className="mt-3 max-w-md text-white/80">{service.summary}</p>
          {actions(true)}
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[4px] bg-silver ring-1 ring-midnight/10 ${aspect}`}>
        <Image
          src={service.image.src}
          alt={service.imageAlt ?? service.name}
          fill
          sizes={size === "wide" ? "(min-width: 1024px) 45vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
          placeholder="blur"
          blurDataURL={service.image.blur}
          className="object-cover transition-transform duration-700 ease-[var(--ease-glide)] group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/30" />
        <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-signal transition-transform duration-500 group-hover:scale-y-100" />
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <h3 className="text-[length:var(--text-h3)] font-[640] text-midnight [font-stretch:115%]">{service.name}</h3>
        <p className="mt-2 max-w-md text-[0.98rem] leading-relaxed text-muted">{service.summary}</p>
        <div className="mt-auto">{actions(false)}</div>
      </div>
    </article>
  );
}
