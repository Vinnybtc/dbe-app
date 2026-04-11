# Dutch Bitcoin Embassy — Community App

**Live:** https://dbe-app.pages.dev  
**Repo:** https://github.com/Vinnybtc/dbe-app  
**Status:** Demo mode werkend, auth nog niet live

## Wat is dit?

PWA community app voor de Dutch Bitcoin Embassy (~60 leden, Den Haag). Vervangt Telegram met een Bitcoin-native platform. Gepresenteerd aan bestuur (Pieter Voogt, Bram Kanstein, Marc van Versendaal, Vincent de Wit, Dirk Taat).

## Stack

- **Frontend:** Vanilla HTML/JS/CSS (geen framework)
- **Font:** Satoshi (body) + Fragment Mono (headings)
- **Design:** Coinbase-inspired dark theme, pill buttons, Linear-style borders
- **Backend:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Hosting:** Cloudflare Pages (auto-deploy)
- **Auth:** LNURL-auth (Lightning Login) + Magic Link fallback
- **Chatbot:** mAIxs integratie (org aangemaakt, agent geconfigureerd)

## Supabase

- **URL:** `https://jvnbdbcwypgumfuclfha.supabase.co`
- **Ref:** `jvnbdbcwypgumfuclfha`
- **Org:** VSS (`mkhmwwrdwglfpaxbwpyo`)
- **Schema:** 6 migraties, 30+ tabellen
- **Storage:** `avatars` + `chat-images` buckets

## mAIxs koppeling

- **Org ID:** `e95a8efb-ace3-46cb-89cf-deac0dd74dcc`
- **Agent:** "DBE Assistent" (Claude, NL, knowledge_base mode)
- **Supabase:** `ficnnvxnbegpxuiroitq` (Praeter org)

## Bestanden

```
index.html          — Alle 64 schermen (single HTML)
style.css           — Design system (Satoshi font, dark theme, 47KB)
app.js              — Hoofdlogica: auth, nav, leden, markt, events, chat (113KB)
auth.js             — LNURL-auth + magic link
features.js         — Bounties, challenges, prijsalerts, meetings, portefeuille
extras.js           — Woordenboek, converter, reading list, memes, bookmarks
bitcoin.js          — Mempool fees, HODL calc, S2F, PoW sim, multisig, timechain
quotes.js           — 35+ Bitcoin spreuken (Satoshi, Saylor, DBE bestuur)
wow.js              — Dashboard, halving countdown, fear&greed, confetti, animaties
manifest.json       — PWA manifest
sw.js               — Service worker (offline support)
functions/api/auth/ — LNURL-auth Cloudflare Workers (3 endpoints)
sql/                — 6 migraties (001-006)
```

## Features (90+)

### Core
- Smoelenboek (60 echte leden, zoeken, tag filters)
- Marktplaats (dienst/kennis/product, sats pricing)
- Events (RSVP, capaciteit, detail + deelnemers)
- Chat (5 kanalen, DMs, realtime ready, foto upload)
- Home Dashboard (widgets, halving countdown, fear&greed, pulse)

### Community
- Circles (kleine groepen, was "Pods")
- Deal Flow (investering/samenwerking/project/vacature)
- Bounty Board (sats beloningen voor taken)
- Zoek-Match (keyword matching)
- Vergaderplanner (1-op-1 meetings)
- Vragenbox (anoniem)
- Referral systeem

### Content
- Feed (artikelen, video's, recaps, analyses)
- YouTube video's (embed, AI samenvattingen)
- Kennisbank (4 artikelen)
- Bitcoin Educatie (3 leerroutes, 15 lessen)
- Reading List (boeken, podcasts)
- Meme Board

### Bitcoin Tools
- Bitcoin24 Calculator (Saylor 21-jaar model)
- Sats/EUR Converter
- HODL Calculator
- Mempool Fee Estimator (live data)
- Prijsalerts
- Portefeuille Tracker (privé, localStorage)

### Bitcoin Data
- Run the Numbers (key metrics)
- Stock-to-Flow
- Sat per Euro History
- Difficulty Adjustment
- Lightning Network Stats
- Block Reward Eras (halvings)
- Whale Alert
- Fiat Debt Clock (NL staatsschuld)
- Sound Money Stats (BTC vs goud vs S&P)
- Timechain Calendar

### Security & Leren
- Multisig Planner
- Cold Storage Checklist
- Proof of Work Simulator (echte SHA-256!)
- Bitcoin Woordenboek (25 termen)
- AI Assistent (mAIxs)

### Engagement
- Polls & Stemmen
- Sats Leaderboard + 10 Badges
- Challenges (maandelijks)
- Bitcoin Kaart (Den Haag)
- Event Feedback (anoniem)
- Bookmarks
- Doneer aan DBE
- Streak Tracker
- Member Spotlight (wekelijks)
- Dagelijkse Bitcoin Quote

### Design
- Sats Confetti (₿⚡ particles)
- Animated counters
- Halving countdown (shimmer)
- Fear & Greed gauge (SVG)
- Page slide transitions
- Sidebar nav (desktop) / bottom bar (mobiel)
- Meer menu met 7 categorieën

## Waar we gebleven zijn

### Werkt
- [x] Alle 90+ features gebouwd met demo data
- [x] 64 schermen navigeerbaar
- [x] Supabase project aangemaakt + 6 schema migraties uitgevoerd
- [x] mAIxs org + agent aangemaakt
- [x] GitHub repo + Cloudflare Pages deployment
- [x] Desktop sidebar + mobiel bottom bar layout
- [x] Bitcoin ticker (live mempool.space data)

### Open issue: "Bekijk demo" knop
De demo knop op het login scherm werkt niet altijd. Er is een try/catch + alert toegevoegd om de error te zien. Mogelijke oorzaken:
1. Supabase CDN laadtijd — als de CDN traag is, kan `window.supabase.createClient()` falen
2. LNURL fetch naar `/api/auth/lnurl-challenge` kan een error gooien
3. `wow.js` patcht `App.showToast` in init — als timing niet klopt kan dit crashen

**Fix strategie:** Test met browser console open (F12), klik "Bekijk demo", kijk welke error verschijnt. De alert toont het bericht.

### Nog te doen (prioriteit)
1. **Demo knop fixen** — browser console error identificeren en fixen
2. **Echte auth werkend maken** — LNURL-auth testen met Alby, magic link testen
3. **Cloudflare KV** — namespace aanmaken voor LNURL k1 challenges
4. **mAIxs chatbot embed** — zodra mAIxs dashboard live is met Mike
5. **PWA iconen** — echte DBE logo PNG's (nu SVG placeholders)
6. **Custom domein** — bijv. app.dutchbitcoinembassy.com

### Later
- Supabase Realtime aanzetten voor chat
- Push notificaties
- YouTube auto-import via RSS
- AI samenvattingen genereren
- Content scheduling
- Admin dashboard uitbreiden

## Lokaal draaien

```bash
cd dbe-app
python3 -c "
import http.server, socketserver, os
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
os.chdir('.')
with socketserver.TCPServer(('',8788),H) as s:
    s.serve_forever()
" &
open http://localhost:8788/?demo
```

## Deploy

```bash
npx wrangler pages deploy . --project-name dbe-app --branch main
```
