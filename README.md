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

- **Next.js 14** App Router + TypeScript strict mode
- **Tailwind CSS** — custom dark theme, glass morphism
- **OpenAI SDK** v4 — GPT-4o, streaming-ready
- **ElevenLabs REST** — `eleven_multilingual_v2` model, 50+ voices
- **Telnyx REST API** — global SMS + outbound PSTN calls
- **Cloudflare API** — DNS, zones, Workers management

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

# Optional
TELNYX_MESSAGING_PROFILE_ID=
NEXT_PUBLIC_APP_URL=https://donk.unykorn.org
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/FTHTrading/donk-ai)

1. Import this repo into Vercel
2. Add all environment variables from `.env.example`
3. Add a Cloudflare CNAME: `donk → cname.vercel-dns.com`

## API Routes

```
POST /api/chat      — GPT-4o completion + optional ElevenLabs TTS
POST /api/speak     — Raw ElevenLabs TTS → audio/mpeg binary
GET  /api/voices    — List ElevenLabs voices + credit usage
POST /api/sms       — Send SMS via Telnyx
GET  /api/call      — List available Telnyx numbers
POST /api/call      — Initiate outbound call via Telnyx
GET  /api/status    — Health check all 4 API services
```

## License

MIT — Built by [FTH Trading](https://github.com/FTHTrading) for the [Unykorn](https://unykorn.org) ecosystem.
