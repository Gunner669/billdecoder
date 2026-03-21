# BillDecoder.au

Australian electricity bill analysis tool. Users upload a bill (PDF or image), Claude AI extracts tariff details and usage data, then returns a plain-English verdict with savings recommendations and retailer suggestions.

## Tech stack

- **Frontend:** Next.js 14 (App Router), React 18, inline CSS, Lucide React icons
- **Backend:** Next.js API routes calling Claude Sonnet 4 via Anthropic SDK
- **Storage:** Vercel KV (Redis) for anonymised bill data and email notification signups
- **Hosting:** Vercel
- **AI model:** `claude-sonnet-4-20250514` with vision (reads PDFs and images directly)
- **SEO:** JSON-LD structured data (FAQPage, WebApplication, WebSite, Organization), Open Graph, Twitter cards

## Project structure

```
app/
  layout.js                  # Root layout, comprehensive SEO metadata, JSON-LD (WebSite + Organization)
  page.js                    # Server Component — landing sections (How It Works, Benefits, FAQ, Footer) + imports BillApp
  BillApp.js                 # Client Component — interactive bill upload, processing animation, results display
  icon.svg                   # SVG favicon (lightning bolt)
  index/page.js              # BillDecoder Index — aggregate dashboard (Server Component, ISR 5min)
  privacy/page.js            # Privacy Policy page (Server Component)
  contact/page.js            # Contact page (Server Component wrapper)
  contact/ContactForm.js     # Contact form (Client Component)
  about/page.js              # About page (Server Component)
  not-found.js               # Custom 404 page
  loading.js                 # Loading skeleton for main page
  index/loading.js           # Loading skeleton for Index page
  api/analyze/route.js       # POST: sends bill to Claude, returns structured JSON (22+ fields)
  api/contribute/route.js    # POST: stores anonymised bill data to Vercel KV
  api/notify-signup/route.js     # POST: stores email + bill context for rate alert notifications
  api/notify-send/route.js       # GET: cron-triggered, evaluates subscribers and sends emails via Resend
  api/notify-unsubscribe/route.js # GET: HMAC-verified unsubscribe handler (Spam Act compliance)
  api/deal-update/route.js       # POST: admin endpoint to update per-state best deal prices
  api/contact/route.js           # POST: stores contact form messages to Vercel KV
  api/index-stats/route.js       # GET: aggregates KV data for the Index
public/
  robots.txt                     # Allows all crawlers, points to sitemap
  sitemap.xml                    # Lists / and /index
vercel.json                      # Cron job: triggers /api/notify-send weekly (Monday 8am AEST)
package.json                     # 7 deps: next, react, react-dom, @anthropic-ai/sdk, @vercel/kv, resend, lucide-react
```

## Architecture

- `page.js` is a **Server Component** that renders SEO-rich landing content and passes it to `BillApp.js` via the `landingContent` prop (Next.js composition pattern)
- `BillApp.js` is a **Client Component** (`"use client"`) containing all interactive state (upload, processing, results phases)
- Landing content only renders during the upload phase; processing and results phases show only the app UI
- `index/page.js` is a **Server Component** that reads directly from Vercel KV with ISR (revalidates every 5 minutes)

## How it works

1. User uploads a bill (PDF, PNG, JPEG, WebP; max 12MB)
2. Frontend base64-encodes the file, POSTs to `/api/analyze`
3. API sends the document to Claude with a structured prompt requesting 22+ JSON fields (tariff type, usage rates, verdict, savings actions, recommended retailers, postcode comparison, etc.)
4. Frontend shows a timed 6-step progress animation while waiting
5. Results display: verdict card (overcharged/fair/competitive), decoded bill data, postcode comparison bar chart, usage profile, solar info if applicable, actionable savings steps, and 2-3 recommended retailers
6. User can opt in to contribute anonymised data to the BillDecoder Index and/or sign up for email rate alerts

## Key data

- **Retailers database:** 10 hardcoded retailers in `BillApp.js` (amber, energy_locals, tango, powershop, red, ovo, momentum, alinta, engie, lumo) with URLs, badges, and pitches
- **State insights:** Hardcoded average overpayment stats per state shown during processing as "early insight"
- **Verdict logic:** overcharged = >10% above best market offer or on standing offer; fair = within 10% but $100-300 savings available; competitive = <$100 savings from switching
- **Postcode comparison:** Claude estimates user's annual cost vs state DMO average vs best available deal for their distribution network area

## Vercel KV data

- `bill_submissions` — Redis list of anonymised bill records (state, retailer, tariff, rates, verdict, costs). Written by `/api/contribute`, read by `/api/index-stats` and `/index` page
- `notify:<email>` — individual notification subscription records (email, state, annual cost, tariff type, verdict, subscribedAt). Gets `notifiedAt` added after email sent, or `unsubscribed: true` on unsubscribe. Keyed by email to prevent duplicates
- `notify_emails` — Redis set of all subscribed email addresses for batch iteration
- `deal_updates:<state>` — current best deal per state (bestDealAnnualCost, note, updatedAt). Written by admin via `/api/deal-update`, read by `/api/notify-send` to evaluate thresholds
- `contact_messages` — Redis list of contact form submissions (name, email, message, submittedAt)

## Environment variables

- `ANTHROPIC_API_KEY` — required, set in Vercel dashboard
- `RESEND_API_KEY` — required for email sending, from Resend dashboard
- `CRON_SECRET` — auto-set by Vercel for cron auth, also used for HMAC unsubscribe tokens
- `ADMIN_SECRET` — for the `/api/deal-update` admin endpoint
- `KV_REST_API_URL` — auto-injected by Vercel KV
- `KV_REST_API_TOKEN` — auto-injected by Vercel KV

## Commands

```bash
npm run dev    # Local dev server on localhost:3000
npm run build  # Production build
npm start      # Start production server
```

## SEO

- Comprehensive metadata in `layout.js`: Open Graph, Twitter cards, canonical URLs, Australian-focused keywords
- JSON-LD structured data: FAQPage schema (8 questions), WebApplication, WebSite, Organization
- SVG favicon at `app/icon.svg`
- `robots.txt` and `sitemap.xml` in `public/`
- Index page has its own Open Graph metadata and canonical URL

## Email notification system

- **Cron schedule:** Vercel cron triggers `GET /api/notify-send` weekly (Monday 8am AEST / Sunday 10pm UTC)
- **Threshold logic:** Sends if current best deal saves >= $150/yr vs user's cost AND >= $100/yr better than what they saw at signup
- **Fallback:** If no deal data exists for a state, "overcharged" users get notified after 30 days with a generic prompt to re-check
- **One-time send:** Each subscriber is emailed at most once (`notifiedAt` flag prevents re-sends)
- **Unsubscribe:** HMAC-verified link in every email, removes from set and flags record
- **Admin deal updates:** `POST /api/deal-update` with `Authorization: Bearer <ADMIN_SECRET>` to set per-state best deal prices
- **Email service:** Resend (requires domain DNS verification for `billdecoder.au`)

## Notes

- All styling is inline CSS (no CSS files or framework)
- No user accounts or authentication
- Anonymised bill data excludes all PII (no name, address, postcode, or free-text fields)
- Email notification records do contain PII (email address) — stored separately from anonymous bill data with no cross-linking
- Resend free tier: 100 emails/day, 3000/month
