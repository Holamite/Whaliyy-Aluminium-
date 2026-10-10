/**
 * Shared quote-request rules used by both the browser form and the API route,
 * so client and server validation never drift apart.
 */
import { services } from "@/content/services";

export const serviceOptions = [...services.map((s) => ({ value: s.slug, label: s.name })), { value: "other", label: "Other / not sure yet" }];

export const contactMethods = ["Phone call", "WhatsApp", "Email"] as const;

export const budgetRanges = [
  "Under ₦500,000",
  "₦500,000 – ₦2,000,000",
  "₦2,000,000 – ₦5,000,000",
  "₦5,000,000 – ₦10,000,000",
  "Above ₦10,000,000",
  "Not sure yet",
] as const;

export const FILE_RULES = {
  maxFiles: 3,
  maxBytesEach: 5 * 1024 * 1024,
  maxBytesTotal: 12 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"],
  extensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".pdf"],
} as const;

export type QuoteFields = {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  description: string;
  dimensions: string;
  preferredContact: string;
  budget: string;
  consent: boolean;
};

export type QuoteErrors = Partial<Record<keyof QuoteFields | "files", string>>;

const limits: Partial<Record<keyof QuoteFields, number>> = {
  fullName: 100,
  phone: 30,
  email: 200,
  location: 200,
  description: 3000,
  dimensions: 500,
};

export function validateQuote(f: QuoteFields): QuoteErrors {
  const e: QuoteErrors = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  const digits = f.phone.replace(/\D/g, "");
  if (!f.phone.trim()) e.phone = "Enter a phone number we can reach you on.";
  else if (!/^[+\d\s()-]+$/.test(f.phone) || digits.length < 10 || digits.length > 15)
    e.phone = "Enter a valid phone number, for example 0813 405 4905.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "Enter a valid email address, or leave this blank.";
  if (!serviceOptions.some((s) => s.value === f.service)) e.service = "Choose the service you need.";
  if (f.location.trim().length < 2) e.location = "Tell us where the project is, for example Idimu, Lagos.";
  if (f.description.trim().length < 10) e.description = "Describe your project in a sentence or two.";
  if (!contactMethods.includes(f.preferredContact as (typeof contactMethods)[number]))
    e.preferredContact = "Choose how you'd like us to contact you.";
  if (f.preferredContact === "Email" && !f.email.trim()) e.email = "Add your email so we can reply by email.";
  if (f.budget && !budgetRanges.includes(f.budget as (typeof budgetRanges)[number])) e.budget = "Choose a budget range.";
  if (!f.consent) e.consent = "Please agree so we can use your details to respond.";
  for (const [key, max] of Object.entries(limits)) {
    const v = f[key as keyof QuoteFields];
    if (typeof v === "string" && v.length > max!) e[key as keyof QuoteFields] = `Keep this under ${max} characters.`;
  }
  return e;
}

export function validateFiles(files: { name: string; size: number; type: string }[]): string | undefined {
  if (files.length > FILE_RULES.maxFiles) return `Attach up to ${FILE_RULES.maxFiles} files.`;
  let total = 0;
  for (const file of files) {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const typeOk = (FILE_RULES.types as readonly string[]).includes(file.type) || (!file.type && (FILE_RULES.extensions as readonly string[]).includes(ext));
    if (!typeOk || !(FILE_RULES.extensions as readonly string[]).includes(ext))
      return `"${file.name}" isn't supported. Use JPG, PNG, WEBP, HEIC or PDF.`;
    if (file.size > FILE_RULES.maxBytesEach) return `"${file.name}" is larger than 5 MB.`;
    total += file.size;
  }
  if (total > FILE_RULES.maxBytesTotal) return "Attachments must be 12 MB or less in total.";
  return undefined;
}

export function serviceLabel(value: string) {
  return serviceOptions.find((s) => s.value === value)?.label ?? value;
}

/** Plain-text summary used for the WhatsApp fallback message. */
export function quoteSummary(f: QuoteFields): string {
  return [
    "Hello Whaliyy Aluminium Concept, I'd like a quote.",
    `Name: ${f.fullName}`,
    `Phone: ${f.phone}`,
    f.email && `Email: ${f.email}`,
    `Service: ${serviceLabel(f.service)}`,
    `Location: ${f.location}`,
    f.dimensions && `Dimensions: ${f.dimensions}`,
    f.budget && `Budget: ${f.budget}`,
    `Preferred contact: ${f.preferredContact}`,
    `Project: ${f.description}`,
  ]
    .filter(Boolean)
    .join("\n");
}
