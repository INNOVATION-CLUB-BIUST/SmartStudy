// Data validation functions for StudyPlanner application

import type{ 
  User, 
  Course, 
  Assignment, 
  StudySession, 
  StudyPreferences, 
  TimeSlot, 
  ClassSchedule,
  StudyTechnique 
} from '../types';

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Helper validation functions
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidDayOfWeek = (day: number): boolean => {
  return Number.isInteger(day) && day >= 0 && day <= 6;
};

export const isValidDuration = (duration: number): boolean => {
  return Number.isInteger(duration) && duration > 0;
};

export const isValidEffectiveness = (effectiveness: number): boolean => {
  return Number.isInteger(effectiveness) && effectiveness >= 1 && effectiveness <= 5;
};

// Core model validation functions
export const validateUser = (user: Partial<User>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!user.id || !isValidId(user.id)) {
    errors.push({ field: 'id', message: 'User ID is required and must be a non-empty string' });
  }

  if (!user.name || typeof user.name !== 'string' || user.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  if (!user.institution || typeof user.institution !== 'string' || user.institution.trim().length === 0) {
    errors.push({ field: 'institution', message: 'Institution is required and must be a non-empty string' });
  }

  if (!user.courses || !Array.isArray(user.courses)) {
    errors.push({ field: 'courses', message: 'Courses must be an array' });
  } else {
    user.courses.forEach((course, index) => {
      const courseValidation = validateCourse(course);
      if (!courseValidation.isValid) {
        courseValidation.errors.forEach(error => {
          errors.push({ 
            field: `courses[${index}].${error.field}`, 
            message: error.message 
          });
        });
      }
    });
  }

  if (user.studyPreferences) {
    const prefsValidation = validateStudyPreferences(user.studyPreferences);
    if (!prefsValidation.isValid) {
      prefsValidation.errors.forEach(error => {
        errors.push({ 
          field: `studyPreferences.${error.field}`, 
          message: error.message 
        });
      });
    }
  }

  if (user.createdAt && !isValidDate(user.createdAt)) {
    errors.push({ field: 'createdAt', message: 'Created date must be a valid Date object' });
  }

  if (user.updatedAt && !isValidDate(user.updatedAt)) {
    errors.push({ field: 'updatedAt', message: 'Updated date must be a valid Date object' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCourse = (course: Partial<Course>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!course.id || !isValidId(course.id)) {
    errors.push({ field: 'id', message: 'Course ID is required and must be a non-empty string' });
  }

  if (!course.name || typeof course.name !== 'string' || course.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Course name is required and must be a non-empty string' });
  }

  if (!course.code || typeof course.code !== 'string' || course.code.trim().length === 0) {
    errors.push({ field: 'code', message: 'Course code is required and must be a non-empty string' });
  }

  if (!course.schedule || !Array.isArray(course.schedule)) {
    errors.push({ field: 'schedule', message: 'Schedule must be an array' });
  } else {
    course.schedule.forEach((scheduleItem, index) => {
      const scheduleValidation = validateClassSchedule(scheduleItem);
      if (!scheduleValidation.isValid) {
        scheduleValidation.errors.forEach(error => {
          errors.push({ 
            field: `schedule[${index}].${error.field}`, 
            message: error.message 
          });
        });
      }
    });
  }

  if (course.weeklyGoals !== undefined && typeof course.weeklyGoals !== 'string') {
    errors.push({ field: 'weeklyGoals', message: 'Weekly goals must be a string' });
  }

  if (!course.color || typeof course.color !== 'string' || course.color.trim().length === 0) {
    errors.push({ field: 'color', message: 'Color is required and must be a non-empty string' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAssignment = (assignment: Partial<Assignment>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!assignment.id || !isValidId(assignment.id)) {
    errors.push({ field: 'id', message: 'Assignment ID is required and must be a non-empty string' });
  }

  if (!assignment.courseId || !isValidId(assignment.courseId)) {
    errors.push({ field: 'courseId', message: 'Course ID is required and must be a non-empty string' });
  }

  if (!assignment.title || typeof assignment.title !== 'string' || assignment.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  if (assignment.description !== undefined && typeof assignment.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (!assignment.dueDate || !isValidDate(assignment.dueDate)) {
    errors.push({ field: 'dueDate', message: 'Due date is required and must be a valid Date object' });
  }

  if (!assignment.difficulty || !['easy', 'medium', 'hard'].includes(assignment.difficulty)) {
    errors.push({ field: 'difficulty', message: 'Difficulty must be one of: easy, medium, hard' });
  }

  if (assignment.estimatedHours === undefined || !isValidDuration(assignment.estimatedHours)) {
    errors.push({ field: 'estimatedHours', message: 'Estimated hours is required and must be a positive integer' });
  }

  if (!assignment.breakdown || !Array.isArray(assignment.breakdown)) {
    errors.push({ field: 'breakdown', message: 'Breakdown must be an array' });
  } else {
    assignment.breakdown.forEach((session, index) => {
      const sessionValidation = validateStudySession(session);
      if (!sessionValidation.isValid) {
        sessionValidation.errors.forEach(error => {
          errors.push({ 
            field: `breakdown[${index}].${error.field}`, 
            message: error.message 
          });
        });
      }
    });
  }

  if (!assignment.status || !['pending', 'in-progress', 'completed'].includes(assignment.status)) {
    errors.push({ field: 'status', message: 'Status must be one of: pending, in-progress, completed' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateStudySession = (session: Partial<StudySession>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!session.id || !isValidId(session.id)) {
    errors.push({ field: 'id', message: 'Session ID is required and must be a non-empty string' });
  }

  if (!session.assignmentId || !isValidId(session.assignmentId)) {
    errors.push({ field: 'assignmentId', message: 'Assignment ID is required and must be a non-empty string' });
  }

  if (!session.title || typeof session.title !== 'string' || session.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  if (session.description !== undefined && typeof session.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (!session.scheduledDate || !isValidDate(session.scheduledDate)) {
    errors.push({ field: 'scheduledDate', message: 'Scheduled date is required and must be a valid Date object' });
  }

  if (session.duration === undefined || !isValidDuration(session.duration)) {
    errors.push({ field: 'duration', message: 'Duration is required and must be a positive integer' });
  }

  const validTechniques: StudyTechnique[] = ['pomodoro', 'deep-work', 'spaced-repetition', 'active-recall'];
  if (!session.technique || !validTechniques.includes(session.technique)) {
    errors.push({ field: 'technique', message: `Technique must be one of: ${validTechniques.join(', ')}` });
  }

  if (!session.status || !['scheduled', 'completed', 'skipped'].includes(session.status)) {
    errors.push({ field: 'status', message: 'Status must be one of: scheduled, completed, skipped' });
  }

  if (session.actualDuration !== undefined && !isValidDuration(session.actualDuration)) {
    errors.push({ field: 'actualDuration', message: 'Actual duration must be a positive integer' });
  }

  if (session.effectiveness !== undefined && !isValidEffectiveness(session.effectiveness)) {
    errors.push({ field: 'effectiveness', message: 'Effectiveness must be an integer between 1 and 5' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateStudyPreferences = (preferences: Partial<StudyPreferences>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!preferences.preferredTimes || !Array.isArray(preferences.preferredTimes)) {
    errors.push({ field: 'preferredTimes', message: 'Preferred times must be an array' });
  } else {
    preferences.preferredTimes.forEach((timeSlot, index) => {
      const timeSlotValidation = validateTimeSlot(timeSlot);
      if (!timeSlotValidation.isValid) {
        timeSlotValidation.errors.forEach(error => {
          errors.push({ 
            field: `preferredTimes[${index}].${error.field}`, 
            message: error.message 
          });
        });
      }
    });
  }

  if (!preferences.studyStyle || !['gradual', 'crammer'].includes(preferences.studyStyle)) {
    errors.push({ field: 'studyStyle', message: 'Study style must be either "gradual" or "crammer"' });
  }

  if (preferences.dailyStudyLimit === undefined || !isValidDuration(preferences.dailyStudyLimit)) {
    errors.push({ field: 'dailyStudyLimit', message: 'Daily study limit is required and must be a positive integer' });
  }

  if (!preferences.preferredTechniques || !Array.isArray(preferences.preferredTechniques)) {
    errors.push({ field: 'preferredTechniques', message: 'Preferred techniques must be an array' });
  } else {
    const validTechniques: StudyTechnique[] = ['pomodoro', 'deep-work', 'spaced-repetition', 'active-recall'];
    preferences.preferredTechniques.forEach((technique, index) => {
      if (!validTechniques.includes(technique)) {
        errors.push({ 
          field: `preferredTechniques[${index}]`, 
          message: `Technique must be one of: ${validTechniques.join(', ')}` 
        });
      }
    });
  }

  if (preferences.breakPreferences) {
    if (!isValidDuration(preferences.breakPreferences.shortBreakDuration)) {
      errors.push({ field: 'breakPreferences.shortBreakDuration', message: 'Short break duration must be a positive integer' });
    }
    if (!isValidDuration(preferences.breakPreferences.longBreakDuration)) {
      errors.push({ field: 'breakPreferences.longBreakDuration', message: 'Long break duration must be a positive integer' });
    }
    if (!isValidDuration(preferences.breakPreferences.longBreakInterval)) {
      errors.push({ field: 'breakPreferences.longBreakInterval', message: 'Long break interval must be a positive integer' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateTimeSlot = (timeSlot: Partial<TimeSlot>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!timeSlot.startTime || !isValidTimeFormat(timeSlot.startTime)) {
    errors.push({ field: 'startTime', message: 'Start time is required and must be in HH:MM format' });
  }

  if (!timeSlot.endTime || !isValidTimeFormat(timeSlot.endTime)) {
    errors.push({ field: 'endTime', message: 'End time is required and must be in HH:MM format' });
  }

  if (timeSlot.startTime && timeSlot.endTime && isValidTimeFormat(timeSlot.startTime) && isValidTimeFormat(timeSlot.endTime)) {
    const [startHour, startMin] = timeSlot.startTime.split(':').map(Number);
    const [endHour, endMin] = timeSlot.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (startMinutes >= endMinutes) {
      errors.push({ field: 'endTime', message: 'End time must be after start time' });
    }
  }

  if (timeSlot.dayOfWeek !== undefined && !isValidDayOfWeek(timeSlot.dayOfWeek)) {
    errors.push({ field: 'dayOfWeek', message: 'Day of week must be an integer between 0 and 6' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateClassSchedule = (schedule: Partial<ClassSchedule>): ValidationResult => {
  const errors: ValidationError[] = [];

  if (schedule.dayOfWeek === undefined || !isValidDayOfWeek(schedule.dayOfWeek)) {
    errors.push({ field: 'dayOfWeek', message: 'Day of week is required and must be an integer between 0 and 6' });
  }

  if (!schedule.startTime || !isValidTimeFormat(schedule.startTime)) {
    errors.push({ field: 'startTime', message: 'Start time is required and must be in HH:MM format' });
  }

  if (!schedule.endTime || !isValidTimeFormat(schedule.endTime)) {
    errors.push({ field: 'endTime', message: 'End time is required and must be in HH:MM format' });
  }

  if (schedule.startTime && schedule.endTime && isValidTimeFormat(schedule.startTime) && isValidTimeFormat(schedule.endTime)) {
    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (startMinutes >= endMinutes) {
      errors.push({ field: 'endTime', message: 'End time must be after start time' });
    }
  }

  if (schedule.location !== undefined && typeof schedule.location !== 'string') {
    errors.push({ field: 'location', message: 'Location must be a string' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Batch validation functions
export const validateMultiple = <T>(
  items: Partial<T>[], 
  validator: (item: Partial<T>) => ValidationResult
): ValidationResult => {
  const allErrors: ValidationError[] = [];
  
  items.forEach((item, index) => {
    const result = validator(item);
    if (!result.isValid) {
      result.errors.forEach(error => {
        allErrors.push({
          field: `[${index}].${error.field}`,
          message: error.message
        });
      });
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};