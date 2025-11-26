# SmartStudy — Team To‑Do (shareable)

This file is a concise, shareable plan for the onboarding cleanup and next steps. Tasks are bite-sized and prioritized so the student team can pick them up quickly. Completed items are listed first, then this week's deliverables, in-progress items, and a short backlog.

Last update: 2025-11-08

Team (roles)
- Frontend A — you (lead frontend this week)
- Frontend B — frontend teammate
- Frontend C — frontend teammate
- Backend Dev 1 — backend lead
- Backend Dev 2 — backend support / CI

How to use this file
- Assign tasks by name (or swap placeholders) and move them to "In progress" when you start.
- Keep items small — estimated time is included.
- If you'd like, I can implement some of these items and update the repo directly.

-------------------------

## Completed (do not reassign)

- Centralize onboarding navigation (`src/components/onboarding/OnboardingFlow.tsx`) — Completed
- Removed per-step "Continue" buttons from onboarding steps (`src/components/onboarding/*.tsx`) — Completed
- Simplified `ProfileStep` and re-added student fields (`src/components/onboarding/ProfileStep.tsx`) — Completed
- Allow onboarding before account creation; create account on final submit (`OnboardingFlow`) — Completed
- Component-level guard for onboarding (pre-auth-only policy) + live auth subscription (`OnboardingFlow`) — Completed
- TypeScript typing cleanup for onboarding step data (`src/components/onboarding/*.tsx`) — Completed
- Fixed email/password editing behavior in `ProfileStep` — Completed
- Corrected Home/Get Started routing to point to `/onboarding` — Completed
- Resolved TypeScript and lint errors for modified files — Completed
- Use different account (sign-out & restart onboarding) — Completed
- Router-level guard for `/onboarding` (light) — Completed
- Redesigned Modules UI and CRUD — Completed
- Refactored Layout for Fixed Sidebar (App Shell) — Completed
- Refactored Navigation: Moved Settings/Help to Header, Removed Study Groups — Completed

-------------------------

## This week's priorities (small, high-impact — pick 1–2)

- Connect Modules to Firestore (CRUD)
  - What: Implement backend integration for the new Modules UI.
  - Where: `src/services/modules.ts`, `src/components/Dashboard/Modules.tsx`.
  - Est. effort: 3–5 hours
  - Assigned: Frontend A / Backend Dev 1

- Backend: verify onboarding API integration (high priority)
  - What: Confirm backend endpoint that receives onboarding payload matches frontend contract.
  - Where: Backend functions, frontend client.
  - Est. effort: 3–6 hours
  - Assigned: Backend Dev 1 + Backend Dev 2
  - Status: In progress

- Implement Schedule View
  - What: Create the daily/weekly schedule view using the new layout.
  - Where: `src/components/Dashboard/Schedule.tsx`.
  - Est. effort: 4–6 hours
  - Assigned: Frontend B

-------------------------

## Short backlog / next week

- AI Schedule Generation Integration: Connect frontend to Gemini API for schedule generation.
- CI/build checks (minimal): add GitHub Action to run TypeScript and lint on PRs.
- E2E smoke (optional): single Cypress/Playwright happy path covering signup.
- Cleanup ESLint warnings (onboarding area): small sweep and fixes.
- `onboardingDraft` lifecycle (clear on completion + reset UX).
- Monitoring / telemetry (light): instrument step enters, errors, completion.

-------------------------

## Notes for the team
- Keep PRs small and focused.
- Use the Firebase emulator for backend testing.

---

## Weekly sprint plan (starter — 4 weeks)

Goal: deliver a stable onboarding flow, backend integration, basic tests, and CI.

Week 1 (this week)
- [x] ID 11: Implement 'Use different account' button
- [x] ID 12: Add router-level guard for `/onboarding`
- [x] Redesign Modules UI
- [x] Refactor Layout & Navigation
- ID 13: Backend verify onboarding API
- Connect Modules to Firestore

Week 2
- AI Schedule Generation Integration
- ID 14: Add unit tests for `OnboardingFlow`
- ID 15: Add minimal CI job
- ID 19: Implement `onboardingDraft` clear-on-complete

Week 3
- ID 16: Add E2E smoke test
- ID 17: Sweep and cleanup ESLint warnings
- ID 18: Update README and `TODO.md` developer ramp docs

Week 4 (wrap-up)
- ID 20: Add lightweight telemetry
- Polish remaining small bugs.

Ongoing: I'll post a short weekly update in this file.
