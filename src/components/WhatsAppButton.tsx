import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

/** Floating click-to-chat button, kept clear of the mobile safe area. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Whaliyy Aluminium Concept on WhatsApp"
      className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_14px_30px_-10px_rgba(18,22,63,0.6)] ring-4 ring-white/70 transition-transform hover:scale-105 sm:right-6"
    >
      <WhatsAppIcon className="size-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-[3px] bg-midnight px-3 py-1.5 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
