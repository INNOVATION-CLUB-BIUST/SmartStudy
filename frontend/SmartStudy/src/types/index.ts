// Core data models for StudyPlanner application

export interface User {
  id: string;
  name: string;
  institution: string;
  courses: Course[];
  studyPreferences: StudyPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  schedule: ClassSchedule[];
  weeklyGoals: string;
  color: string;
}

export interface WeeklyGoal {
  id: string;
  courseId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  targetHours: number;
  currentProgress: number;
  isCompleted: boolean;
  createdAt: Date;
}

// Onboarding form data types
export interface ProfileData {
  name?: string;
  institution?: string;
  courses?: Course[];
  studyHabits?: string[];
}

export interface ScheduleData {
  classSchedules?: ClassSchedule[];
  commitments?: TimeSlot[];
}

export interface StudyTimesData {
  studyStyle?: 'gradual' | 'crammer';
  dailyStudyLimit?: number;
  preferredTimes?: TimeSlot[];
  morningPreference?: boolean;
  nightPreference?: boolean;
}

export interface GoalsData {
  weeklyGoals?: WeeklyGoal[];
}

export interface EventPrepData {
  assignments?: Partial<Assignment>[];
  exams?: unknown[];
}

export interface OptimizationData {
  preferredTechniques?: StudyTechnique[];
  breakPreferences?: BreakPreferences;
}

export interface OnboardingFormData {
  profile: ProfileData;
  schedule: ScheduleData;
  studyTimes: StudyTimesData;
  goals: GoalsData;
  eventPrep: EventPrepData;
  optimization: OptimizationData;
}

export interface ClassSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  location?: string;
}

export interface StudyPreferences {
  preferredTimes: TimeSlot[];
  studyStyle: 'gradual' | 'crammer';
  dailyStudyLimit: number;
  preferredTechniques: StudyTechnique[];
  breakPreferences: BreakPreferences;
}

export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  dayOfWeek?: number; // Optional: specific day, otherwise applies to all days
}

export type StudyTechnique = 'pomodoro' | 'deep-work' | 'spaced-repetition' | 'active-recall';

export interface BreakPreferences {
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  longBreakInterval: number; // after how many short breaks
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  breakdown: StudySession[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface StudySession {
  id: string;
  assignmentId: string;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number; // minutes
  technique: StudyTechnique;
  status: 'scheduled' | 'completed' | 'skipped';
  actualDuration?: number; // minutes
  effectiveness?: number; // 1-5 rating
}

export interface AppState {
  user: User | null;
  courses: Course[];
  assignments: Assignment[];
  sessions: StudySession[];
  currentSession: StudySession | null;
  analytics: AnalyticsData;
  ui: UIState;
}

export interface UIState {
  isOnboarding: boolean;
  currentStep: number;
  isStudyMode: boolean;
  activeTimer: Timer | null;
  notifications: Notification[];
}

export interface Timer {
  id: string;
  type: StudyTechnique;
  duration: number; // minutes
  remainingTime: number; // seconds
  isRunning: boolean;
  isPaused: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface AnalyticsData {
  weeklyHours: number;
  completionRate: number;
  techniqueEffectiveness: Record<StudyTechnique, number>;
  courseProgress: Record<string, number>;
  studyStreak: number;
}

// API and Service interfaces
export interface StorageService {
  save<T>(key: string, data: T): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface AIService {
  setApiKey(key: string): void;
  updateConfig(config: unknown): void;
  isConfigured(): boolean;
  breakdownAssignment(assignment: Partial<Assignment>): Promise<StudySession[]>;
  generateStudyPlan(assignments: Assignment[], preferences: StudyPreferences, existingCommitments?: ClassSchedule[]): Promise<StudySession[]>;
  optimizeSchedule(sessions: StudySession[], constraints: ScheduleConstraints): Promise<StudySession[]>;
  rebalanceSchedule(allSessions: StudySession[], missedSessions: StudySession[], constraints: ScheduleConstraints): StudySession[];
}

export interface ScheduleConstraints {
  existingCommitments: ClassSchedule[];
  preferredTimes: TimeSlot[];
  dailyStudyLimit: number;
  studyStyle: 'gradual' | 'crammer';
}

export interface Conflict {
  sessionId: string;
  conflictType: 'time-overlap' | 'daily-limit-exceeded' | 'preference-violation';
  description: string;
  suggestedResolution?: string;
}

// Route types
export type RouteParams = {
  onboarding: undefined;
  dashboard: undefined;
  'study-mode': { sessionId?: string };
  analytics: undefined;
  settings: undefined;
};