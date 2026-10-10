"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";
import { business, navigation } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";

export function MobileNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep keyboard focus inside the open menu.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      className="fixed inset-0 z-[70] xl:hidden"
    >
      <div className="absolute inset-0 bg-frost/85 backdrop-blur-2xl" onClick={onClose} aria-hidden="true" />
      <div className="fade-scale relative flex h-full flex-col px-4 pb-8 sm:px-6">
        <div className="flex h-[4.75rem] items-center justify-between">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded border border-midnight/15 bg-white text-midnight"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-6 flex-1">
          <ul className="divide-y divide-midnight/10 border-y border-midnight/10">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 text-2xl font-[620] text-midnight [font-stretch:115%]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-3">
          <Link href="/quote" onClick={onClose} className="btn btn-primary w-full">
            Request a Free Quote
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${business.phones[0].tel}`} className="btn btn-outline w-full">
              <Phone className="size-4" /> Call
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
