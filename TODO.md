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

-------------------------

## This week's priorities (small, high-impact — pick 1–2)

1) Use different account (sign-out & restart onboarding)
- What: Add a small button to let a signed-in user sign out and restart onboarding.
- Where: `src/components/layout/Header.tsx` (preferred) or `src/components/onboarding/ProfileStep.tsx`.
- Acceptance: Calls `signOut()` then navigates to `/onboarding` (fresh state). Clears session-block so onboarding is available.
- Est. effort: 1–2 hours
- Assigned: Frontend A (you)
- Due: This week

2) Router-level guard for `/onboarding` (light)
- What: Mirror the component guard in `App.tsx` or `ProtectedRoute.tsx` to avoid shallow route bypass.
- Where: `src/App.tsx`, `src/components/ProtectedRoute.tsx`.
- Acceptance: Signed-in users redirected to `/dashboard`; preserve completion override so final submit works.
- Est. effort: 2–4 hours
- Assigned: Frontend B
- Due: This week

3) Backend: verify onboarding API integration (high priority)
- What: Confirm backend endpoint that receives onboarding payload matches frontend contract; verify with emulator or quick integration test.
- Where: Backend functions (repo `backend/`), frontend `src/services` client.
- Acceptance: Final submit POST succeeds in dev; backend stores payload and returns expected response. Frontend handles errors gracefully.
- Est. effort: 3–6 hours
- Assigned: Backend Dev 1 (lead) + Backend Dev 2 (support)
- Status: In progress — coordinate with frontend to get sample payload

4) Unit test: onboarding core (small smoke, stretch)
- What: Add 2 unit tests: happy path + validation failure for `OnboardingFlow`.
- Where: `frontend/src/__tests__/onboarding/OnboardingFlow.test.tsx`.
- Acceptance: Tests run locally and in CI quickly (<10s).
- Est. effort: 3–5 hours
- Assigned: Frontend C
- Due: This week (stretch)

-------------------------

## Short backlog / next week

- CI/build checks (minimal): add GitHub Action to run TypeScript and lint on PRs. Assigned: Backend Dev 2. Est. 2–4 hours.
- E2E smoke (optional): single Cypress/Playwright happy path covering signup. Assigned: Frontend B. Est. 6–10 hours.
- Cleanup ESLint warnings (onboarding area): small sweep and fixes. Assigned: Frontend C. Est. 2–3 hours.
- Update README & `TODO.md` for dev ramp: document onboarding behavior, emulators, and how to run. Assigned: Frontend A. Est. 1–2 hours.
- `onboardingDraft` lifecycle (clear on completion + reset UX): Assigned: Frontend A. Est. 2–3 hours.
- Monitoring / telemetry (light): instrument step enters, errors, completion. Assigned: Frontend B. Est. 2–4 hours.

-------------------------

## Notes for the team
- Keep PRs small and focused (1 feature/bug per PR). Reviewers: at least one frontend + one backend for API changes.
- Use the Firebase emulator for backend testing (check `backend/README` or ask the backend lead if missing).
- If you need me to implement any of the "This week's" items, tell me which one(s) and I'll start and mark them in the todo list as in-progress.

---

If you'd like, I can now implement item 1 (the sign-out button) and run typechecks + start the dev server to validate. Reply with "Start item 1" or ask for a different task.
