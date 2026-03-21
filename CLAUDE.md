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
  api/analyze/route.js       # POST: sends bill to Claude, returns structured JSON (22+ fields)
  api/contribute/route.js    # POST: stores anonymised bill data to Vercel KV
  api/notify-signup/route.js # POST: stores email + bill context for rate alert notifications
  api/index-stats/route.js   # GET: aggregates KV data for the Index
public/
  robots.txt                 # Allows all crawlers, points to sitemap
  sitemap.xml                # Lists / and /index
package.json                 # 6 deps: next, react, react-dom, @anthropic-ai/sdk, @vercel/kv, lucide-react
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
- `notify:<email>` — individual notification subscription records (email, state, annual cost, tariff type, verdict). Keyed by email to prevent duplicates
- `notify_emails` — Redis set of all subscribed email addresses for batch iteration

## Environment variables

- `ANTHROPIC_API_KEY` — required, set in Vercel dashboard
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

## Notes

- All styling is inline CSS (no CSS files or framework)
- Email notification signup stores to KV but email sending is not yet implemented (future: cron job or external trigger)
- No user accounts or authentication
- Anonymised bill data excludes all PII (no name, address, postcode, or free-text fields)
- Email notification records do contain PII (email address) — stored separately from anonymous bill data with no cross-linking
