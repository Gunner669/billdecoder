# BillDecoder.au

Australian electricity bill analysis tool. Users upload a bill (PDF or image), Claude AI extracts tariff details and usage data, then returns a plain-English verdict with savings recommendations and retailer suggestions.

## Tech stack

- **Frontend:** Next.js 14 (App Router), React 18, inline CSS, Lucide React icons
- **Backend:** Next.js API routes calling Claude Sonnet 4 via Anthropic SDK
- **Storage:** Vercel KV (Redis) for anonymised bill data
- **Hosting:** Vercel
- **AI model:** `claude-sonnet-4-20250514` with vision (reads PDFs and images directly)

## Project structure

```
app/
  layout.js                # Root layout, metadata, lang="en-AU"
  page.js                  # Main UI — upload, processing animation, results display
  index/page.js            # BillDecoder Index — aggregate dashboard (Server Component)
  api/analyze/route.js     # POST: sends bill to Claude, returns structured JSON
  api/contribute/route.js  # POST: stores anonymised bill data to Vercel KV
  api/index-stats/route.js # GET: aggregates KV data for the Index (also used by page directly)
package.json               # 6 deps: next, react, react-dom, @anthropic-ai/sdk, @vercel/kv, lucide-react
```

## How it works

1. User uploads a bill (PDF, PNG, JPEG, WebP; max 12MB)
2. Frontend base64-encodes the file, POSTs to `/api/analyze`
3. API sends the document to Claude with a structured prompt requesting 22 JSON fields (tariff type, usage rates, verdict, savings actions, recommended retailers, etc.)
4. Frontend shows a timed 6-step progress animation while waiting
5. Results display: verdict card (overcharged/fair/competitive), decoded bill data, usage profile, solar info if applicable, actionable savings steps, and 2-3 recommended retailers

## Key data

- **Retailers database:** 10 hardcoded retailers in `page.js` (amber, energy_locals, tango, powershop, red, ovo, momentum, alinta, engie, lumo) with URLs, badges, and pitches
- **State insights:** Hardcoded average overpayment stats per state shown during processing as "early insight"
- **Verdict logic:** overcharged = >10% above best market offer or on standing offer; fair = within 10% but $100-300 savings available; competitive = <$100 savings from switching

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

## Notes

- All styling is inline CSS (no CSS files or framework)
- Main page (`page.js`) is a client component with three phases: upload, processing, results
- Index page (`index/page.js`) is a Server Component with ISR (revalidates every 5 minutes)
- Email notification signup exists in the UI but has no backend integration yet
- No user accounts or authentication
- Anonymised data stored in Vercel KV excludes all PII (no name, address, postcode, or free-text fields)
