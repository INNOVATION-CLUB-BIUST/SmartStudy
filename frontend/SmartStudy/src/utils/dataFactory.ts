// Data factory utilities for creating default objects and test data

// Data factory utilities for creating default objects and test data
import type {
  User,
  Course,
  Assignment,
  StudySession,
  StudyPreferences,
  TimeSlot,
  ClassSchedule,
  StudyTechnique,
  BreakPreferences
} from '../types';
import { generateId, getRandomColor } from './index';

// Default factory functions for creating new objects with sensible defaults

export const createDefaultBreakPreferences = (): BreakPreferences => ({
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4
});

export const createDefaultStudyPreferences = (overrides: Partial<StudyPreferences> = {}): StudyPreferences => ({
  preferredTimes: [],
  studyStyle: 'gradual',
  dailyStudyLimit: 240, // 4 hours
  preferredTechniques: ['pomodoro'],
  breakPreferences: createDefaultBreakPreferences(),
  ...overrides
});

export const createDefaultTimeSlot = (overrides: Partial<TimeSlot> = {}): TimeSlot => ({
  startTime: '09:00',
  endTime: '10:30',
  ...overrides
});

export const createDefaultClassSchedule = (overrides: Partial<ClassSchedule> = {}): ClassSchedule => ({
  dayOfWeek: 1, // Monday
  startTime: '09:00',
  endTime: '10:30',
  location: 'Room 101',
  ...overrides
});

export const createDefaultCourse = (overrides: Partial<Course> = {}): Course => ({
  id: generateId(),
  name: 'Sample Course',
  code: 'COURSE101',
  schedule: [],
  weeklyGoals: 'Complete assignments and review lectures',
  color: getRandomColor(),
  ...overrides
});

export const createDefaultUser = (overrides: Partial<User> = {}): User => ({
  id: generateId(),
  name: 'John Doe',
  institution: 'University of Example',
  courses: [],
  studyPreferences: createDefaultStudyPreferences(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

export const createDefaultStudySession = (overrides: Partial<StudySession> = {}): StudySession => ({
  id: generateId(),
  assignmentId: 'assignment_' + generateId(),
  title: 'Study Session',
  description: 'Review course material',
  scheduledDate: new Date(),
  duration: 60,
  technique: 'pomodoro',
  status: 'scheduled',
  ...overrides
});

export const createDefaultAssignment = (overrides: Partial<Assignment> = {}): Assignment => ({
  id: generateId(),
  courseId: 'course_' + generateId(),
  title: 'Assignment',
  description: 'Complete the assignment tasks',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  difficulty: 'medium',
  estimatedHours: 10,
  breakdown: [],
  status: 'pending',
  ...overrides
});

// Batch creation utilities

export const createMultipleCourses = (count: number, baseOverrides: Partial<Course> = {}): Course[] => {
  return Array.from({ length: count }, (_, index) =>
    createDefaultCourse({
      ...baseOverrides,
      name: `Course ${index + 1}`,
      code: `COURSE${(index + 1).toString().padStart(3, '0')}`
    })
  );
};

export const createMultipleAssignments = (count: number, courseId: string, baseOverrides: Partial<Assignment> = {}): Assignment[] => {
  return Array.from({ length: count }, (_, index) =>
    createDefaultAssignment({
      ...baseOverrides,
      courseId,
      title: `Assignment ${index + 1}`,
      dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000) // Spread over weeks
    })
  );
};

export const createMultipleStudySessions = (count: number, assignmentId: string, baseOverrides: Partial<StudySession> = {}): StudySession[] => {
  return Array.from({ length: count }, (_, index) =>
    createDefaultStudySession({
      ...baseOverrides,
      assignmentId,
      title: `Study Session ${index + 1}`,
      scheduledDate: new Date(Date.now() + index * 24 * 60 * 60 * 1000) // Daily sessions
    })
  );
};

// Utility functions for creating realistic test data

export const createWeeklySchedule = (_courseId: string, courseName: string): ClassSchedule[] => {
  return [
    {
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '10:30',
      location: `${courseName} - Lecture Hall A`
    },
    {
      dayOfWeek: 3, // Wednesday
      startTime: '09:00',
      endTime: '10:30',
      location: `${courseName} - Lecture Hall A`
    },
    {
      dayOfWeek: 5, // Friday
      startTime: '14:00',
      endTime: '15:30',
      location: `${courseName} - Lab Room B`
    }
  ];
};

export const createStudentSchedule = (): TimeSlot[] => {
  return [
    { startTime: '08:00', endTime: '12:00' }, // Morning block
    { startTime: '14:00', endTime: '18:00' }, // Afternoon block
    { startTime: '19:00', endTime: '21:00' }  // Evening block
  ];
};

export const createSampleTechniques = (): StudyTechnique[] => {
  return ['pomodoro', 'deep-work', 'spaced-repetition', 'active-recall'];
};

// Validation helpers for factory functions

export const isValidFactoryInput = <T>(input: Partial<T>, requiredFields: (keyof T)[]): boolean => {
  return requiredFields.every(field => input[field] !== undefined);
};

export const mergeWithDefaults = <T>(defaults: T, overrides: Partial<T>): T => {
  return { ...defaults, ...overrides };
};

// Sample data generators for development and testing

export const generateSampleUser = (): User => {
  const courses = createMultipleCourses(3);

  // Add schedules to courses
  courses.forEach(course => {
    course.schedule = createWeeklySchedule(course.id, course.name);
  });

  return createDefaultUser({
    name: 'Alice Johnson',
    institution: 'Tech University',
    courses,
    studyPreferences: createDefaultStudyPreferences({
      preferredTimes: createStudentSchedule(),
      studyStyle: 'gradual',
      dailyStudyLimit: 300, // 5 hours
      preferredTechniques: ['pomodoro', 'deep-work']
    })
  });
};

export const generateSampleAssignmentsWithSessions = (courseId: string): Assignment[] => {
  const assignments = createMultipleAssignments(2, courseId);

  assignments.forEach(assignment => {
    assignment.breakdown = createMultipleStudySessions(3, assignment.id);
  });

  return assignments;
};