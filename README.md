# Whaliyy Aluminium Concept — website

Next.js (App Router) + TypeScript + Tailwind CSS site for Whaliyy Aluminium Concept, Idimu, Lagos.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint                 # ESLint
npx tsc --noEmit             # type-check
```

Requires Node.js 20.9 or newer.

## Where to edit things

| What | File |
|---|---|
| Business name, phones, address, WhatsApp number, social links | `src/content/site.ts` |
| Services (names, descriptions, photos) | `src/content/services.ts` |
| Portfolio projects (titles, categories, photos, descriptions, details) | `src/content/projects.ts` |
| Highlights, "Why choose us", process steps, FAQs | `src/content/copy.ts` |
| Testimonials | `src/content/testimonials.ts` |
| Photo files | `public/images/projects/<category>/` |
| Original WhatsApp filename → site file | `docs/IMAGE-MAP.md` |

### Adding a project photo
1. Resize to about 1800px on the long edge and save as JPG in the right folder under `public/images/projects/`.
2. Add an entry to `src/content/images.ts` (src, width, height; `blur` can be any tiny base64 JPEG or reuse an existing one).
3. Add or extend a project in `src/content/projects.ts`. Give every photo a real description in `alt`.

### Adding a testimonial
Only add feedback the client has approved for publication. Add `rating` only if they actually gave one.
While the list is empty, `npm run dev` shows labelled placeholders; production shows a "share your feedback" panel instead — placeholders never reach the live site.

## Quote form
- Browser → `POST /api/quote` (Axios, multipart). The server re-validates everything, blocks bots with a honeypot, rate-limits per IP, checks attachment type/size (JPG/PNG/WEBP/HEIC/PDF, 5 MB each, 3 max), then emails the request (with attachments) via SMTP.
- Nothing is stored on the server.
- If SMTP isn't configured the API returns 503 and the form says the request was **not** sent, offering a WhatsApp message prefilled with the visitor's details.
- For Gmail, create an App Password (Google Account → Security → 2-Step Verification → App passwords) and use it as `SMTP_PASS`.
- The in-memory rate limit is per server instance; on serverless hosting consider a shared store (e.g. Upstash) if spam becomes a problem.

## Before launch
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy (canonical, sitemap, OG and JSON-LD use it).
- [ ] Configure SMTP and send a real test quote.
- [ ] Confirm 09158562764 is the WhatsApp line (set in `src/content/site.ts`).
- [ ] Open the map and confirm the pin lands on 198 Ikotun–Idimu Road; adjust `mapQuery` in `site.ts` if not.
- [ ] Review every project title/category/description in `src/content/projects.ts` (see notes below).
- [ ] Add approved testimonials, and social media links if any.
- [ ] Ask the business whether they still offer fence wiring and want it listed.

### Photo notes for the business to confirm
- `curtain-walls/faceted-glass-facade-01.jpg` is a small (720px) image that looks like a professional architectural photo. Confirm it is Whaliyy's own project; if not, remove it (the Curtain Walls filter and service card currently rely on it).
- Project titles describe only what is visible in each photo. Add real details (location, scope, glass type) via the `details` field once confirmed.
