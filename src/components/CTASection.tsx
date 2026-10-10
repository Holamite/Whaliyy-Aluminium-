import Image from "next/image";
import Link from "next/link";
import { images } from "@/content/images";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

export function CTASection() {
  return (
    <section aria-labelledby="cta-heading" className="px-4 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-[86rem] overflow-hidden rounded-[6px] bg-midnight">
        <Image
          src={images.img13.src}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={images.img13.blur}
          className="object-cover object-[50%_60%] opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/85 to-royal/40" />
        <div className="relative grid gap-10 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-12 lg:px-16 lg:py-24">
          <div className="lg:col-span-7">
            <h2 id="cta-heading" className="text-[length:var(--text-h2)] font-[660] text-white">
              Let&rsquo;s create something exceptional.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Whether you are upgrading your home, designing an office, or developing a commercial property, we are
              ready to discuss your aluminium and glass requirements.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="btn btn-light">
                Request a Free Quote
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                <WhatsAppIcon className="size-4" /> Chat With Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
