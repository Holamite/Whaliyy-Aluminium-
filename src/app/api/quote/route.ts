import nodemailer from "nodemailer";
import { NextResponse, type NextRequest } from "next/server";
import { business } from "@/content/site";
import { FILE_RULES, quoteSummary, serviceLabel, validateFiles, validateQuote, type QuoteFields } from "@/lib/quote";

// Generous allowance on top of the file-size cap for the text fields and
// multipart boundaries/headers that come with them.
const MAX_BODY_BYTES = FILE_RULES.maxBytesTotal + 64 * 1024;

export const runtime = "nodejs";

/**
 * Quote requests are emailed to the business over SMTP.
 * Configure in .env.local (never commit real values):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_TO_EMAIL, [QUOTE_FROM_EMAIL], [SMTP_SECURE]
 * Submissions are not stored on the server and attachments are only forwarded by email.
 */

// Basic in-memory rate limit: 5 requests per 10 minutes per IP (per server
// instance). A fixed-window counter — not a growing timestamp array — so a
// single IP hammering the endpoint holds one small object, not an
// ever-growing array, and a full map sweep only runs once a minute instead
// of on every request.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const SWEEP_INTERVAL_MS = 60 * 1000;
const MAX_TRACKED_IPS = 5000;

type Bucket = { count: number; windowStart: number };
const hits = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweepExpired(now: number) {
  for (const [key, bucket] of hits) {
    if (now - bucket.windowStart >= WINDOW_MS) hits.delete(key);
  }
  lastSweep = now;
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (now - lastSweep >= SWEEP_INTERVAL_MS) sweepExpired(now);

  const bucket = hits.get(ip);
  const expired = !bucket || now - bucket.windowStart >= WINDOW_MS;

  if (expired) {
    // Hard cap on distinct IPs tracked at once, so a flood of unique IPs
    // can't grow the map faster than the periodic sweep clears it. Evicts
    // the oldest-inserted entry, which Map iteration order gives us for free.
    if (!bucket && hits.size >= MAX_TRACKED_IPS) {
      const oldestKey = hits.keys().next().value;
      if (oldestKey !== undefined) hits.delete(oldestKey);
    }
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }

  // Already at the cap for this window — reject without growing the bucket
  // further, so a sustained flood from one IP can't inflate its own entry.
  if (bucket.count >= MAX_REQUESTS) return true;

  bucket.count += 1;
  return false;
}

// Caps how many requests can be buffering attachments into memory at once,
// so a burst of large, concurrent submissions can't multiply peak memory
// usage (each one holds up to ~12MB of attachment data, and more while
// nodemailer re-encodes it). Start conservative on a small instance; raise
// this only after measuring actual memory headroom under real traffic.
const MAX_CONCURRENT_SUBMISSIONS = 2;
let inFlightSubmissions = 0;

/**
 * Content-Length is only a declared value — a client can omit it or send a
 * chunked body with no length at all, bypassing a header-only check. This
 * enforces the cap on the real byte stream as it arrives, so the request is
 * aborted before formData() can buffer an oversized body into memory.
 *
 * formData() may wrap or replace the stream error it catches internally, so
 * the caller can't reliably tell "oversized" apart from "malformed" by
 * inspecting whatever error comes out the other end. Instead, `onExceeded`
 * fires at the exact moment the limit is crossed, giving the caller a
 * side-channel signal that doesn't depend on error identity surviving the
 * trip through formData()'s parser.
 */
function capBodySize(body: ReadableStream<Uint8Array>, maxBytes: number, onExceeded: () => void): ReadableStream<Uint8Array> {
  let total = 0;
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        total += chunk.byteLength;
        if (total > maxBytes) {
          onExceeded();
          controller.error(new Error("PAYLOAD_TOO_LARGE"));
          return;
        }
        controller.enqueue(chunk);
      },
    }),
  );
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

/**
 * Render routes public traffic through Cloudflare in front of its own edge,
 * so a request here has already passed through two hops, not one.
 * cf-connecting-ip is the value Cloudflare's edge itself observed the
 * connection from and overwrites on every request regardless of what the
 * client sent — Render's own docs point to it as the trustworthy source:
 * https://community.render.com/t/accessing-client-ips-in-a-node-express-app/36282
 * x-forwarded-for is kept only as a fallback (its rightmost entry, since a
 * client can still prepend fake values before any hop it doesn't control).
 * Either way this is an anti-abuse heuristic, not a security boundary: it's
 * per-instance, in-memory, and resets on restart.
 */
function clientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;
  const chain = req.headers.get("x-forwarded-for");
  if (!chain) return "unknown";
  const parts = chain.split(",").map((p) => p.trim()).filter(Boolean);
  return parts[parts.length - 1] || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, code: "RATE_LIMITED", message: "Too many requests. Please wait a few minutes or contact us on WhatsApp." },
      { status: 429 },
    );
  }

  // Fast rejection when the header is present and honest — avoids opening
  // the body stream at all for the common case.
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, code: "PAYLOAD_TOO_LARGE", message: "Attachments must be 12 MB or less in total." },
      { status: 413 },
    );
  }

  if (inFlightSubmissions >= MAX_CONCURRENT_SUBMISSIONS) {
    return NextResponse.json(
      { ok: false, code: "SERVER_BUSY", message: "We're handling a lot of requests right now — please try again shortly." },
      { status: 503 },
    );
  }
  inFlightSubmissions += 1;

  try {
    let form: FormData;
    let bodyTooLarge = false;
    try {
      const body = req.body ? capBodySize(req.body, MAX_BODY_BYTES, () => (bodyTooLarge = true)) : null;
      const boundedReq = body ? new Request(req.url, { method: "POST", headers: req.headers, body, duplex: "half" } as RequestInit) : req;
      form = await boundedReq.formData();
    } catch {
      if (bodyTooLarge) {
        return NextResponse.json(
          { ok: false, code: "PAYLOAD_TOO_LARGE", message: "Attachments must be 12 MB or less in total." },
          { status: 413 },
        );
      }
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
  } finally {
    inFlightSubmissions -= 1;
  }
}
