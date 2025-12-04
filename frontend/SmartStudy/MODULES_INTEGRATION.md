# Modules Frontend Integration Guide

**For:** Frontend Dev (Thabiso) - dev4 Branch  
**Goal:** Connect the Modules UI to the backend API for full CRUD functionality

---

## 📋 Overview

You're working on integrating the beautiful modules UI that's already built with the backend API. The backend team has already implemented the `/modules` API endpoints, and we have API service functions ready to use in `src/services/modules.ts`.

**Your job:** Replace the mock data with real API calls so modules persist to the database.

---

## ✅ What's Already Done

- ✅ **UI Components** - All module UI components are built and working with mock data
- ✅ **API Service Layer** - `src/services/modules.ts` has all the API functions ready
- ✅ **Backend API** - Backend endpoints are implemented and tested
- ✅ **Types** - TypeScript interfaces are defined

---

## 🎯 Your Tasks (7 hours total)

### Task 1: Set Up Development Environment (30 min)

**Make sure these are running:**

1. **Backend Emulator**
   ```bash
   cd /home/wyvernpirate/Work/SmartStudy
   firebase emulators:start --only functions,firestore
   ```
   ✅ Should see: `functions[us-central1-api]: http function initialized`

2. **Frontend Dev Server**
   ```bash
   cd frontend/SmartStudy
   npm run dev
   ```
   ✅ Should see: `Local: http://localhost:5173/`

3. **Verify Authentication**
   - Go to http://localhost:5173
   - Login with your test account
   - You should be redirected to dashboard

---

### Task 2: Replace Mock Data with API Calls (3 hours)

**File to Edit:** `src/components/Dashboard/Modules.tsx`

#### Step 2.1: Import API Functions

At the top of `Modules.tsx`, add this import:

```typescript
import { fetchModules, createModule, updateModule, deleteModule } from '../../services/modules';
```

Also import `useEffect` from React:

```typescript
import { useState, useEffect } from 'react';
```

#### Step 2.2: Add Loading and Error States

Replace this line (around line 176):
```typescript
const [modules, setModules] = useState<Module[]>(mockModules);
```

With:
```typescript
const [modules, setModules] = useState<Module[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

#### Step 2.3: Load Modules on Component Mount

Add this `useEffect` hook after your state declarations:

```typescript
useEffect(() => {
  const loadModules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchModules();
      setModules(data);
      
      // Select first module if none selected
      if (data.length > 0 && !selectedModuleId) {
        setSelectedModuleId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load modules:', err);
      setError('Failed to load modules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  loadModules();
}, []); // Empty array means this runs once on mount
```

#### Step 2.4: Update `handleAddModule` Function

Replace the current `handleAddModule` function (around line 184):

```typescript
const handleAddModule = async (moduleData: any) => {
  try {
    setError(null);
    
    // Remove the id field - backend will generate it
    const { id, ...dataWithoutId } = moduleData;
    
    // Call API to create module
    const newModule = await createModule(dataWithoutId);
    
    // Add to local state
    setModules([...modules, newModule]);
    setSelectedModuleId(newModule.id);
    setShowAddModal(false);
  } catch (err) {
    console.error('Failed to create module:', err);
    setError('Failed to create module. Please try again.');
  }
};
```

#### Step 2.5: Update `handleUpdateModule` Function

Replace the current `handleUpdateModule` function (around line 190):

```typescript
const handleUpdateModule = async (moduleData: Module) => {
  try {
    setError(null);
    
    // Extract only the fields that may have changed
    const { id, userId, createdAt, updatedAt, ...updateData } = moduleData;
    
    // Call API to update module
    const updatedModule = await updateModule(moduleData.id, updateData);
    
    // Update local state
    setModules(modules.map(m => m.id === updatedModule.id ? updatedModule : m));
    setEditingModule(null);
  } catch (err) {
    console.error('Failed to update module:', err);
    setError('Failed to update module. Please try again.');
  }
};
```

#### Step 2.6: Update `handleDeleteModule` Function

Replace the current `handleDeleteModule` function (around line 195):

```typescript
const handleDeleteModule = async (moduleId: string) => {
  try {
    setError(null);
    
    // Call API to delete module
    await deleteModule(moduleId);
    
    // Update local state
    const updatedModules = modules.filter(m => m.id !== moduleId);
    setModules(updatedModules);
    
    // Select another module if needed
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(updatedModules[0]?.id || null);
    }
    
    setDeleteConfirm(null);
  } catch (err) {
    console.error('Failed to delete module:', err);
    setError('Failed to delete module. Please try again.');
  }
};
```

---

### Task 3: Add Loading & Error UI (1.5 hours)

#### Step 3.1: Add Loading State

In the component's return statement, add loading UI before the main content (around line 295):

```typescript
return (
  <div className="relative min-h-screen pb-20 flex flex-col">
    {/* Top Bar Navigation */}
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white mb-4">My Modules</h1>
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-slate-400">Loading modules...</span>
        </div>
      ) : (
        <ModuleTopBar 
          modules={modules}
          selectedModuleId={selectedModuleId}
          onSelectModule={(m) => setSelectedModuleId(m.id)}
          onAddModule={() => setShowAddModal(true)}
        />
      )}
    </div>

    {/* Error Display */}
    {error && (
      <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
        >
          Dismiss
        </button>
      </div>
    )}

    {/* Rest of your component... */}
```

#### Step 3.2: Handle Empty State

Update the empty state section to show when not loading and no modules exist:

```typescript
{!isLoading && !selectedModule && modules.length === 0 && (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
    <BookOpen className="h-16 w-16 text-slate-600 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">No Modules Yet</h3>
    <p className="text-slate-400 max-w-md mb-6">
      Get started by adding your first module. Track classes, assignments, and grades all in one place.
    </p>
    <button 
      onClick={() => setShowAddModal(true)}
      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-medium rounded-xl transition-colors flex items-center gap-2"
    >
      <Plus className="h-5 w-5" />
      Add First Module
    </button>
  </div>
)}
```

---

### Task 4: Update Inline Edit Handlers (1 hour)

The functions `handleUpdateSchedule`, `handleUpdateScore`, and `handleUpdateFinalScore` currently only update local state. They should also save to the API.

#### Update all three handlers to call the API:

```typescript
const handleUpdateSchedule = async (newSchedule: ClassSchedule[]) => {
  if (!selectedModule) return;
  
  try {
    setError(null);
    const updatedModule = await updateModule(selectedModule.id, {
      classSchedule: newSchedule
    });
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  } catch (err) {
    console.error('Failed to update schedule:', err);
    setError('Failed to update schedule. Please try again.');
  }
};

const handleUpdateScore = async (componentIndex: number, newScore: number) => {
  if (!selectedModule) return;
  
  try {
    setError(null);
    const updatedComponents = [...selectedModule.assessments.ca.components];
    updatedComponents[componentIndex] = { 
      ...updatedComponents[componentIndex], 
      score: newScore 
    };
    
    const updatedModule = await updateModule(selectedModule.id, {
      assessments: {
        ...selectedModule.assessments,
        ca: {
          ...selectedModule.assessments.ca,
          components: updatedComponents
        }
      }
    });
    
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  } catch (err) {
    console.error('Failed to update score:', err);
    setError('Failed to update score. Please try again.');
  }
};

const handleUpdateFinalScore = async (newScore: number) => {
  if (!selectedModule) return;
  
  try {
    setError(null);
    const updatedModule = await updateModule(selectedModule.id, {
      assessments: {
        ...selectedModule.assessments,
        finalExam: {
          ...selectedModule.assessments.finalExam,
          score: newScore
        }
      }
    });
    
    setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
  } catch (err) {
    console.error('Failed to update final score:', err);
    setError('Failed to update final score. Please try again.');
  }
};
```

---

### Task 5: Testing (1 hour)

#### Manual Testing Checklist

- [ ] **Create Module**
  1. Click "Add Module" button
  2. Fill in all required fields
  3. Click "Save Module"
  4. Module appears in top bar
  5. Check browser console - no errors

- [ ] **Refresh Persistence**
  1. Refresh the page (F5)
  2. Modules still appear
  3. Selected module is restored

- [ ] **Edit Module**
  1. Click edit button on a module
  2. Change some fields
  3. Click "Update Module"
  4. Changes appear immediately

- [ ] **Delete Module**
  1. Click delete button
  2. Confirm deletion
  3. Module disappears
  4. Another module is selected automatically

- [ ] **Score Updates**
  1. Enter a score in an assessment
  2. Check it saves (refresh page to verify)
  3. Grade calculator updates correctly

- [ ] **Error Handling**
  1. Turn off backend emulator
  2. Try to create a module
  3. Error message appears
  4. Turn emulator back on
  5. Try again - should work

- [ ] **Empty State**
  1. Delete all modules
  2. Empty state appears
  3. "Add First Module" button works

---

## 🐛 Troubleshooting

### Error: "Not authenticated"
- Make sure you're logged in
- Check that `auth.currentUser` exists
- Token might be expired - logout and login again

### Error: "Failed to fetch"
- Backend emulator not running - run `npm run serve` in `backend/functions`
- Wrong URL - check `src/services/api.ts` for correct base URL

### Error: "CORS error"
- Should not happen with emulator, but if it does:
- Check CORS configuration in backend
- Make sure using `127.0.0.1` not `localhost`

### Module doesn't appear after creation
- Check browser console for errors
- Check Network tab in DevTools - is the POST request successful?
- Check backend emulator logs - what's the response?

### Data doesn't persist after refresh
- API might not be saving to Firestore
- Check Firestore emulator UI: http://127.0.0.1:4000/firestore
- Look for `classes` collection - your modules should be there

---

## 💡 Pro Tips

- **Use Browser DevTools**: 
  - Network tab shows all API calls
  - Console shows errors and logs
  - React DevTools shows component state

- **Check Backend Logs**:
  - The terminal running `npm run serve` shows all API requests
  - Look for error messages there

- **Test One Thing at a Time**:
  - Get CREATE working first
  - Then GET (loading modules)
  - Then UPDATE
  - Finally DELETE

- **Keep Mock Data Handy**:
  - Don't delete the `mockModules` constant yet
  - You can use it for fallback during development
  - Remove it only after everything works

---

## 📖 API Reference

You don't need to implement these - they're already in `src/services/modules.ts`. Just use them!

### `fetchModules()`
Returns: `Promise<Module[]>`  
Gets all modules for the current user

### `createModule(data)`
Params: `CreateModuleData` (module without id, userId, timestamps)  
Returns: `Promise<Module>`  
Creates a new module

### `updateModule(id, data)`
Params: `string`, `Partial<Module>`  
Returns: `Promise<Module>`  
Updates an existing module

### `deleteModule(id)`
Params: `string`  
Returns: `Promise<{success: boolean, message: string, id: string}>`  
Deletes a module

---

## 🎯 Success Criteria

You're done when:

✅ Can create a module via UI  
✅ Module appears immediately  
✅ Refresh page - module still there  
✅ Can edit module info  
✅ Can edit schedules  
✅ Can add/edit scores  
✅ Can delete module  
✅ Error messages show when things fail  
✅ Loading state shows when fetching data  
✅ No mock data remaining in code  
✅ No console errors  

---

## 📞 Need Help?

- **Backend issues**: Ask Motions (Backend Dev 1)
- **API questions**: Check `backend/functions/API_TESTING.md`
- **Integration issues**: Ask WyvernPirate (Fullstack Lead)
- **TypeScript errors**: Check types in `src/services/modules.ts`

---

## 📝 Code Review Checklist

Before submitting for review:

- [ ] All console.logs removed (except error logs)
- [ ] No commented-out code
- [ ] TypeScript has no errors
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Mock data removed
- [ ] Code formatted properly
- [ ] All tests passing

---

Good luck! 🚀 You got this! 💪







{/*mockdata*/}
const mockModules: Module[] = [
  {
    id: '1',
    code: 'CSI311',
    name: 'Data Structures & Algorithms',
    credits: 3,
    instructor: 'Dr. Sarah Johnson',
    difficulty: 'hard',
    color: 'from-orange-500 to-red-500',
    classSchedule: [
      { day: 'Monday', startTime: '09:00', endTime: '11:00', location: 'Lecture Hall A', type: 'lecture' },
      { day: 'Wednesday', startTime: '14:00', endTime: '16:00', location: 'Lab B', type: 'lab' }
    ],
    assessments: {
      ca: {
        weight: 40,
        components: [
          { name: 'Assignment 1', weight: 10, score: 8, maxScore: 10 },
          { name: 'Assignment 2', weight: 10, score: 6, maxScore: 10 },
          { name: 'CA Test 1', weight: 10, maxScore: 10, dueDate: '2025-11-30' },
          { name: 'CA Test 2', weight: 10, maxScore: 10, dueDate: '2025-12-10' }
        ]
      },
      finalExam: {
        weight: 60,
        date: '2025-12-15'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 75
  },
  {
    id: '2',
    code: 'MAT201',
    name: 'Calculus II',
    credits: 3,
    instructor: 'Prof. Michael Chen',
    difficulty: 'medium',
    color: 'from-blue-500 to-cyan-500',
    classSchedule: [
      { day: 'Tuesday', startTime: '10:00', endTime: '12:00', location: 'Math Building 201', type: 'lecture' },
      { day: 'Thursday', startTime: '10:00', endTime: '12:00', location: 'Math Building 201', type: 'tutorial' }
    ],
    assessments: {
      ca: {
        weight: 30,
        components: [
          { name: 'Quiz 1', weight: 10, score: 9, maxScore: 10 },
          { name: 'Quiz 2', weight: 10, score: 7, maxScore: 10 },
          { name: 'Midterm', weight: 10, maxScore: 10, dueDate: '2025-11-28' }
        ]
      },
      finalExam: {
        weight: 70,
        date: '2025-12-18'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 80
  },
  {
    id: '3',
    code: 'PHY101',
    name: 'Physics for Engineers',
    credits: 4,
    instructor: 'Dr. Emily Rodriguez',
    difficulty: 'medium',
    color: 'from-green-500 to-emerald-500',
    classSchedule: [
      { day: 'Monday', startTime: '14:00', endTime: '16:00', location: 'Science Block 3', type: 'lecture' },
      { day: 'Friday', startTime: '09:00', endTime: '11:00', location: 'Physics Lab', type: 'lab' }
    ],
    assessments: {
      ca: {
        weight: 40,
        components: [
          { name: 'Lab Report 1', weight: 10, score: 8.5, maxScore: 10 },
          { name: 'Lab Report 2', weight: 10, maxScore: 10, dueDate: '2025-12-01' },
          { name: 'CA Test', weight: 20, maxScore: 20, dueDate: '2025-12-08' }
        ]
      },
      finalExam: {
        weight: 60,
        date: '2025-12-20'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 70
  },
  {
    id: '4',
    code: 'ENG102',
    name: 'Technical Communication',
    credits: 2,
    instructor: 'Ms. Amanda Williams',
    difficulty: 'easy',
    color: 'from-purple-500 to-pink-500',
    classSchedule: [
      { day: 'Wednesday', startTime: '16:00', endTime: '18:00', location: 'Humanities 105', type: 'lecture' }
    ],
    assessments: {
      ca: {
        weight: 50,
        components: [
          { name: 'Essay 1', weight: 15, score: 13, maxScore: 15 },
          { name: 'Presentation', weight: 15, score: 12, maxScore: 15 },
          { name: 'Essay 2', weight: 20, maxScore: 20, dueDate: '2025-12-05' }
        ]
      },
      finalExam: {
        weight: 50,
        date: '2025-12-12'
      },
      dpRequirement: 40,
      passingMark: 50
    },
    targetGrade: 85
  }
];
