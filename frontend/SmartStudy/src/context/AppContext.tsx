import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, User, Course, Assignment, StudySession, AnalyticsData, UIState } from '../types';
import { appReducer, type AppAction } from './AppReducer';
import StorageService from '../services/StorageService';

// Initial state
const initialUIState: UIState = {
  isOnboarding: false,
  currentStep: 0,
  isStudyMode: false,
  activeTimer: null,
  notifications: [],
};

const initialAnalyticsData: AnalyticsData = {
  weeklyHours: 0,
  completionRate: 0,
  techniqueEffectiveness: {
    'pomodoro': 0,
    'deep-work': 0,
    'spaced-repetition': 0,
    'active-recall': 0,
  },
  courseProgress: {},
  studyStreak: 0,
};

const initialState: AppState = {
  user: null,
  courses: [],
  assignments: [],
  sessions: [],
  currentSession: null,
  analytics: initialAnalyticsData,
  ui: initialUIState,
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load user data
        const userData = await StorageService.load<User>('user');
        if (userData) {
          dispatch({ type: 'SET_USER', payload: userData });
        } else {
          // No user data means we need onboarding
          dispatch({ type: 'SET_UI_STATE', payload: { ...state.ui, isOnboarding: true } });
        }

        // Load courses
        const coursesData = await StorageService.load<Course[]>('courses');
        if (coursesData) {
          dispatch({ type: 'SET_COURSES', payload: coursesData });
        }

        // Load assignments
        const assignmentsData = await StorageService.load<Assignment[]>('assignments');
        if (assignmentsData) {
          dispatch({ type: 'SET_ASSIGNMENTS', payload: assignmentsData });
        }

        // Load sessions
        const sessionsData = await StorageService.load<StudySession[]>('sessions');
        if (sessionsData) {
          dispatch({ type: 'SET_SESSIONS', payload: sessionsData });
        }

        // Load analytics
        const analyticsData = await StorageService.load<AnalyticsData>('analytics');
        if (analyticsData) {
          dispatch({ type: 'SET_ANALYTICS', payload: analyticsData });
        }

        // Load UI state (excluding onboarding flag which we set above)
        const uiData = await StorageService.load<Partial<UIState>>('ui');
        if (uiData) {
          dispatch({ 
            type: 'SET_UI_STATE', 
            payload: { 
              ...state.ui, 
              ...uiData,
              // Keep onboarding state as determined above
              isOnboarding: userData ? false : true 
            } 
          });
        }

      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Add error notification
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now().toString(),
            type: 'error',
            message: 'Failed to load saved data. Starting fresh.',
            timestamp: new Date(),
            isRead: false,
          },
        });
      }
    };

    loadInitialData();
  }, []);

  // Auto-save data to localStorage when state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (state.user) {
          await StorageService.save('user', state.user);
        }
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    };

    if (state.user) {
      saveData();
    }
  }, [state.user]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await StorageService.save('courses', state.courses);
      } catch (error) {
        console.error('Failed to save courses data:', error);
      }
    };

    saveData();
  }, [state.courses]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await StorageService.save('assignments', state.assignments);
      } catch (error) {
        console.error('Failed to save assignments data:', error);
      }
    };

    saveData();
  }, [state.assignments]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await StorageService.save('sessions', state.sessions);
      } catch (error) {
        console.error('Failed to save sessions data:', error);
      }
    };

    saveData();
  }, [state.sessions]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await StorageService.save('analytics', state.analytics);
      } catch (error) {
        console.error('Failed to save analytics data:', error);
      }
    };

    saveData();
  }, [state.analytics]);

  useEffect(() => {
    const saveData = async () => {
      try {
        // Save UI state but exclude temporary states like notifications
        const uiToSave = {
          currentStep: state.ui.currentStep,
          isStudyMode: state.ui.isStudyMode,
          activeTimer: state.ui.activeTimer,
        };
        await StorageService.save('ui', uiToSave);
      } catch (error) {
        console.error('Failed to save UI state:', error);
      }
    };

    saveData();
  }, [state.ui.currentStep, state.ui.isStudyMode, state.ui.activeTimer]);

  const value = {
    state,
    dispatch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;