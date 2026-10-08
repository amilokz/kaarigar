# Kaarigar — Demo 5 of 5 (AKCLNT demo series)

A standalone demo web app: a **local skilled-worker marketplace** for Pakistan.
Daily-wage workers wait at roadside chowks; customers can't find reliable workers.
Kaarigar connects them — browse verified workers by trade & area, book in minutes,
register workers over a WhatsApp-style chat, and manage everything from a demo admin panel.

## Stack

- Next.js 16 (app router) with `output: 'export'` — fully static, works offline after load
- Tailwind CSS v4, system fonts only
- Zero external URLs: no images, no fonts, no APIs, no keys (only `wa.me/` and `akclnt.com` links, as required)
- Seed data in `data/*.json` + browser `localStorage` (all keys prefixed `kaarigar-`)
- Voice via the free Web Speech API (`SpeechRecognition` + `speechSynthesis`), text fallback
- All "AI" replies are scripted keyword matching, labelled **"AI simulated for demo"**
- WhatsApp/SMS/payments are mock UI cards only
- Urdu (Roman) default, English toggle in the top bar

## Pages

| Route | What it does |
|---|---|
| `/` | Customer home — problem line, area search, category grid (SVG icons), how-it-works |
| `/workers` | ~30 fictional workers, filters: trade, area, daily rate, rating, CNIC-verified only |
| `/worker?id=…` | Worker profile — skills, experience, CSS-only work-photo placeholders, reviews, book button |
| `/book?worker=…` | Booking flow: describe job → date/time → confirm → live status tracker (Booked → Raste mein → Kaam mukammal → Rating) + complaint button (mock WhatsApp confirmation) |
| `/onboard` | WhatsApp onboarding simulation — scripted Urdu bot (keyword matching), mic input via Web Speech API, live-updating worker profile on the right |
| `/agent` | Field agent — register a worker (name, CNIC, phone, skill, area, rate, photo preview) + dashboard (registrations, pending, demo commission) |
| `/admin` | Demo login ("Login as demo admin") — verification queue, active bookings, complaints, category/area toggles, commission settings, payment records (Cash / Easypaisa / JazzCash, mock). Includes **Reset demo data**. |

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → out/
```

Regenerate seed workers: `node scripts/gen-workers.mjs`

## Notes

- All names, workers, CNICs, phone numbers, reviews and payments are **fictional sample data**.
- No government or regulator branding is used anywhere.
- Footer on every page: "Demo — sample data. Built by AKCLNT." + "Build this for your business" → `https://wa.me/`.
