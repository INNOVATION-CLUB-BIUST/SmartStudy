# SmartStudy To-Do List

## Current Progress
**Last Updated:** October 29, 2025

### Completed Backend Functions:
- ✅ Basic Express server setup with CORS and JSON parsing
- ✅ Firebase Admin SDK initialization
- ✅ Firestore database connection
- ✅ `/hello` test endpoint
- ✅ `/onboarding` endpoint - Fully implemented with:
  - User profile creation in Firestore
  - Initial goals creation
  - Data validation
  - Error handling

### Completed Frontend Features:
- ✅ Multi-step onboarding flow UI (6 steps)
- ✅ Data collection from all onboarding steps
- ✅ API integration to send onboarding data to backend
- ✅ Proper TypeScript type definitions
- ✅ Form validation and error handling

### Known Issues/TODOs:
- ⚠️ Replace placeholder `uid` and `email` with actual Firebase Authentication data
- ⚠️ Update backend URL from placeholder to actual deployed Cloud Functions URL
- ⚠️ Add user feedback for successful/failed onboarding completion
- ⚠️ Implement redirect to dashboard after successful onboarding

---

## 1. User Onboarding & Authentication

### Frontend
- [x] Implement UI for user registration and login pages.
- [ ] Integrate with **Firebase Authentication** for email/password and Google sign-in.
- [x] Develop the multi-step onboarding flow to collect user profile data, study subjects, and initial goals.
- [x] Send the collected onboarding data to the backend.
- [ ] Implement protected routes that are only accessible to logged-in users.

### Backend (Cloud Functions)
- [x] Create a secure `/onboarding` endpoint.
- [x] When a new user signs up, trigger a function to create a corresponding user document in **Firestore**.
- [x] Store the onboarding data in the user's Firestore document.

## 2. Dashboard

### Frontend
- [ ] Fetch and display a summary of the user's data: upcoming tasks, today's schedule, and progress towards goals.
- [ ] Create UI components for each of these summary sections.

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
