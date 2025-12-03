# SmartStudy — Team To‑Do

**Last Updated:** 2025-12-02  
**Timeline:** 6 weeks to MVP launch (Jan 12, 2026)

**Team:**
- Backend Dev 1 (Motions) — backend lead
- Backend Dev 2 (Thandi) — backend support / testing
- Frontend Dev (Thabiso) — frontend components & integration
- Fullstack Lead (WyvernPirate) — oversight, code review, integration

**How to use this file:**
- Pick tasks from "This Week" section
- Move to "In Progress" when you start
- Mark [x] when complete
- Daily async standups in chat
- Friday demos

---

## ✅ Completed

### Onboarding & Layout
- [x] Centralize onboarding navigation (`OnboardingFlow.tsx`)
- [x] Removed per-step "Continue" buttons
- [x] Simplified `ProfileStep` with student fields
- [x] Allow onboarding before account creation
- [x] Component-level auth guards
- [x] TypeScript cleanup for onboarding
- [x] Fixed email/password editing
- [x] Corrected routing to `/onboarding`
- [x] Use different account (sign-out & restart)
- [x] Router-level guard for `/onboarding`

### UI/UX
- [x] Redesigned Modules UI with top bar navigation
- [x] Refactored Layout for Fixed Sidebar (App Shell)
- [x] Moved Settings/Help to Header
- [x] Removed Study Groups feature

### Backend
- [x] Basic Firebase Functions setup
- [x] Onboarding API endpoint
- [x] Firebase authentication setup
- [ ] **Modules CRUD API** (`backend/functions/src/modules.ts`)
- [ ] **Authentication middleware**
- [ ] **Integrated modules router into Express app**
```
```
### Backend Dev 1 (10 hours) — Lead Backend
- [ ] Implement **Modules CRUD API** (`backend/functions/src/modules.ts`)
- [ ] Implement **Authentication middleware** for modules API
- [ ] Integrate modules router into Express app
- [ ] Test modules API with Postman/curl
  - [ ] Test all 5 endpoints (GET, POST, PUT, DELETE)
  - [ ] Verify authentication middleware works
  - [ ] Test with multiple users (ownership verification)
  - [ ] Check data structure in Firestore emulator
- [ ] Write Firestore security rules for `classes` collection
- [ ] Document API in `backend/functions/API.md`
  - [ ] Endpoint descriptions
  - [ ] Request/response examples
  - [ ] Error codes

### Frontend Services
- [x] **Modules API service** (`services/modules.ts`)
- [x] **Updated `api.ts` with PUT and DELETE helpers**
- [x] StorageService for local data

---

## 🔥 This Week: Modules Backend Integration (Dec 2-8)

**Goal:** Connect modules UI to Firestore - full CRUD working!

### Backend Dev 1 (10 hours) — Lead Backend
- [ ] Test modules API with Postman/curl
  - [ ] Test all 5 endpoints (GET, POST, PUT, DELETE)
  - [ ] Verify authentication middleware works
  - [ ] Test with multiple users (ownership verification)
  - [ ] Check data structure in Firestore emulator
- [ ] Write Firestore security rules for `classes` collection
- [ ] Document API in `backend/functions/API.md`
  - [ ] Endpoint descriptions
  - [ ] Request/response examples
  - [ ] Error codes

### Backend Dev 2 (7 hours) — Support & Testing
- [ ] Set up and run Firestore emulator
- [ ] Create test data for development
- [ ] Test edge cases:
  - [ ] Invalid data (missing fields)
  - [ ] Malformed JSON
  - [ ] Expired auth tokens
  - [ ] Non-existent module IDs
- [ ] Document bugs found
- [ ] (Optional) Set up basic CI testing

### Frontend Dev (7 hours) — Integration
- [ ] Connect `Modules.tsx` to API
  - [ ] Import `fetchModules`, `createModule`, etc.
  - [ ] Remove `mockModules` constant
  - [ ] Add `useEffect` to load modules on mount
  - [ ] Update `handleAddModule` to use API
  - [ ] Update `handleUpdateModule` to use API
  - [ ] Update `handleDeleteModule` to use API
- [ ] Add loading states
- [ ] Add error handling and display
- [ ] Test full CRUD cycle in browser
- [ ] Verify data persists on refresh

### Fullstack Lead (5 hours) — You
- [ ] Code review backend implementation
- [ ] Code review frontend integration
- [ ] Integration testing (end-to-end)
- [ ] Help resolve any blocking issues
- [ ] Verify security (auth, data isolation)

### Testing Checklist (Everyone)
- [ ] Create module via UI → appears in Firestore
- [ ] Refresh page → module still loads
- [ ] Edit module → updates in Firestore
- [ ] Delete module → removed from Firestore
- [ ] Try without auth → rejected
- [ ] Try to access another user's module → rejected

---

## 📅 6-Week Roadmap Overview

### Week 1 (Dec 2-8) - Modules Backend ← **WE ARE HERE**
- Connect modules to Firestore
- Full CRUD working

### Week 2 (Dec 9-15) - Assignments, Goals & AI Setup
- Assignments API + frontend
- Goals API + frontend
- Google AI Studio setup
- Initial Gemini prompt testing

### Week 3 (Dec 16-22) - Schedule Generation
- AI schedule generation algorithm
- Daily/weekly schedule views
- "Generate Schedule" button
- Manual schedule editing

### Week 4 (Dec 23-29) - Tier System
- Freemium tier enforcement
- AI usage tracking
- Usage dashboard
- Upgrade prompts
- *(Holiday week - reduced hours)*

### Week 5 (Dec 30 - Jan 5) - AI Adjustments & Testing
- Smart AI adjustments (auto-rebalance)
- Comprehensive testing
- Bug fixes
- UX polish

### Week 6 (Jan 6-12) - Launch Prep
- Final polish
- Documentation
- Deployment to production
- Beta testing
- **LAUNCH! 🚀**

---

## 📋 Upcoming Backlog

### Week 2 Preview
- [ ] Assignments collection & CRUD API
- [ ] Goals collection & CRUD API
- [ ] Google AI Studio account setup
- [ ] Gemini API integration
- [ ] Schedule generation endpoint (v1)

### Later (Post-MVP)
- [ ] Semester calendar view
- [ ] Analytics dashboard
- [ ] Study mode (focus timer)
- [ ] Mobile responsiveness improvements
- [ ] Payment integration (real subscriptions)
- [ ] Third-party integrations (Google Calendar)
- [ ] CI/CD pipeline
- [ ] E2E tests (Cypress/Playwright)

---

## 📚 Resources

- **Roadmap:** `/brain/6_week_roadmap.md` - Detailed weekly breakdown
- **Implementation Plan:** `/brain/implementation_plan.md` - Week 1 technical details
- **Team Assignments:** `/brain/week1_team_assignments.md` - Specific tasks with code examples
- **Task Tracking:** `/brain/task.md` - Checklist for all weeks
- **Architecture:** `ARCHITECTURE.md` - System design & data models

---

## 💬 Communication

**Daily (Async):**
- What did you do?
- What will you do?
- Any blockers?

**Mid-Week (Wednesday):**
- 15-min sync call
- Demo progress
- Discuss issues

**Friday:**
- 30-min demo + retrospective
- Show working features
- What went well / what can improve
- Plan next week

---

## 🎯 Success Metrics

**Week 1 (This Week):**
- ✅ Modules CRUD working via UI
- ✅ Data persists to Firestore
- ✅ Auth protects endpoints
- ✅ No critical bugs

**End of 6 Weeks:**
- ✅ Users can create account & onboard
- ✅ Users can add classes, assignments, goals
- ✅ AI generates personalized study schedules
- ✅ Freemium model enforces tier limits
- ✅ App is live and accepting users

Let's build this! 💪
