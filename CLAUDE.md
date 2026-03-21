# BillDecoder.au

Australian electricity bill analysis tool. Users upload a bill (PDF or image), Claude AI extracts tariff details and usage data, then returns a plain-English verdict with savings recommendations and retailer suggestions.

## Tech stack

- **Frontend:** Next.js 14 (App Router), React 18, inline CSS, Lucide React icons
- **Backend:** Single API route (`app/api/analyze/route.js`) calling Claude Sonnet 4 via Anthropic SDK
- **Hosting:** Vercel
- **AI model:** `claude-sonnet-4-20250514` with vision (reads PDFs and images directly)

## Project structure

```
app/
  layout.js            # Root layout, metadata, lang="en-AU"
  page.js              # Entire UI — upload, processing animation, results display
  api/analyze/route.js # POST endpoint: sends bill to Claude, returns structured JSON
package.json           # 5 dependencies: next, react, react-dom, @anthropic-ai/sdk, lucide-react
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

## Commands

```bash
npm run dev    # Local dev server on localhost:3000
npm run build  # Production build
npm start      # Start production server
```

## Upcoming features

- **Postcode-level comparison bar chart:** Visual comparison of the user's bill against others in their postcode area
- **Anonymised bill data collection:** Opt-in collection of anonymised bill data with user consent (consent UI exists in `page.js` but backend not yet implemented)
- **BillDecoder Index:** Aggregate dataset of Australian electricity pricing built from contributed anonymised data

## Notes

- All styling is inline CSS (no CSS files or framework)
- The entire UI is a single component in `page.js` with three phases: upload, processing, results
- Email notification signup and data consent buttons exist in the UI but have no backend integration yet
- No database — purely stateless AI analysis
- No user accounts or authentication
