# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Comet Carriers** — a two-person moving service (Isaac + roommate) based in Dallas–Fort Worth, TX. The business provides a truck (rented U-Haul) plus labor. The website is a single-file HTML/CSS/JS frontend with a Vercel serverless function backend (`/api/quote.js`) for Twilio SMS notifications.

## Development

No build system for the frontend. Open `index.html` directly in a browser for layout work. To test the `/api/quote` endpoint locally, use `vercel dev` (requires Vercel CLI and `.env.local` populated with real Twilio credentials).

## Architecture

```
/
  index.html       — main marketing website (all CSS and JS inline)
  cosmos.png       — Cosmos the cat mascot photo
  api/
    quote.js       — Vercel serverless function: receives form POST, sends Twilio SMS to owner
  package.json     — twilio npm dependency
  vercel.json      — API rewrite rules
  .env.local       — local secrets (never committed)
  .gitignore
```

The quote form submits JSON to `POST /api/quote`. The serverless function validates the payload and sends an SMS to Isaac's phone via Twilio. No customer-facing SMS — Isaac follows up manually.

## Design System

**Font:** Inter only (400–900 weights from Google Fonts). No display or cartoon fonts.

**Color tokens** (defined as CSS custom properties in `:root`):
```
--red:    #E04018   primary CTA, accents
--red-d:  #C23410   hover state
--red-lt: #fef0ea   light red background
--yellow: #F5C018   accents
--teal:   #1B9E8A   trust bar background
--tlt:    #eef8f6   light teal background
--ink:    #231a10   primary text
--brown:  #2e1c0c   footer background
--sub:    #5a4a38   secondary text
--muted:  #a0907e   muted/placeholder text
--line:   #ede5d8   borders
--cream:  #faf6ef   section backgrounds
```

**Style:** Retro-professional. Warm, clean. Stripe dividers (red/yellow/teal repeating pattern) are a signature element. NOT dark/space-themed, NOT video-gamey.

**Scroll reveal:** Elements with `.reveal` class animate in via IntersectionObserver (`threshold: 0.08`). Add `.reveal` + optional `style="transition-delay:.Xs"` to new sections.

## Hard Rules (Non-Negotiable)

- **No emojis** anywhere in `index.html`
- **No pricing on the website** — quote-based only; all inquiries go through the form
- **Do not frame services as "labor only"** — the truck is always included in full-service
- **Do not add UTD-specific language** — the business serves all of DFW, not just students
- **No reviews section** — placeholder reviews felt fake; omit entirely
- **Cat restricted to nav + About section** — Cosmos appears only in the nav logo and the About section brand panel

## Cosmos the Cat (Mascot)

- British Blue Shorthair belonging to Isaac's roommate
- **Nav:** `<img src="cosmos.png" class="cat-icon">` — cropped to face via `object-fit:cover; object-position:10% top`
- **About section:** `<img src="cosmos.png" style="width:180px;height:auto;">` inside `.brand-mark-wrap`

## Planned Tech Stack

- **Domain:** cometcarriers.com (not yet registered)
- **Hosting:** Vercel (free tier)
- **Payments:** Square (free plan, card reader)
- **Potential future upgrade:** Next.js on Vercel if the single-file approach becomes limiting
