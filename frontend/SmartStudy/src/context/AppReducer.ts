import type { 
  AppState, 
  User, 
  Course, 
  Assignment, 
  StudySession, 
  AnalyticsData, 
  UIState, 
  Notification,
  Timer 
} from '../types';

// Action types
export type AppAction =
  // User actions
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_USER' }
  
  // Course actions
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: { id: string; updates: Partial<Course> } }
  | { type: 'REMOVE_COURSE'; payload: string }
  
  // Assignment actions
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: { id: string; updates: Partial<Assignment> } }
  | { type: 'REMOVE_ASSIGNMENT'; payload: string }
  
  // Session actions
  | { type: 'SET_SESSIONS'; payload: StudySession[] }
  | { type: 'ADD_SESSION'; payload: StudySession }
  | { type: 'UPDATE_SESSION'; payload: { id: string; updates: Partial<StudySession> } }
  | { type: 'REMOVE_SESSION'; payload: string }
  | { type: 'SET_CURRENT_SESSION'; payload: StudySession | null }
  
  // Analytics actions
  | { type: 'SET_ANALYTICS'; payload: AnalyticsData }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<AnalyticsData> }
  
  // UI actions
  | { type: 'SET_UI_STATE'; payload: UIState }
  | { type: 'UPDATE_UI_STATE'; payload: Partial<UIState> }
  | { type: 'SET_ONBOARDING_STEP'; payload: number }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'START_STUDY_MODE'; payload?: StudySession }
  | { type: 'EXIT_STUDY_MODE' }
  | { type: 'SET_ACTIVE_TIMER'; payload: Timer | null }
  
  // Notification actions
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

// Reducer function
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // User actions
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'UPDATE_USER':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          updatedAt: new Date(),
        },
      };

    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        courses: [],
        assignments: [],
        sessions: [],
        currentSession: null,
        ui: {
          ...state.ui,
          isOnboarding: true,
          currentStep: 0,
          isStudyMode: false,
          activeTimer: null,
        },
      };

    // Course actions
    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload,
      };

    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };

    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.id
            ? { ...course, ...action.payload.updates }
            : course
        ),
      };

    case 'REMOVE_COURSE':
      return {
        ...state,
        courses: state.courses.filter(course => course.id !== action.payload),
        // Also remove related assignments and sessions
        assignments: state.assignments.filter(assignment => assignment.courseId !== action.payload),
        sessions: state.sessions.filter(session => {
          const assignment = state.assignments.find(a => a.id === session.assignmentId);
          return assignment?.courseId !== action.payload;
        }),
      };

    // Assignment actions
    case 'SET_ASSIGNMENTS':
      return {
        ...state,
        assignments: action.payload,
      };

    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [...state.assignments, action.payload],
      };

    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.id
            ? { ...assignment, ...action.payload.updates }
            : assignment
        ),
      };

    case 'REMOVE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(assignment => assignment.id !== action.payload),
        // Also remove related sessions
        sessions: state.sessions.filter(session => session.assignmentId !== action.payload),
        // Clear current session if it belongs to this assignment
        currentSession: state.currentSession?.assignmentId === action.payload ? null : state.currentSession,
      };

    // Session actions
    case 'SET_SESSIONS':
      return {
        ...state,
        sessions: action.payload,
      };

    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
      };

    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id
            ? { ...session, ...action.payload.updates }
            : session
        ),
        // Update current session if it's the one being updated
        currentSession: state.currentSession?.id === action.payload.id
          ? { ...state.currentSession, ...action.payload.updates }
          : state.currentSession,
      };

    case 'REMOVE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload),
        // Clear current session if it's the one being removed
        currentSession: state.currentSession?.id === action.payload ? null : state.currentSession,
      };

    case 'SET_CURRENT_SESSION':
      return {
        ...state,
        currentSession: action.payload,
      };

    // Analytics actions
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
      };

    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload,
        },
      };

    // UI actions
    case 'SET_UI_STATE':
      return {
        ...state,
        ui: action.payload,
      };

    case 'UPDATE_UI_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload,
        },
      };

    case 'SET_ONBOARDING_STEP':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentStep: action.payload,
        },
      };

    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        ui: {
          ...state.ui,
          isOnboarding: false,
          currentStep: 0,
        },
      };

    case 'START_STUDY_MODE':
      return {
        ...state,
        ui: {
          ...state.ui,
          isStudyMode: true,
        },
        currentSession: action.payload || state.currentSession,
      };

    case 'EXIT_STUDY_MODE':
      return {
        ...state,
        ui: {
          ...state.ui,
          isStudyMode: false,
          activeTimer: null,
        },
        currentSession: null,
      };

    case 'SET_ACTIVE_TIMER':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeTimer: action.payload,
        },
      };

    // Notification actions
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload],
        },
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notification => notification.id !== action.payload
          ),
        },
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.map(notification =>
            notification.id === action.payload
              ? { ...notification, isRead: true }
              : notification
          ),
        },
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [],
        },
      };

    default:
      return state;
  }
};