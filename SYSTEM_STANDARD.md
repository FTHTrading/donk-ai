# Burnzy System Standard v1

> Every system, whether small or massive, must be truthful, precise, secure, auditable, and worthy of institutional respect.

---

## Purpose

This is the engineering standard applied to every repository, application, protocol, dashboard, and service under this org. It is not aspirational — it is the minimum bar. Systems that do not meet this standard are either in active remediation or marked as pre-release.

---

## The Six Gates

Every system must pass through six gates, in order. No gate can be skipped. Later gates do not compensate for earlier failures.

### Gate 1 — Truth

Remove all fake claims, stale labels, and cosmetic confidence.

| Check | Criteria |
|---|---|
| README accuracy | Every feature listed is demonstrably present in the codebase |
| Status labels | No feature marked "Done" unless it compiles, runs, and is reachable |
| Dashboard honesty | No vanity metrics, no misleading "healthy" indicators |
| Documentation alignment | Docs describe what the system **does**, not what it **might** do |
| Error messages | Truthful, actionable, never swallowed silently |

**Test:** Could an auditor read your README and match every claim to running code within 30 minutes?

---

### Gate 2 — Structure

Clean architecture, naming, ownership, and boundaries.

| Check | Criteria |
|---|---|
| Single responsibility | Each file/module has one clear purpose |
| Naming | Files, functions, and variables describe what they do without guessing |
| No dead code | Every export is imported somewhere; every file is reachable |
| Config centralization | One source of truth for configuration, not scattered env reads |
| Dependency hygiene | No unused packages; pinned versions for critical deps |
| Type safety | TypeScript strict mode, no `any` escape hatches without documented reason |

**Test:** Could a new engineer navigate the codebase and find any feature within 5 minutes?

---

### Gate 3 — Safety

Secrets, validation, permissions, rate limits, and failure modes.

| Check | Criteria |
|---|---|
| Secrets discipline | No secrets in client bundles; server-only env vars never prefixed `NEXT_PUBLIC_` |
| Env validation | Schema-based validation at startup; placeholder detection; paired var checks |
| Rate limiting | Distributed (Redis/Upstash) for production; in-memory acceptable only for local dev |
| Auth boundaries | Admin routes require authentication; public routes expose minimal data |
| Input validation | All user input validated (Zod or equivalent) before processing |
| Failure handling | Typed error codes; structured error responses; no raw stack traces in production |
| Network awareness | Users see which network they're on before signing transactions |

**Test:** Could a pentester find secrets in the browser bundle, bypass rate limits, or access admin data without credentials?

---

### Gate 4 — Verification

Tests, build checks, health checks, and observability.

| Check | Criteria |
|---|---|
| Type checking | `tsc --noEmit` passes with 0 errors |
| Unit tests | Critical paths covered; tests pass in CI; no skipped tests without reason |
| Build verification | `npm run build` exits 0; all routes compile |
| Verification pipeline | Single command (`npm run verify`) runs typecheck → test → build |
| Structured logging | JSON in production, human-readable in dev; log levels configurable |
| Operation timing | Critical async operations (API calls, uploads, DB queries) timed and logged |

**Test:** Can you run one command and know, within 60 seconds, whether the system is correct?

---

### Gate 5 — Credibility

Docs aligned to code, dashboards aligned to reality, clean UX.

| Check | Criteria |
|---|---|
| README = reality | Feature table matches running application |
| SETUP.md = working | A new developer can go from clone to running in under 10 minutes |
| API docs = endpoints | Every documented endpoint exists and behaves as described |
| Status endpoints | Public: minimal (ok, version); authenticated: full diagnostics |
| UX honesty | No buttons that don't work; no "coming soon" branded as "available" |
| Legal/compliance | Required disclosures present if applicable; not fabricated |

**Test:** Would a paying client, after reading your docs and running the setup guide, feel confident or confused?

---

### Gate 6 — Expansion

Only after Gates 1–5 are satisfied.

| Check | Criteria |
|---|---|
| Extensibility | New features can be added without rewriting existing ones |
| Modularity | Core modules have stable APIs; changes don't cascade unpredictably |
| Migration path | Database schema, API contracts, and config formats have upgrade paths |
| Performance budget | Response times and bundle sizes measured, not assumed |
| Monitoring readiness | Logs, metrics, and alerts can be wired in without code changes |

**Test:** Could you add a major feature in one week without breaking something else?

---

## Scoring

Each gate is scored on a 4-point scale:

| Score | Meaning |
|---|---|
| **0 — Failing** | Gate requirements not met; system should not ship |
| **1 — Partial** | Some checks pass but critical gaps remain |
| **2 — Passing** | Meets minimum bar; no blocking issues |
| **3 — Strong** | Exceeds standard; demonstrates engineering maturity |

**System rating = lowest gate score.** A system with Gate 3 (Safety) at 0 and Gate 4 (Verification) at 3 is rated 0. The chain is only as strong as the weakest gate.

### Rating Bands

| Total Score (sum of 6 gates) | Band | Meaning |
|---|---|---|
| 0–5 | **Pre-release** | Not shippable |
| 6–9 | **Alpha** | Internal use only |
| 10–13 | **Beta** | Limited external use with caveats |
| 14–16 | **Production** | Deployable with confidence |
| 17–18 | **Institutional** | Audit-ready, investor-grade |

---

## Application Checklist

Quick-reference for applying this standard to any repo:

```
[ ] README claims match running code
[ ] No dead features labeled as "Done"
[ ] TypeScript strict, 0 errors
[ ] Env validation runs at startup
[ ] No secrets in client bundle
[ ] Rate limiting on all public mutation endpoints
[ ] Admin routes require authentication
[ ] Test suite passes (npm test)
[ ] Build passes (npm run build)
[ ] Verification pipeline exists (npm run verify)
[ ] Structured logger integrated
[ ] SETUP.md produces a running system
[ ] Status endpoint reveals minimal data publicly
[ ] No overstated UI labels
[ ] Git clean — no uncommitted hardening debt
```

---

## Current Ratings

| Repository | Truth | Structure | Safety | Verification | Credibility | Expansion | Total | Band |
|---|---|---|---|---|---|---|---|---|
| `solana-launcher` | 2 | 2 | 2 | 2 | 2 | 2 | 12 | Beta |
| `donk-ai` | 2 | 2 | 2 | 2 | 2 | 1 | 11 | Beta |

**Target:** Both repos to Production (14+) by next audit cycle.

---

## The Operating Question

Before shipping anything, answer these without smoke:

1. What is this system for?
2. What is real right now?
3. What is missing?
4. What can fail?
5. Who controls what?
6. What proves correctness?
7. What proves readiness?
8. How does it evolve without breaking?

If every answer is clean and verifiable, the system is worthy.

---

*Burnzy System Standard v1 — March 2026*
