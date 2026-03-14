# Donk AI

**Intelligence, Amplified** — AI-powered chat, voice synthesis, SMS, and voice calls for the [Unykorn](https://unykorn.org) ecosystem.

Live at **[donk.unykorn.org](https://donk.unykorn.org)**

---

## Features

| Feature | Provider | Route |
|---|---|---|
| 💬 AI Chat | OpenAI GPT-4o | `/chat` |
| 🔊 Voice Synthesis | ElevenLabs multilingual_v2 | `/voice` |
| 📱 SMS Messaging | Telnyx | `/sms` |
| 📞 Voice Calls | Telnyx PSTN | `/call` |
| 🛡️ System Status | All 4 APIs | `/admin` |

## Stack

- **Next.js 15** App Router + TypeScript strict mode
- **React 19** — latest concurrent features
- **Tailwind CSS** — custom dark theme, glass morphism
- **OpenAI SDK** v4 — GPT-4o, streaming-ready
- **ElevenLabs REST** — `eleven_multilingual_v2` model, 50+ voices
- **Telnyx REST API** — global SMS + outbound PSTN calls
- **Cloudflare Workers** — deployed via @opennextjs/cloudflare
- **Upstash Redis** — distributed rate limiting (`@upstash/ratelimit`)
- **Vitest** — 26 unit tests across 3 suites

## Quick Start

```bash
git clone https://github.com/FTHTrading/donk-ai.git
cd donk-ai
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk-proj-...
ELEVENLABS_API_KEY=sk_...
TELNYX_API_KEY=KEY0...
CLOUDFLARE_API_TOKEN=...

# Telnyx — get from telnyx.com → Numbers → My Numbers
TELNYX_FROM_NUMBER=+1XXXXXXXXXX

# Cloudflare — get from dashboard sidebar / zone overview
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ZONE_ID=

# Admin access
ADMIN_SECRET=your-secret-here

# Rate limiting (Upstash Redis — optional, falls back to in-memory)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# Optional
TELNYX_MESSAGING_PROFILE_ID=
NEXT_PUBLIC_APP_URL=https://donk.unykorn.org
```

## Deploy to Cloudflare Workers

```bash
npm run build
npx wrangler deploy
```

1. Ensure all secrets are set via `wrangler secret put <KEY>`
2. DNS is already configured at `donk.unykorn.org`
3. Uses `@opennextjs/cloudflare` for Next.js on Workers

## API Routes

```
POST /api/chat      — GPT-4o completion + optional ElevenLabs TTS (rate-limited)
POST /api/speak     — Raw ElevenLabs TTS → audio/mpeg binary (rate-limited)
GET  /api/voices    — List ElevenLabs voices + credit usage
POST /api/sms       — Send SMS via Telnyx (rate-limited)
GET  /api/call      — List available Telnyx numbers
POST /api/call      — Initiate outbound call via Telnyx (rate-limited)
GET  /api/status    — Public health check (ok + timestamp)
GET  /api/status?detail=true — Authenticated full diagnostics (requires ADMIN_SECRET)
```

## Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Hot-reload on port 3000 |
| Build | `npm run build` | Production build |
| Type check | `npm run typecheck` | TypeScript strict pass |
| Lint | `npm run lint` | ESLint pass |
| Test | `npm run test` | Vitest — 26 unit tests |
| Test (watch) | `npm run test:watch` | Vitest in watch mode |
| Full verify | `npm run verify` | Type-check → lint → test → build |

## License

MIT — Built by [FTH Trading](https://github.com/FTHTrading) for the [Unykorn](https://unykorn.org) ecosystem.

---

## System Standard — Burnzy v1

> Scored against [SYSTEM_STANDARD.md](SYSTEM_STANDARD.md). System rating = lowest gate score.

| Gate | Score | Notes |
|---|:---:|---|
| **1 · Truth** | 2 | README aligned to code; status endpoint split public/authenticated; no vanity metrics |
| **2 · Structure** | 2 | Clean route layout; TypeScript strict; api-response helpers; env-validation schema |
| **3 · Safety** | 2 | Upstash Redis rate limiting; ADMIN_SECRET auth; secrets server-only; input validated |
| **4 · Verification** | 2 | 0 TS errors; 26 tests passing; `npm run verify` pipeline; structured logger |
| **5 · Credibility** | 2 | Docs match deployed system; API route annotations accurate; honest status endpoint |
| **6 · Expansion** | 1 | env-validation created but not wired to startup; api-response helpers not yet adopted in routes |

| Metric | Value |
|---|---|
| **Total Score** | **11 / 18** |
| **Readiness Band** | **Beta** |
| **Critical Blocker** | `env-validation.ts` created but not integrated into startup path |
| **Next Highest-Value Fix** | Wire env validation to app startup + migrate routes to `api-response.ts` helpers → Gate 6 → 2 |
