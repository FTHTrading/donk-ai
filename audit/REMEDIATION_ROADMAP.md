# Donk AI — Remediation Roadmap

**Audit Date:** 2025-07-15  
**Priority System:** P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)

---

## Phase 1: Critical Fixes (P0) — Week 1

> **Goal:** Eliminate security vulnerabilities that could cause immediate harm.

### 1.1 Rotate ALL API Keys ⏱️ 1 hour

- [ ] Rotate `OPENAI_API_KEY` at https://platform.openai.com
- [ ] Rotate `ELEVENLABS_API_KEY` at https://elevenlabs.io
- [ ] Rotate `TELNYX_API_KEY` at https://portal.telnyx.com
- [ ] Rotate `CLOUDFLARE_API_TOKEN` at https://dash.cloudflare.com
- [ ] Store new keys via `wrangler secret put` (not `.env.local` for production)
- [ ] Delete `.env.local` from disk after migration to secrets

### 1.2 Add Admin Authentication ⏱️ 4 hours

- [ ] Create `src/middleware.ts` that intercepts `/admin` routes
- [ ] Implement environment-variable-based admin secret (`ADMIN_SECRET`)
- [ ] Add login form or basic auth challenge
- [ ] Verify unauthenticated users get 401/redirect

### 1.3 Replace Rate Limiter ⏱️ 4 hours

- [ ] Replace in-memory `Map` with Cloudflare Workers KV or Upstash Redis
- [ ] Ensure rate limit state persists across isolates
- [ ] Add rate limit headers to responses (`X-RateLimit-Remaining`, etc.)
- [ ] Test under concurrent requests

### 1.4 Fix Missing TELNYX_CONNECTION_ID ⏱️ 30 min

- [ ] Add `TELNYX_CONNECTION_ID` to `.env.example`
- [ ] Configure in Cloudflare Workers secrets
- [ ] Add startup validation to prevent silent failures

---

## Phase 2: Security Hardening (P1) — Week 2

> **Goal:** Achieve baseline web security posture.

### 2.1 Add Security Headers ⏱️ 2 hours

- [ ] Add to middleware: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- [ ] Test with https://securityheaders.com

### 2.2 Add CORS Configuration ⏱️ 1 hour

- [ ] Configure API routes to only accept requests from `https://donk.unykorn.org`
- [ ] Add `Access-Control-Allow-Origin` header

### 2.3 Fix OpenAI Module-Level Crash ⏱️ 30 min

- [ ] Convert top-level initialization to lazy getter pattern ✅ IMPLEMENTED
- [ ] Verify app starts successfully without `OPENAI_API_KEY`

### 2.4 Add Input Sanitization ⏱️ 3 hours

- [ ] Add message length limit (2000 chars)
- [ ] Add prompt injection detection (keyword blocklist)
- [ ] Consider OpenAI Moderation API integration
- [ ] Add SMS phone number validation against premium rate numbers

### 2.5 Remove Hardcoded Uptime ⏱️ 30 min

- [ ] Replace hardcoded "99.9%" with actual calculated uptime or remove ✅ IMPLEMENTED
- [ ] Connect nav status dot to `/api/status` health check ✅ IMPLEMENTED

---

## Phase 3: Quality & DevOps (P2) — Weeks 3-4

> **Goal:** Establish professional development practices.

### 3.1 Add CI/CD Pipeline ⏱️ 4 hours

- [ ] Create `.github/workflows/ci.yml` with lint + type-check + test
- [ ] Create `.github/workflows/deploy.yml` for `wrangler deploy`
- [ ] Add branch protection rules on `main`

### 3.2 Add Test Framework ⏱️ 8 hours

- [ ] Configure Vitest for unit/integration tests
- [ ] Write tests for `rate-limit.ts`, `utils.ts`, `openai.ts`, `telnyx.ts`
- [ ] Add API route integration tests
- [ ] Target 50%+ code coverage

### 3.3 Add Error Boundary ⏱️ 1 hour

- [ ] Create `src/app/error.tsx` (App Router error boundary)
- [ ] Create `src/app/not-found.tsx` (custom 404)
- [ ] Create `src/app/loading.tsx` (route-level loading state)

### 3.4 Fix Documentation ⏱️ 1 hour

- [ ] Update `README.md`: correct Next.js version, remove Vercel deploy button ✅ IMPLEMENTED
- [ ] Add API documentation
- [ ] Fix brand inconsistency in `wrangler.toml`

### 3.5 Add Error Tracking ⏱️ 2 hours

- [ ] Integrate Sentry or similar
- [ ] Configure source maps for Cloudflare Workers
- [ ] Set up alerting rules

---

## Phase 4: Compliance & Polish (P3) — Weeks 5-6

> **Goal:** Legal and professional readiness.

### 4.1 Legal Documents ⏱️ 8 hours (legal review)

- [ ] Create Terms of Service page
- [ ] Create Privacy Policy page
- [ ] Create Cookie Policy (if applicable)
- [ ] Add consent mechanisms where required

### 4.2 Accessibility ⏱️ 4 hours

- [ ] Audit with axe-core or Lighthouse
- [ ] Add ARIA labels to interactive elements
- [ ] Add skip-nav link
- [ ] Test keyboard navigation

### 4.3 Production Analytics ⏱️ 2 hours

- [ ] Replace console logging with structured logging
- [ ] Add PostHog or Mixpanel for product analytics
- [ ] Add API cost tracking dashboard

---

## Implementation Status

| Fix | Status | PR/Commit |
|---|---|---|
| Fix README version + deploy target | ✅ Implemented | This audit |
| Fix hardcoded uptime in status API | ✅ Implemented | This audit |
| Fix OpenAI module-level throw | ✅ Implemented | This audit |
| Add security headers middleware | ✅ Implemented | This audit |
| Fix nav status dot | ✅ Implemented | This audit |
| Add TELNYX_CONNECTION_ID to .env.example | ✅ Implemented | This audit |
| Rotate API keys | ❌ Manual — requires provider dashboards | — |
| Replace rate limiter | ❌ Pending | — |
| Add admin auth | ❌ Pending | — |
| Add CI/CD | ❌ Pending | — |
| Add tests | ❌ Pending | — |

---

## Estimated Total Effort

| Phase | Effort |
|---|---|
| Phase 1: Critical Fixes | ~10 hours |
| Phase 2: Security Hardening | ~7 hours |
| Phase 3: Quality & DevOps | ~16 hours |
| Phase 4: Compliance & Polish | ~14 hours |
| **Total** | **~47 hours** |

---

*End of Remediation Roadmap — Donk AI*
