# SmartStudy Setup Guide

## Overview
This guide covers the complete setup for local development with Firebase emulators and the authentication/onboarding flow.

## Architecture

### Authentication Flow
1. **New Users (Get Started)**:
   - Home → Click "Get Started" → Redirected to `/onboarding`
   - `ProtectedRoute` checks if user is logged in, if not → redirected to `/login`
   - User fills ProfileStep (email + password) → Account created via Firebase Auth
   - User completes remaining steps → Data sent to backend `/onboarding`
   - Backend writes to Firestore with `onboardingCompleted: true`
   - User redirected to `/dashboard`

2. **Existing Users (Login)**:
   - Home → Click "Sign In" → Login page
   - User logs in → Redirected to `/onboarding`
   - `ProtectedRoute` checks `onboardingCompleted` in Firestore:
     - If `true` → Redirected to `/dashboard`
     - If `false` → Stays on `/onboarding` (edge case: logout mid-onboarding)

3. **Protected Routes**:
   - `/onboarding`: Requires auth, shows if not onboarded
   - `/dashboard`: Requires auth AND onboarding completion

## Firebase Emulator Setup

### Prerequisites
- Node.js 18+
- Firebase CLI installed: `npm install -g firebase-tools`
- Java 21+ (for Firestore emulator)

### Starting Emulators
```bash
# From project root
firebase emulators:start --only functions,firestore

# Or start all emulators
firebase emulators:start
```

### Emulator Access Points
- **Emulator UI**: http://localhost:4000
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **API Endpoint**: http://localhost:5001/smartstudy-26356/us-central1/api


### Backend
No additional environment variables needed. Firebase Admin SDK automatically detects emulators when running.

## Development Workflow

### 1. Start Backend (Terminal 1)
```bash
cd /home/wyvernpirate/Work/SmartStudy
firebase emulators:start --only functions,firestore
```

Wait for:
```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready! View status and logs at            │
│    http://127.0.0.1:4000                                     │
└─────────────────────────────────────────────────────────────┘
```

### 2. Start Frontend (Terminal 2)
```bash
cd /home/wyvernpirate/Work/SmartStudy/frontend/SmartStudy
npm run dev
```

### 3. Test the Flow

#### Test 1: New User Onboarding
1. Open http://localhost:5173
2. Click "Get Started"
3. Fill in profile with new email/password
4. Complete all onboarding steps
5. Submit → Should redirect to `/dashboard`
6. Check Firestore UI (http://localhost:4000) → Verify user document created with `onboardingCompleted: true`

#### Test 2: Existing User Login
1. Use same email from Test 1
2. Click "Sign In" on homepage
3. Enter credentials → Should redirect directly to `/dashboard`
4. Try accessing `/onboarding` → Should redirect back to `/dashboard`

#### Test 3: Incomplete Onboarding
1. Create new account but don't complete all steps
2. Refresh page → Data should be preserved (localStorage)
3. Complete onboarding → Should succeed

## Backend API Endpoints

### POST /onboarding
**Auth Required**: Yes (Bearer token)

**Request Body**:
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "university": "BIUST",
    "major": "Computer Science",
    "yearOfStudy": "3rd Year",
    "studentId": "202012345",
    "dateOfBirth": "2000-01-01"
  },
  "subjects": ["Mathematics", "Physics", "Computer Science"],
  "preferences": {
    "studyTimePreference": "morning",
    "weeklyStudyHours": 20,
    "studySessionDuration": 50,
    "breakDuration": 10
  },
  "goals": [
    {
      "title": "Complete Final Year Project",
      "targetDate": "2025-12-31",
      "priority": "high"
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "onboardingCompleted": true,
    "createdAt": "2025-10-29T12:00:00.000Z",
    "updatedAt": "2025-10-29T12:00:00.000Z"
  }
}
```

## Key Features Implemented

### Backend
- ✅ Firebase Admin SDK initialization
- ✅ Express API with CORS
- ✅ JWT verification middleware
- ✅ Idempotent onboarding endpoint
- ✅ Firestore user and goals creation
- ✅ Timestamp management (createdAt/updatedAt)

### Frontend
- ✅ Firebase Auth integration (email/password)
- ✅ Multi-step onboarding flow (6 steps)
- ✅ LocalStorage draft autosave
- ✅ Protected routes with `ProtectedRoute` component
- ✅ Automatic redirects based on auth/onboarding status
- ✅ Smart field prefilling (email locked when logged in)
- ✅ Password fields hidden for logged-in users
- ✅ API client with automatic token injection
- ✅ Loading states and error handling

## Firestore Collections

### users
```
users/{uid}
  - email: string
  - firstName: string
  - lastName: string
  - university: string
  - major: string
  - yearOfStudy: string
  - studentId: string
  - dateOfBirth: string
  - subjects: string[]
  - preferences: object
  - onboardingCompleted: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
```

### goals
```
goals/{goalId}
  - userId: string (uid)
  - title: string
  - targetDate: string
  - priority: string
  - createdAt: timestamp
```

## Troubleshooting

### Emulators won't start
- Ensure Java 21+ is installed: `java -version`
- Check ports aren't in use: `lsof -i :4000 -i :5001 -i :8080`

### Frontend can't connect to backend
- Verify `VITE_FUNCTIONS_BASE_URL` in `.env`
- Check emulators are running (http://localhost:4000)
- Restart dev server after changing `.env`

### Authentication errors
- Clear browser localStorage
- Check Firebase Auth is enabled in console
- Verify emulator is using correct project ID

### CORS errors
- Backend already configured with CORS
- Ensure `origin: true` is set in Express CORS config

## Next Steps
1. ✅ Test complete auth flow
2. ✅ Verify Firestore data structure
3. ⚠️ Build Dashboard component
4. ⚠️ Deploy to production
5. ⚠️ Set up Firestore security rules
