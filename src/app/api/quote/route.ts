import nodemailer from "nodemailer";
import { NextResponse, type NextRequest } from "next/server";
import { business } from "@/content/site";
import { quoteSummary, serviceLabel, validateFiles, validateQuote, type QuoteFields } from "@/lib/quote";

export const runtime = "nodejs";

/**
 * Quote requests are emailed to the business over SMTP.
 * Configure in .env.local (never commit real values):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_TO_EMAIL, [QUOTE_FROM_EMAIL], [SMTP_SECURE]
 * Submissions are not stored on the server and attachments are only forwarded by email.
 */

// Basic in-memory rate limit: 5 requests per 10 minutes per IP (per server instance).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  // Sweep every IP, not just this one — otherwise an entry for an IP that
  // never comes back sits in the map forever and the process slowly leaks
  // memory until it's killed for exceeding its limit.
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) hits.delete(key);
    else hits.set(key, recent);
  }
  const recent = hits.get(ip) ?? [];
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !QUOTE_TO_EMAIL) return null;
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : Number(SMTP_PORT) === 465,
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    to: QUOTE_TO_EMAIL,
    from: process.env.QUOTE_FROM_EMAIL || SMTP_USER || QUOTE_TO_EMAIL,
  };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED", message: "Too many requests. Please wait a few minutes or contact us on WhatsApp." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, code: "BAD_REQUEST", message: "The form data could not be read." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (String(form.get("website") ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string) => String(form.get(k) ?? "").trim();
  const fields: QuoteFields = {
    fullName: str("fullName"),
    phone: str("phone"),
    email: str("email"),
    service: str("service"),
    location: str("location"),
    description: str("description"),
    dimensions: str("dimensions"),
    preferredContact: str("preferredContact"),
    budget: str("budget"),
    consent: form.get("consent") === "yes",
  };

  const files = form.getAll("files").filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f && f.size > 0);
  const errors = validateQuote(fields);
  const fileError = validateFiles(files);
  if (fileError) errors.files = fileError;
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, code: "VALIDATION", errors }, { status: 422 });
  }

  const smtp = smtpConfig();
  if (!smtp) {
    return NextResponse.json(
      { ok: false, code: "NOT_CONFIGURED", message: "Online quote requests aren't switched on yet." },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Name", fields.fullName],
    ["Phone", fields.phone],
    ["Email", fields.email || "—"],
    ["Service", serviceLabel(fields.service)],
    ["Project location", fields.location],
    ["Approx. dimensions", fields.dimensions || "—"],
    ["Budget range", fields.budget || "—"],
    ["Preferred contact", fields.preferredContact],
  ];

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.auth,
    });
    await transporter.sendMail({
      from: `"${business.name} website" <${smtp.from}>`,
      to: smtp.to,
      replyTo: fields.email || undefined,
      subject: `Quote request: ${serviceLabel(fields.service)} — ${fields.fullName}`,
      text: quoteSummary(fields),
      html: `<h2>New quote request</h2><table cellpadding="6">${rows
        .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
        .join("")}</table><h3>Project details</h3><p style="white-space:pre-wrap">${escapeHtml(fields.description)}</p>`,
      attachments: await Promise.all(
        files.map(async (f) => ({ filename: f.name.replace(/[^\w.\- ]/g, "_"), content: Buffer.from(await f.arrayBuffer()), contentType: f.type || undefined })),
      ),
    });
  } catch (err) {
    console.error("[quote] email failed", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, code: "SEND_FAILED", message: "Your request couldn't be sent right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
