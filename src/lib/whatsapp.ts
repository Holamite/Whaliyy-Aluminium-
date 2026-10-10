import { business } from "@/content/site";

export const defaultWhatsAppMessage =
  "Hello Whaliyy Aluminium Concept, I would like to make an enquiry about your aluminium and glass services. Please let me know how I can get a quotation.";

/** Builds a click-to-chat link: https://wa.me/<number>?text=<encoded message> */
export function whatsappLink(message: string = defaultWhatsAppMessage): string {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Prefilled message that names the service the visitor is interested in. */
export function serviceWhatsAppLink(serviceName: string): string {
  return whatsappLink(
    `Hello Whaliyy Aluminium Concept, I'm interested in ${serviceName}. Please let me know how I can get a quotation.`,
  );
}

/** Prefilled message for a specific project photo in the gallery. */
export function projectWhatsAppLink(projectTitle: string): string {
  return whatsappLink(
    `Hello Whaliyy Aluminium Concept, I saw the "${projectTitle}" project on your website and I'd like something similar. Can we discuss it?`,
  );
}
