// Utility functions for StudyPlanner application

import type { 
  //User, 
  //Course, 
  Assignment, 
  StudySession, 
  StudyTechnique,
  TimeSlot,
  //ClassSchedule 
} from '../types';

// Time and Date Formatting
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
};

export const formatTimeDetailed = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  }
  
  if (mins === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

export const formatTimeOnly = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Tomorrow';
  if (diffInDays === -1) return 'Yesterday';
  if (diffInDays > 1 && diffInDays <= 7) return `In ${diffInDays} days`;
  if (diffInDays < -1 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`;
  
  return formatDate(date);
};

// ID Generation and Validation
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Calculation Utilities
export const calculateCompletionRate = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateProgress = (sessions: StudySession[]): { completed: number; total: number; percentage: number } => {
  const total = sessions.length;
  const completed = sessions.filter(session => session.status === 'completed').length;
  const percentage = calculateCompletionRate(completed, total);
  
  return { completed, total, percentage };
};

export const calculateTotalStudyTime = (sessions: StudySession[]): number => {
  return sessions
    .filter(session => session.status === 'completed')
    .reduce((total, session) => total + (session.actualDuration || session.duration), 0);
};

export const calculateAverageEffectiveness = (sessions: StudySession[]): number => {
  const completedSessions = sessions.filter(session => 
    session.status === 'completed' && session.effectiveness !== undefined
  );
  
  if (completedSessions.length === 0) return 0;
  
  const totalEffectiveness = completedSessions.reduce((sum, session) => 
    sum + (session.effectiveness || 0), 0
  );
  
  return Math.round((totalEffectiveness / completedSessions.length) * 10) / 10;
};

// Date Utilities
export const getDayOfWeek = (date: Date): number => {
  return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
};

export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
};

export const getShortDayName = (dayOfWeek: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayOfWeek] || 'Unknown';
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = addDays(new Date(), 1);
  return isSameDay(date, tomorrow);
};

export const isOverdue = (date: Date): boolean => {
  const now = new Date();
  return date < now && !isSameDay(date, now);
};

export const getWeekStart = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day;
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = addDays(weekStart, 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

export const getMonthStart = (date: Date): Date => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getMonthEnd = (date: Date): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Data Transformation Utilities
export const groupSessionsByDate = (sessions: StudySession[]): Record<string, StudySession[]> => {
  return sessions.reduce((groups, session) => {
    const dateKey = session.scheduledDate.toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, StudySession[]>);
};

export const groupSessionsByCourse = (sessions: StudySession[], assignments: Assignment[]): Record<string, StudySession[]> => {
  const assignmentMap = new Map(assignments.map(a => [a.id, a.courseId]));
  
  return sessions.reduce((groups, session) => {
    const courseId = assignmentMap.get(session.assignmentId) || 'unknown';
    if (!groups[courseId]) {
      groups[courseId] = [];
    }
    groups[courseId].push(session);
    return groups;
  }, {} as Record<string, StudySession[]>);
};

export const sortSessionsByDate = (sessions: StudySession[]): StudySession[] => {
  return [...sessions].sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
};

export const sortAssignmentsByDueDate = (assignments: Assignment[]): Assignment[] => {
  return [...assignments].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

export const filterUpcomingSessions = (sessions: StudySession[], days: number = 7): StudySession[] => {
  const now = new Date();
  const futureDate = addDays(now, days);
  
  return sessions.filter(session => 
    session.scheduledDate >= now && session.scheduledDate <= futureDate
  );
};

export const filterOverdueSessions = (sessions: StudySession[]): StudySession[] => {
  const now = new Date();
  return sessions.filter(session => 
    session.scheduledDate < now && session.status === 'scheduled'
  );
};

// Study Technique Utilities
export const getTechniqueDisplayName = (technique: StudyTechnique): string => {
  const names: Record<StudyTechnique, string> = {
    'pomodoro': 'Pomodoro Technique',
    'deep-work': 'Deep Work',
    'spaced-repetition': 'Spaced Repetition',
    'active-recall': 'Active Recall'
  };
  return names[technique] || technique;
};

export const getTechniqueDescription = (technique: StudyTechnique): string => {
  const descriptions: Record<StudyTechnique, string> = {
    'pomodoro': '25-minute focused work sessions with 5-minute breaks',
    'deep-work': 'Extended periods of focused, uninterrupted work',
    'spaced-repetition': 'Review material at increasing intervals',
    'active-recall': 'Test yourself on material without looking at notes'
  };
  return descriptions[technique] || 'Unknown technique';
};

export const getRecommendedDuration = (technique: StudyTechnique): number => {
  const durations: Record<StudyTechnique, number> = {
    'pomodoro': 25,
    'deep-work': 90,
    'spaced-repetition': 30,
    'active-recall': 45
  };
  return durations[technique] || 30;
};

// Time Slot Utilities
export const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

export const timeStringToMinutes = (timeStr: string): number => {
  const { hours, minutes } = parseTimeString(timeStr);
  return hours * 60 + minutes;
};

export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const isTimeSlotOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  if (slot1.dayOfWeek !== undefined && slot2.dayOfWeek !== undefined && slot1.dayOfWeek !== slot2.dayOfWeek) {
    return false;
  }
  
  const start1 = timeStringToMinutes(slot1.startTime);
  const end1 = timeStringToMinutes(slot1.endTime);
  const start2 = timeStringToMinutes(slot2.startTime);
  const end2 = timeStringToMinutes(slot2.endTime);
  
  return start1 < end2 && start2 < end1;
};

export const getTimeSlotDuration = (slot: TimeSlot): number => {
  const start = timeStringToMinutes(slot.startTime);
  const end = timeStringToMinutes(slot.endTime);
  return end - start;
};

// Color Utilities
export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  const colors = {
    easy: '#10B981',    // Green
    medium: '#F59E0B',  // Yellow
    hard: '#EF4444'     // Red
  };
  return colors[difficulty];
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#6B7280',      // Gray
    'in-progress': '#3B82F6', // Blue
    completed: '#10B981',     // Green
    scheduled: '#8B5CF6',     // Purple
    skipped: '#EF4444'        // Red
  };
  return colors[status] || '#6B7280';
};

// Export validation utilities
export * from './validation';

// Export data factory utilities
export * from './dataFactory';