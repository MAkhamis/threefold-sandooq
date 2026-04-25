# The Box, the Guardian, & the Worker

**Live:** [sandooq.khamis.info](https://sandooq.khamis.info/)

**Building Fund · Settlement Book** — a small bilingual (English / العربية) ledger for a three-party building fund.

This is the problem it solves: in a shared residential building, someone holds the money (the **Box**), someone manages day-to-day decisions and sometimes covers things from their own pocket (the **Guardian**), and someone else does the running around — collecting from residents, paying bills, receiving wages (the **Worker**). Over a period, dozens of small flows happen in every direction. At the end, you want to know two things:

1. What does each party actually owe whom, on net?
2. What is the smallest number of real money transfers that settles everyone up?

With three parties, the answer is always **at most two transfers** — sometimes one, sometimes (gracefully) none. This app records the transactions as they happen and computes those final transfers for you.

## Features

- Six transaction types covering every realistic money flow between Box, Guardian, and Worker.
- Opening balances for the Box and the Guardian's wallet so you can start a period mid-stream.
- Running balances for each of the three pairwise relationships (Box ↔ Guardian, Box ↔ Worker, Guardian ↔ Worker).
- **Closing the books**: a greedy min-cash-flow settlement that reduces everything to at most two transfers — one personal, one for the Box.
- Ending balances with a "Close period" action that rolls them into the next period's openings.
- **Google Sheet export**: a box-only TSV view (Item · Value · Type · Comments) you can copy and paste into a spreadsheet. Personal Guardian ↔ Worker settlements are excluded.
- Full right-to-left (RTL) Arabic UI with bilingual labels and fallback item names.
- All data is kept in the browser's `localStorage` — no server, no account, no network calls.
- **Installable as a PWA** on iOS, Android, and desktop, with offline support after first load.

## Installing as an app (PWA)

After visiting the live URL once, you can install it to your home screen / dock and use it offline.

- **iOS (Safari):** tap the **Share** icon → **Add to Home Screen** → **Add**. The app launches full-screen, no browser chrome.
- **Android (Chrome):** tap the **⋮** menu → **Install app** (or **Add to Home screen**). You'll also see an install prompt automatically on supported devices.
- **Desktop (Chrome / Edge):** click the install icon in the address bar, or **⋮** menu → **Install "Sandooq"**.

A service worker caches the app shell on first load, so it continues to work without a network connection. Updates are picked up automatically the next time you open the app online.

## Tech stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) — dev server and build
- [Tailwind CSS](https://tailwindcss.com/) — utility styling
- Google Fonts (Fraunces, DM Sans, JetBrains Mono, Amiri, Cairo) loaded at runtime

## Getting started (local development)

Requirements: **Node.js 18+** and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL that Vite prints (typically `http://localhost:5173`).

### Production build

```bash
npm run build      # outputs static files to ./dist
npm run preview    # serves ./dist locally to verify the build
```

The entire app is a static single-page bundle — no backend is involved.

## Deploying to Vercel

This repo ships with a `vercel.json` so Vercel auto-detects the Vite framework and routes all paths to `index.html`.

### One-click via the dashboard

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will detect **Vite** automatically. The defaults are correct:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. Click **Deploy**. You'll get a live URL in ~30 seconds.

### Via the Vercel CLI

```bash
npm i -g vercel
vercel          # first deploy (preview)
vercel --prod   # promote to production
```

## Data and privacy

Everything you type is stored locally in your browser under three `localStorage` keys:

- `building_fund_txns_v1` — the ledger entries
- `building_fund_openings_v1` — opening balances
- `building_fund_lang_v1` — the chosen language

Clearing your browser storage will reset the app. Different browsers and different devices each keep their own separate state.

## Project structure

```
.
├── index.html              # Vite entry HTML
├── src/
│   ├── main.jsx            # React bootstrap
│   ├── App.jsx             # Entire app (UI + settlement logic)
│   └── index.css           # Tailwind directives
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json             # Vercel framework + SPA rewrite
└── package.json
```

## License

No license specified. If you're publishing the repo, consider adding one (MIT is a common choice for small open projects).
