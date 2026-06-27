# 🏁 Manual Hunter

A web app for finding **manual-transmission** enthusiast cars nationwide — built for the hunt for a
**Honda Prelude**, **Nissan 240SX**, **Lexus IS300**, or **Nissan 300ZX** (the "IS 300z" you mentioned
could mean either the Lexus IS300 or the Nissan 300ZX, so both are included).

## What it does

Pick your car(s), set optional filters (ZIP, radius, max price, manual-only), and Manual Hunter
generates **pre-filtered deep links** into every major nationwide marketplace:

- **AutoTempest** — aggregates Cars.com, Craigslist, eBay, CarGurus and more in one search
- **Cars.com** — structured search with `transmission = manual`
- **AutoTrader** — structured search with manual transmission filter
- **eBay Motors** — keyword search in the Cars & Trucks category
- **Craigslist** — nationwide via Google site search
- **Facebook Marketplace** — keyword search
- **CarGurus** — nationwide via Google site search
- **Bring a Trailer** — model auction history & live listings
- **Cars & Bids** — enthusiast auction search
- **Hemmings** — classifieds for older/collector cars

Hit **"Open all"** on a car to launch every marketplace at once in new tabs.

## Why deep links instead of one combined results feed?

The major listing sites (Cars.com, AutoTrader, CarGurus, etc.) don't offer a free public API, and
scraping them is fragile and against their terms. Deep-linking is reliable, respects each site's terms,
needs no API keys or server, and sends you straight to live results. AutoTempest is included as a true
aggregator for a single combined feed.

## Running it

It's a static site — no build step, no dependencies.

```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Customizing the car list

Edit the `MODELS` array in `app.js`. Each entry holds the make/model identifiers the different
marketplaces expect. Add or remove cars there and they appear automatically.

## Notes

- Manual Hunter builds search links — it does not scrape or store any data.
- Exact filter support varies by site; for older/classic cars, keyword searches (eBay, Craigslist,
  Facebook) often surface more than structured filters do.
- **Always confirm the transmission in the actual listing** before making the drive.
