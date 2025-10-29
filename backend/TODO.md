# SmartStudy To-Do List

## Current Progress
**Last Updated:** October 29, 2025

### Completed Backend Functions:
- ✅ Basic Express server setup with CORS and JSON parsing
- ✅ Firebase Admin SDK initialization
- ✅ Firestore database connection
- ✅ `/hello` test endpoint
  - User profile creation in Firestore
  - Initial goals creation
  - Data validation
  - Error handling
  - Firebase ID token verification middleware
  - Idempotent user document merging
  - Timestamp management (createdAt/updatedAt)

### Completed Frontend Features:
  - Email/password login
  - User account creation during onboarding
  - ID token attachment to API requests
- ✅ LocalStorage draft autosave for onboarding
- ✅ Protected routes with onboarding status checks
- ✅ Route guards to prevent re-onboarding
- ✅ Smart field prefilling based on auth state

### Configuration Required:
**Environment Variables** (`.env.local` in frontend):
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FUNCTIONS_BASE_URL=http://localhost:5001/smartstudy-26356/us-central1/api  # Local emulator
# VITE_FUNCTIONS_BASE_URL=https://us-central1-smartstudy-26356.cloudfunctions.net/api  # Production
```

### Firebase Emulator Setup:
**Start emulators locally**:
```bash
firebase emulators:start --only functions,firestore
```

**Access points**:
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- Emulator UI: http://localhost:4000

### Next Steps:
- ⚠️ Test full auth flow: Login → Dashboard (onboarded users)
- ⚠️ Test full onboarding flow: Get Started → Onboarding → Dashboard
- ⚠️ Deploy Firebase Functions and Firestore rules


## 1. User Onboarding & Authentication

### Frontend
- [x] Implement protected routes that are only accessible to logged-in users.
- [x] Add route guards to skip onboarding for users who already completed it.

### Backend (Cloud Functions)
- [x] Add Firebase ID token verification middleware for security.

## 2. Dashboard

### Frontend
- [x] Implement protected routes that check auth and onboarding status.

### Backend (Cloud Functions)
- [ ] Create a `/dashboard` endpoint that gathers and returns all the necessary summary data from various Firestore collections (tasks, schedule, goals).

## 3. Schedule Management

### Frontend
- [ ] Build the calendar interface for viewing the study schedule.
- [ ] Create forms (modals) for adding and editing study sessions, classes, and other events.
-_ [ ] Connect the UI to the backend to fetch and update schedule data.

### Backend (Cloud Functions)
- [ ] Implement CRUD (Create, Read, Update, Delete) endpoints for schedule events (e.g., `/schedule`).
- [ ] All schedule data will be stored in a `schedule` collection in Firestore, linked to the user.

## 4. Study Time Tracker

### Frontend
- [ ] Develop the UI for the study timer, including start, pause, and stop controls.
- [ ] Allow users to associate each study session with a subject.
- [ ] Send the completed study session data to the backend.

### Backend (Cloud Functions)
- [ ] Create a `/study-sessions` endpoint to save the details of each study session to a `study_sessions` collection in Firestore.

## 5. Task and Goal Management

### Frontend
- [ ] Create the UI for listing tasks and goals.
- [ ] Implement functionality to add, edit, delete, and mark tasks as complete.
- [ ] Develop the interface for setting and tracking long-term academic goals.

### Backend (Cloud Functions)
- [ ] Implement CRUD endpoints for both tasks (`/tasks`) and goals (`/goals`).
- [ ] Store this data in separate `tasks` and `goals` collections in Firestore.

## 6. Analytics & Progress Tracking

### Frontend
- [ ] Use a charting library (like Chart.js or Recharts) to create visualizations for:
    - [ ] Study time distribution by subject.
    - [ ] Task completion rates.
    - [ ] Progress towards goals over time.

### Backend (Cloud Functions)
- [ ] Create an `/analytics` endpoint that aggregates data from Firestore to generate the insights needed for the charts.

## 7. AI Assistant

### Frontend
- [ ] Build out the chat interface.
- [ ] Send user messages to the backend AI endpoint.
- [ ] Display the responses from the AI.

### Backend (Cloud Functions)
- [ ] Create an `/ai-assistant` endpoint.
- [ ] This function will take the user's query and securely call the **Gemini API**.
- [ ] It will then process the response and send it back to the frontend.
