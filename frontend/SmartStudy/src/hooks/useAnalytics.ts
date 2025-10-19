import { useState, useEffect } from 'react';
import type { AnalyticsData, StudyTechnique, Course } from '../types';

export interface StudySessionData {
  id: string;
  date: Date;
  duration: number; // minutes
  technique: StudyTechnique;
  courseId: string;
  effectiveness: number; // 1-5 rating
  focusScore: number; // 0-100
}

export interface WeeklyData {
  week: string;
  hours: number;
  sessions: number;
  averageFocus: number;
  completionRate: number;
}

export interface CoursePerformance {
  id: string;
  name: string;
  progress: number;
  hoursStudied: number;
  averageScore: number;
  sessions: number;
}

const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
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
  });

  const [studySessions, setStudySessions] = useState<StudySessionData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data from localStorage
  useEffect(() => {
    const loadAnalyticsData = () => {
      try {
        // Load study sessions
        const savedSessions = localStorage.getItem('smartstudy-sessions');
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
            ...session,
            date: new Date(session.date)
          }));
          setStudySessions(parsedSessions);
        } else {
          // Initialize with sample data
          const sampleSessions: StudySessionData[] = [
            {
              id: '1',
              date: new Date('2024-02-20'),
              duration: 120,
              technique: 'pomodoro',
              courseId: 'math-101',
              effectiveness: 4,
              focusScore: 85
            },
            {
              id: '2',
              date: new Date('2024-02-19'),
              duration: 90,
              technique: 'deep-work',
              courseId: 'physics-101',
              effectiveness: 5,
              focusScore: 92
            },
            {
              id: '3',
              date: new Date('2024-02-18'),
              duration: 150,
              technique: 'active-recall',
              courseId: 'chemistry-101',
              effectiveness: 3,
              focusScore: 78
            },
            {
              id: '4',
              date: new Date('2024-02-17'),
              duration: 100,
              technique: 'pomodoro',
              courseId: 'math-101',
              effectiveness: 4,
              focusScore: 88
            },
            {
              id: '5',
              date: new Date('2024-02-16'),
              duration: 180,
              technique: 'spaced-repetition',
              courseId: 'biology-101',
              effectiveness: 4,
              focusScore: 82
            },
            {
              id: '6',
              date: new Date('2024-02-15'),
              duration: 120,
              technique: 'deep-work',
              courseId: 'physics-101',
              effectiveness: 5,
              focusScore: 90
            },
            {
              id: '7',
              date: new Date('2024-02-14'),
              duration: 90,
              technique: 'pomodoro',
              courseId: 'chemistry-101',
              effectiveness: 3,
              focusScore: 75
            }
          ];
          setStudySessions(sampleSessions);
          saveSessions(sampleSessions);
        }

        // Load weekly data
        const savedWeeklyData = localStorage.getItem('smartstudy-weekly-data');
        if (savedWeeklyData) {
          const parsedWeeklyData = JSON.parse(savedWeeklyData).map((week: any) => ({
            ...week,
            week: week.week
          }));
          setWeeklyData(parsedWeeklyData);
        } else {
          // Generate sample weekly data
          const sampleWeeklyData: WeeklyData[] = [
            { week: 'Week 1', hours: 12.5, sessions: 8, averageFocus: 82, completionRate: 75 },
            { week: 'Week 2', hours: 15.2, sessions: 10, averageFocus: 85, completionRate: 80 },
            { week: 'Week 3', hours: 18.7, sessions: 12, averageFocus: 88, completionRate: 85 },
            { week: 'Week 4', hours: 16.3, sessions: 11, averageFocus: 86, completionRate: 82 },
            { week: 'Week 5', hours: 20.1, sessions: 14, averageFocus: 90, completionRate: 88 },
            { week: 'Week 6', hours: 17.8, sessions: 13, averageFocus: 87, completionRate: 85 }
          ];
          setWeeklyData(sampleWeeklyData);
          saveWeeklyData(sampleWeeklyData);
        }

        // Calculate analytics data
        calculateAnalyticsData();
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error loading analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  // Save data to localStorage
  const saveSessions = (sessions: StudySessionData[]) => {
    try {
      localStorage.setItem('smartstudy-sessions', JSON.stringify(sessions));
    } catch (err) {
      console.error('Error saving sessions:', err);
    }
  };

  const saveWeeklyData = (data: WeeklyData[]) => {
    try {
      localStorage.setItem('smartstudy-weekly-data', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving weekly data:', err);
    }
  };

  // Calculate analytics data from sessions
  const calculateAnalyticsData = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter sessions from the last week
    const recentSessions = studySessions.filter(session => session.date >= oneWeekAgo);
    
    // Calculate weekly hours
    const weeklyHours = recentSessions.reduce((total, session) => total + (session.duration / 60), 0);
    
    // Calculate completion rate (mock data for now)
    const completionRate = Math.round(Math.random() * 20 + 75); // 75-95%
    
    // Calculate technique effectiveness
    const techniqueEffectiveness = {
      'pomodoro': 0,
      'deep-work': 0,
      'spaced-repetition': 0,
      'active-recall': 0,
    };

    // Calculate average effectiveness for each technique
    Object.keys(techniqueEffectiveness).forEach(technique => {
      const techniqueSessions = recentSessions.filter(s => s.technique === technique);
      if (techniqueSessions.length > 0) {
        const avgEffectiveness = techniqueSessions.reduce((sum, s) => sum + s.effectiveness, 0) / techniqueSessions.length;
        techniqueEffectiveness[technique as StudyTechnique] = Math.round(avgEffectiveness * 20); // Convert to percentage
      }
    });

    // Calculate study streak
    const studyStreak = calculateStudyStreak();

    // Calculate course progress
    const courseProgress: Record<string, number> = {};
    const courseSessions = recentSessions.reduce((acc, session) => {
      if (!acc[session.courseId]) {
        acc[session.courseId] = [];
      }
      acc[session.courseId].push(session);
      return acc;
    }, {} as Record<string, StudySessionData[]>);

    Object.keys(courseSessions).forEach(courseId => {
      const sessions = courseSessions[courseId];
      const totalHours = sessions.reduce((sum, s) => sum + (s.duration / 60), 0);
      const avgFocus = sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length;
      courseProgress[courseId] = Math.round((totalHours / 20) * 100); // Assume 20 hours is 100% progress
    });

    setAnalyticsData({
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      completionRate,
      techniqueEffectiveness,
      courseProgress,
      studyStreak
    });
  };

  // Calculate study streak
  const calculateStudyStreak = (): number => {
    const sortedSessions = [...studySessions].sort((a, b) => b.date.getTime() - a.date.getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) { // Check last 30 days
      const hasStudySession = sortedSessions.some(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === currentDate.getTime();
      });

      if (hasStudySession) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Get study streak
  const getStudyStreak = (): number => {
    return analyticsData.studyStreak;
  };

  // Get weekly hours
  const getWeeklyHours = (): number => {
    return analyticsData.weeklyHours;
  };

  // Get completion rate
  const getCompletionRate = (): number => {
    return analyticsData.completionRate;
  };

  // Get top performing courses
  const getTopPerformingCourses = (): CoursePerformance[] => {
    const coursePerformance: CoursePerformance[] = [];
    
    Object.keys(analyticsData.courseProgress).forEach(courseId => {
      const courseSessions = studySessions.filter(s => s.courseId === courseId);
      const totalHours = courseSessions.reduce((sum, s) => sum + (s.duration / 60), 0);
      const avgFocus = courseSessions.length > 0 
        ? courseSessions.reduce((sum, s) => sum + s.focusScore, 0) / courseSessions.length 
        : 0;

      coursePerformance.push({
        id: courseId,
        name: getCourseName(courseId),
        progress: analyticsData.courseProgress[courseId],
        hoursStudied: Math.round(totalHours * 10) / 10,
        averageScore: Math.round(avgFocus),
        sessions: courseSessions.length
      });
    });

    return coursePerformance.sort((a, b) => b.progress - a.progress);
  };

  // Get study technique effectiveness
  const getStudyTechniqueEffectiveness = () => {
    return analyticsData.techniqueEffectiveness;
  };

  // Get weekly data for charts
  const getWeeklyData = () => {
    return weeklyData;
  };

  // Get study sessions data
  const getStudySessions = () => {
    return studySessions;
  };

  // Add new study session
  const addStudySession = (session: Omit<StudySessionData, 'id'>) => {
    const newSession: StudySessionData = {
      ...session,
      id: Date.now().toString()
    };

    const updatedSessions = [...studySessions, newSession];
    setStudySessions(updatedSessions);
    saveSessions(updatedSessions);
    calculateAnalyticsData();
  };

  // Helper function to get course name
  const getCourseName = (courseId: string): string => {
    const courseNames: Record<string, string> = {
      'math-101': 'Mathematics',
      'physics-101': 'Physics',
      'chemistry-101': 'Chemistry',
      'biology-101': 'Biology',
      'english-101': 'English',
      'history-101': 'History'
    };
    return courseNames[courseId] || courseId;
  };

  return {
    analyticsData,
    studySessions,
    weeklyData,
    loading,
    error,
    getStudyStreak,
    getWeeklyHours,
    getCompletionRate,
    getTopPerformingCourses,
    getStudyTechniqueEffectiveness,
    getWeeklyData,
    getStudySessions,
    addStudySession
  };
};

export default useAnalytics;
