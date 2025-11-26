# SmartStudy Architecture & Implementation Plan

## Overview
AI-powered study planner that generates personalized schedules based on user's classes, goals, assignments, and exams.

## User Tiers & Limits

### Free Tier (P0/month)
- **AI Schedule Generations**: 2 per month (initial + 1 regeneration)
- **Manual CRUD**: Unlimited (edit schedule manually)
- **Features**: Basic daily/weekly schedule view
- **Storage**: Up to 10 classes, 20 assignments

### Student Tier (P40/month)
- **AI Schedule Generations**: 20 per month
- **AI Adjustments**: 50 per month (small tweaks)
- **Manual CRUD**: Unlimited
- **Features**: Daily + Weekly + Semester view, priority optimization
- **Storage**: Unlimited classes/assignments

### Premium Tier (P50/month)
- **AI Schedule Generations**: Unlimited
- **AI Adjustments**: Unlimited
- **Manual CRUD**: Unlimited
- **Features**: All views + analytics + smart notifications
- **Storage**: Unlimited

---

## Data Model

### Firestore Collections

#### `users/{userId}`
```typescript
{
  uid: string;
  email: string;
  tier: 'free' | 'student' | 'premium';
  subscriptionExpiry?: timestamp;
  aiUsage: {
    scheduleGenerations: number;
    aiAdjustments: number;
    lastReset: timestamp; // monthly reset
  };
  preferences: {
    studyTimePreference: 'morning' | 'afternoon' | 'evening';
    weeklyStudyHours: number;
    studySessionDuration: number; // minutes
    breakDuration: number; // minutes
  };
  onboardingCompleted: boolean;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### `classes/{classId}`
```typescript
{
  userId: string;
  name: string; // e.g., "CSI311 - Data Structures"
  code: string; // e.g., "CSI311"
  instructor?: string;
  schedule: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
    startTime: string; // "09:00"
    endTime: string; // "11:00"
    location?: string;
  }[];
  credits?: number;
  color?: string; // for UI
  createdAt: timestamp;
}
```

#### `assignments/{assignmentId}`
```typescript
{
  userId: string;
  classId: string;
  title: string;
  description?: string;
  type: 'assignment' | 'exam' | 'quiz' | 'project';
  dueDate: timestamp;
  estimatedHours?: number; // user or AI estimate
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: timestamp;
  completedAt?: timestamp;
}
```

#### `goals/{goalId}`
```typescript
{
  userId: string;
  title: string;
  description?: string;
  targetDate: timestamp;
  priority: 'low' | 'medium' | 'high';
  relatedClassIds?: string[]; // optional link to classes
  status: 'active' | 'completed' | 'archived';
  createdAt: timestamp;
}
```

#### `schedules/{scheduleId}`
```typescript
{
  userId: string;
  type: 'daily' | 'weekly' | 'semester';
  startDate: timestamp;
  endDate: timestamp;
  generatedBy: 'ai' | 'manual';
  aiPromptUsed?: string; // for debugging
  blocks: ScheduleBlock[];
  version: number; // for tracking regenerations
  createdAt: timestamp;
  updatedAt: timestamp;
}

interface ScheduleBlock {
  id: string;
  date: timestamp;
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  type: 'class' | 'study' | 'break' | 'assignment' | 'exam' | 'personal';
  title: string;
  description?: string;
  classId?: string; // if type is 'class' or 'study'
  assignmentId?: string; // if type is 'assignment'
  color?: string;
  isFixed: boolean; // true for classes/exams, false for study blocks
}
```

#### `aiLogs/{logId}` (for monitoring)
```typescript
{
  userId: string;
  action: 'generate_schedule' | 'adjust_schedule' | 'optimize';
  tier: string;
  tokensUsed: number;
  success: boolean;
  error?: string;
  timestamp: timestamp;
}
```

---

## AI Workflow

### Phase 1: Initial Schedule Generation (Onboarding Complete)

**Trigger**: User completes onboarding with classes, goals, preferences

**AI Prompt Structure**:
```
You are a study planner AI. Generate a personalized study schedule.

USER PROFILE:
- Study preference: {morning/afternoon/evening}
- Weekly study hours: {20}
- Session duration: {50 minutes}
- Break duration: {10 minutes}

CLASSES:
{List of classes with schedules}

ASSIGNMENTS & EXAMS:
{List with due dates, priorities}

GOALS:
{List of academic goals}

TASK:
1. Create a weekly study schedule that:
   - Avoids conflicts with class times
   - Prioritizes upcoming assignments/exams
   - Distributes study time across all classes
   - Respects user's time preferences
   - Includes breaks

2. Return JSON format:
{
  "weeklySchedule": [
    {
      "day": "monday",
      "blocks": [
        {
          "startTime": "09:00",
          "endTime": "11:00",
          "type": "class",
          "title": "CSI311 - Data Structures",
          "classId": "xyz"
        },
        {
          "startTime": "14:00",
          "endTime": "15:30",
          "type": "study",
          "title": "Study: CSI311 - Linked Lists",
          "classId": "xyz",
          "description": "Review lecture notes and practice problems"
        }
      ]
    }
  ],
  "upcomingDeadlines": [...],
  "studyTips": "..."
}
```

**Backend Function**: `POST /api/schedule/generate`

### Phase 2: Daily Schedule Breakdown

**Trigger**: User views daily schedule or requests daily plan

**AI Prompt**:
```
Based on the weekly schedule, create a detailed daily plan for {date}.

WEEKLY SCHEDULE:
{User's weekly schedule}

ASSIGNMENTS DUE THIS WEEK:
{Filtered list}

TODAY'S FOCUS:
Generate a detailed hourly breakdown with specific tasks.
```

**Backend Function**: `POST /api/schedule/daily`

### Phase 3: Semester Overview

**Trigger**: User requests semester view

**AI Task**:
- Map all assignments/exams on calendar
- Identify high-pressure weeks (multiple deadlines)
- Suggest early start dates for major projects
- Highlight study periods before exams

**Backend Function**: `GET /api/schedule/semester`

### Phase 4: CRUD Updates with AI Adjustment

**Scenarios**:
1. **User adds new assignment** → AI suggests when to study for it
2. **User marks assignment complete** → AI redistributes freed time
3. **User changes class schedule** → AI regenerates affected study blocks
4. **User requests optimization** → AI rebalances entire schedule

**Backend Functions**:
- `POST /api/assignments` → Creates assignment + triggers AI suggestion
- `PATCH /api/assignments/{id}` → Updates + AI adjustment
- `DELETE /api/assignments/{id}` → Removes + AI rebalance
- `POST /api/schedule/optimize` → Full AI regeneration

---

## Tier Enforcement

### Middleware: `checkAIUsage`

```typescript
async function checkAIUsage(userId: string, action: 'generate' | 'adjust') {
  const user = await db.collection('users').doc(userId).get();
  const { tier, aiUsage, subscriptionExpiry } = user.data();
  
  // Check if subscription is active
  if (tier !== 'free' && subscriptionExpiry < Date.now()) {
    // Downgrade to free
    tier = 'free';
  }
  
  // Define limits
  const limits = {
    free: { generate: 2, adjust: 0 },
    student: { generate: 20, adjust: 50 },
    premium: { generate: Infinity, adjust: Infinity }
  };
  
  // Check usage
  const limit = limits[tier][action];
  const used = aiUsage[action === 'generate' ? 'scheduleGenerations' : 'aiAdjustments'];
  
  if (used >= limit) {
    throw new Error(`AI ${action} limit reached. Upgrade to continue.`);
  }
  
  // Increment usage
  await db.collection('users').doc(userId).update({
    [`aiUsage.${action === 'generate' ? 'scheduleGenerations' : 'aiAdjustments'}`]: used + 1
  });
  
  return true;
}
```

---

## Implementation Phases

### Week 1: Data Models & CRUD
- [ ] Create Firestore collections
- [ ] Build backend CRUD endpoints for classes, assignments, goals
- [ ] Build frontend forms for adding/editing data
- [ ] Test manual schedule creation (no AI yet)

### Week 2: Google AI Studio Integration
- [ ] Set up Gemini API with Google AI Studio
- [ ] Create prompt templates
- [ ] Build `/api/schedule/generate` endpoint
- [ ] Test with sample data

### Week 3: Schedule Views
- [ ] Daily schedule component
- [ ] Weekly schedule component
- [ ] Semester calendar view
- [ ] CRUD operations on schedule blocks

### Week 4: AI Adjustments & Optimization
- [ ] Implement AI adjustment on CRUD operations
- [ ] Add "Optimize Schedule" button
- [ ] Build tier enforcement middleware
- [ ] Add usage tracking dashboard

### Week 5: Polish & Testing
- [ ] Error handling
- [ ] Loading states
- [ ] Tier upgrade prompts
- [ ] End-to-end testing

---

## Cost Estimation (Under 100 Users)

### Scenario: 80 users (60 free, 15 student, 5 premium)

**AI Usage**:
- Free: 60 users × 2 generations = 120 generations
- Student: 15 users × 20 generations = 300 generations
- Premium: 5 users × 50 generations (avg) = 250 generations
- **Total**: 670 generations/month

**Token Usage**:
- Per generation: ~3,000 tokens (input) + 2,000 tokens (output) = 5,000 tokens
- Total: 670 × 5,000 = 3,350,000 tokens/month

**Cost** (Gemini 1.5 Flash):
- Input: 3.35M × $0.075/1M = $0.25
- Output: 2.23M × $0.30/1M = $0.67
- **Total: ~$0.92/month (~P13)** ✅

**Revenue**:
- Student: 15 × P40 = P600
- Premium: 5 × P50 = P250
- **Total: P850/month**

**Profit**: P850 - P13 = **P837/month** 🎉

---

## Next Steps

Which phase should I start implementing?

1. **Data models + CRUD endpoints** (backend + frontend)
2. **Gemini AI integration** (schedule generation)
3. **Tier system + usage tracking**
4. **Schedule UI components**

I recommend starting with #1 (data models) since everything else depends on it.
