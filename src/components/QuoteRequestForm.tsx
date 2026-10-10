"use client";

import axios from "axios";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Paperclip, Phone, X } from "lucide-react";
import { business } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import {
  FILE_RULES,
  budgetRanges,
  contactMethods,
  quoteSummary,
  serviceOptions,
  validateFiles,
  validateQuote,
  type QuoteErrors,
  type QuoteFields,
} from "@/lib/quote";
import { WhatsAppIcon } from "./icons/WhatsAppIcon";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; fields: QuoteFields }
  | { kind: "error"; code: string; message: string; fields: QuoteFields };

const empty: QuoteFields = {
  fullName: "",
  phone: "",
  email: "",
  service: "",
  location: "",
  description: "",
  dimensions: "",
  preferredContact: "WhatsApp",
  budget: "",
  consent: false,
};

export function QuoteRequestForm({ initialService = "", idPrefix = "quote" }: { initialService?: string; idPrefix?: string }) {
  const [fields, setFields] = useState<QuoteFields>({
    ...empty,
    service: serviceOptions.some((s) => s.value === initialService) ? initialService : "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const id = (name: string) => `${idPrefix}-${name}`;
  const set = <K extends keyof QuoteFields>(key: K, value: QuoteFields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)];
    const err = validateFiles(next);
    setErrors((e) => ({ ...e, files: err }));
    if (!err) setFiles(next);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validateQuote(fields);
    const fileErr = validateFiles(files);
    if (fileErr) found.files = fileErr;
    setErrors(found);
    if (Object.keys(found).length) {
      // Move focus to the first field that needs attention.
      const first = Object.keys(found)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      return;
    }

    const body = new FormData();
    Object.entries(fields).forEach(([k, v]) => body.append(k, k === "consent" ? (v ? "yes" : "") : String(v)));
    body.append("website", (formRef.current?.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "");
    files.forEach((f) => body.append("files", f));

    setStatus({ kind: "submitting" });
    try {
      await axios.post("/api/quote", body, { timeout: 45000 });
      setStatus({ kind: "success", fields });
      setFields({ ...empty });
      setFiles([]);
    } catch (err) {
      let code = "NETWORK";
      let message = "We couldn't reach the server. Check your connection and try again.";
      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data as { code?: string; message?: string; errors?: QuoteErrors };
        code = data?.code ?? "SERVER";
        if (code === "VALIDATION" && data.errors) {
          setErrors(data.errors);
          setStatus({ kind: "idle" });
          return;
        }
        message = data?.message ?? "Something went wrong while sending your request.";
      }
      setStatus({ kind: "error", code, message, fields });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "success") {
    const f = status.fields;
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[4px] border border-royal/20 bg-white p-7 sm:p-10">
        <CircleCheck className="size-9 text-royal" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-[650] text-midnight [font-stretch:115%]">Request sent. Thank you, {f.fullName.split(" ")[0]}.</h3>
        <p className="mt-3 max-w-lg text-muted">
          We&rsquo;ve received your quote request for <strong className="text-ink">{serviceOptions.find((s) => s.value === f.service)?.label}</strong>.
          We&rsquo;ll contact you by {f.preferredContact.toLowerCase()} on {f.preferredContact === "Email" ? f.email : f.phone} to
          discuss the details and next steps.
        </p>
        <p className="mt-3 max-w-lg text-muted">Want to send more photos or talk sooner? Message us on WhatsApp.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink(quoteSummary(f))} target="_blank" rel="noopener noreferrer" className="btn bg-whatsapp text-white hover:brightness-95">
            <WhatsAppIcon className="size-4" /> Continue on WhatsApp
          </a>
          <button type="button" className="btn btn-outline" onClick={() => setStatus({ kind: "idle" })}>
            Send another request
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof QuoteErrors) =>
    errors[k] ? (
      <p id={id(`${k}-error`)} className="mt-1.5 flex items-start gap-1.5 text-sm text-signal-700">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof QuoteErrors) => ({
    "aria-invalid": errors[k] ? (true as const) : undefined,
    "aria-describedby": errors[k] ? id(`${k}-error`) : undefined,
  });
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="relative grid gap-6" aria-describedby={id("required-note")}>
      <p id={id("required-note")} className="text-sm text-muted">
        Fields marked <span aria-hidden="true" className="text-signal-700">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {errorCount > 0 ? (
        <div role="alert" className="rounded-[3px] border border-signal-700/30 bg-signal/5 px-4 py-3 text-sm text-signal-700">
          Please check {errorCount === 1 ? "1 field" : `${errorCount} fields`} below.
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id("fullName")} className="field-label">
            Full name <Req />
          </label>
          <input id={id("fullName")} name="fullName" autoComplete="name" className="field" value={fields.fullName} onChange={(e) => set("fullName", e.target.value)} {...aria("fullName")} />
          {err("fullName")}
        </div>
        <div>
          <label htmlFor={id("phone")} className="field-label">
            Phone number <Req />
          </label>
          <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0813 405 4905" className="field" value={fields.phone} onChange={(e) => set("phone", e.target.value)} {...aria("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor={id("email")} className="field-label">
            Email address <Opt />
          </label>
          <input id={id("email")} name="email" type="email" autoComplete="email" className="field" value={fields.email} onChange={(e) => set("email", e.target.value)} {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor={id("service")} className="field-label">
            Service needed <Req />
          </label>
          <select id={id("service")} name="service" className="field" value={fields.service} onChange={(e) => set("service", e.target.value)} {...aria("service")}>
            <option value="">Choose a service</option>
            {serviceOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {err("service")}
        </div>
        <div>
          <label htmlFor={id("location")} className="field-label">
            Project location <Req />
          </label>
          <input id={id("location")} name="location" autoComplete="address-level2" placeholder="e.g. Idimu, Lagos" className="field" value={fields.location} onChange={(e) => set("location", e.target.value)} {...aria("location")} />
          {err("location")}
        </div>
        <div>
          <label htmlFor={id("dimensions")} className="field-label">
            Approximate dimensions <Opt />
          </label>
          <input id={id("dimensions")} name="dimensions" placeholder="e.g. 2 windows, 1.2m × 1.5m" className="field" value={fields.dimensions} onChange={(e) => set("dimensions", e.target.value)} {...aria("dimensions")} />
          {err("dimensions")}
        </div>
      </div>

      <div>
        <label htmlFor={id("description")} className="field-label">
          Project details <Req />
        </label>
        <textarea id={id("description")} name="description" rows={5} placeholder="What would you like done? Include the type of glass or frame colour if you know it." className="field resize-y" value={fields.description} onChange={(e) => set("description", e.target.value)} {...aria("description")} />
        {err("description")}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <fieldset>
          <legend className="field-label">
            Preferred contact method <Req />
          </legend>
          <div className="flex flex-wrap gap-2">
            {contactMethods.map((m) => (
              <label key={m} className="relative">
                <input type="radio" name="preferredContact" value={m} checked={fields.preferredContact === m} onChange={() => set("preferredContact", m)} className="peer sr-only" />
                <span className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-[#c9ceda] bg-white px-4 text-[0.95rem] transition-colors peer-checked:border-royal peer-checked:bg-royal peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal">
                  {m}
                </span>
              </label>
            ))}
          </div>
          {err("preferredContact")}
        </fieldset>
        <div>
          <label htmlFor={id("budget")} className="field-label">
            Budget range <Opt />
          </label>
          <select id={id("budget")} name="budget" className="field" value={fields.budget} onChange={(e) => set("budget", e.target.value)} {...aria("budget")}>
            <option value="">Prefer not to say</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {err("budget")}
        </div>
      </div>

      <div>
        <span className="field-label" id={id("files-label")}>
          Photos or drawings <Opt />
        </span>
        <div className="rounded-[3px] border border-dashed border-[#b9bfcc] bg-white/70 p-4">
          <label htmlFor={id("files")} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[3px] border border-midnight/15 bg-white px-4 text-[0.95rem] font-medium text-midnight hover:border-royal">
            <Paperclip className="size-4" aria-hidden="true" /> Attach files
          </label>
          <input
            ref={fileInputRef}
            id={id("files")}
            name="files"
            type="file"
            multiple
            accept={FILE_RULES.extensions.join(",")}
            className="sr-only"
            aria-describedby={`${id("files-hint")}${errors.files ? ` ${id("files-error")}` : ""}`}
            onChange={(e) => addFiles(e.target.files)}
          />
          <p id={id("files-hint")} className="mt-2 text-sm text-muted">
            Up to {FILE_RULES.maxFiles} files: JPG, PNG, WEBP, HEIC or PDF, 5 MB each.
          </p>
          {files.length > 0 ? (
            <ul className="mt-3 grid gap-2">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-[3px] bg-frost px-3 py-2 text-sm">
                  <span className="truncate">{f.name}</span>
                  <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="inline-flex size-8 shrink-0 items-center justify-center rounded hover:bg-silver" aria-label={`Remove ${f.name}`}>
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {err("files")}
      </div>

      {/* Honeypot for bots — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this empty</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-ink/85">
          <input type="checkbox" name="consent" checked={fields.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 size-5 shrink-0 accent-royal" {...aria("consent")} />
          <span>
            I agree that {business.name} may use the details I&rsquo;ve provided to respond to my enquiry. See our{" "}
            <Link href="/privacy" className="text-royal underline underline-offset-4">
              privacy notice
            </Link>
            . <Req />
          </span>
        </label>
        {err("consent")}
      </div>

      {status.kind === "error" ? (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-[4px] border border-signal-700/30 bg-white p-5">
          <p className="flex items-start gap-2 font-semibold text-signal-700">
            <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            {status.message}
          </p>
          <p className="mt-2 text-sm text-muted">
            Your request has <strong>not</strong> been sent. You can send the same details to us on WhatsApp instead — they&rsquo;ll be filled in for you — or call us.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a href={whatsappLink(quoteSummary(status.fields))} target="_blank" rel="noopener noreferrer" className="btn bg-whatsapp text-white hover:brightness-95">
              <WhatsAppIcon className="size-4" /> Send on WhatsApp
            </a>
            <a href={`tel:${business.phones[0].tel}`} className="btn btn-outline">
              <Phone className="size-4" /> Call {business.phones[0].display}
            </a>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary sm:min-w-56" disabled={status.kind === "submitting"}>
          {status.kind === "submitting" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending request…
            </>
          ) : (
            "Send quote request"
          )}
        </button>
        <a href={fields.description.trim() || fields.fullName.trim() ? whatsappLink(quoteSummary(fields)) : whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          <WhatsAppIcon className="size-4 text-whatsapp" /> Send via WhatsApp instead
        </a>
      </div>
    </form>
  );
}

const Req = () => (
  <span aria-hidden="true" className="text-signal-700">
    *
  </span>
);
const Opt = () => <span className="font-normal text-muted">(optional)</span>;
