import { useState, useEffect } from 'react';
import type { WeeklyGoal } from '../types';

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'study' | 'personal' | 'career';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  targetDate: Date;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate: Date;
  completedAt?: Date;
}

export interface GoalStats {
  total: number;
  completed: number;
  active: number;
  paused: number;
  averageProgress: number;
}

const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load goals from localStorage on mount
  useEffect(() => {
    const loadGoals = () => {
      try {
        const savedGoals = localStorage.getItem('smartstudy-goals');
        if (savedGoals) {
          const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
            ...goal,
            targetDate: new Date(goal.targetDate),
            createdAt: new Date(goal.createdAt),
            updatedAt: new Date(goal.updatedAt),
            milestones: goal.milestones.map((milestone: any) => ({
              ...milestone,
              targetDate: new Date(milestone.targetDate),
              completedAt: milestone.completedAt ? new Date(milestone.completedAt) : undefined
            }))
          }));
          setGoals(parsedGoals);
        } else {
          // Initialize with sample data
          const sampleGoals: Goal[] = [
            {
              id: '1',
              title: 'Maintain 3.5+ GPA this semester',
              description: 'Focus on consistent study habits and assignment completion',
              type: 'academic',
              priority: 'high',
              status: 'active',
              targetDate: new Date('2024-05-15'),
              progress: 75,
              milestones: [
                { id: '1-1', title: 'Complete all assignments on time', completed: true, targetDate: new Date('2024-03-01') },
                { id: '1-2', title: 'Score 85+ on midterm exams', completed: true, targetDate: new Date('2024-03-15') },
                { id: '1-3', title: 'Maintain study schedule', completed: false, targetDate: new Date('2024-04-01') },
                { id: '1-4', title: 'Prepare for final exams', completed: false, targetDate: new Date('2024-05-01') }
              ],
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-02-20')
            },
            {
              id: '2',
              title: 'Study 25 hours per week',
              description: 'Establish consistent daily study routine',
              type: 'study',
              priority: 'medium',
              status: 'active',
              targetDate: new Date('2024-04-30'),
              progress: 60,
              milestones: [
                { id: '2-1', title: 'Create weekly study schedule', completed: true, targetDate: new Date('2024-02-01') },
                { id: '2-2', title: 'Track daily study hours', completed: true, targetDate: new Date('2024-02-15') },
                { id: '2-3', title: 'Reach 20 hours/week consistently', completed: false, targetDate: new Date('2024-03-15') },
                { id: '2-4', title: 'Maintain 25 hours/week for 4 weeks', completed: false, targetDate: new Date('2024-04-15') }
              ],
              createdAt: new Date('2024-01-20'),
              updatedAt: new Date('2024-02-18')
            },
            {
              id: '3',
              title: 'Improve time management skills',
              description: 'Use productivity techniques and better planning',
              type: 'personal',
              priority: 'medium',
              status: 'active',
              targetDate: new Date('2024-06-01'),
              progress: 40,
              milestones: [
                { id: '3-1', title: 'Learn Pomodoro technique', completed: true, targetDate: new Date('2024-02-01') },
                { id: '3-2', title: 'Implement daily planning routine', completed: false, targetDate: new Date('2024-03-01') },
                { id: '3-3', title: 'Reduce procrastination by 50%', completed: false, targetDate: new Date('2024-04-01') },
                { id: '3-4', title: 'Maintain consistent schedule for 2 months', completed: false, targetDate: new Date('2024-05-01') }
              ],
              createdAt: new Date('2024-01-25'),
              updatedAt: new Date('2024-02-15')
            }
          ];
          setGoals(sampleGoals);
          saveGoals(sampleGoals);
        }
      } catch (err) {
        setError('Failed to load goals');
        console.error('Error loading goals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  // Save goals to localStorage
  const saveGoals = (goalsToSave: Goal[]) => {
    try {
      localStorage.setItem('smartstudy-goals', JSON.stringify(goalsToSave));
    } catch (err) {
      console.error('Error saving goals:', err);
    }
  };

  // Add a new goal
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    return newGoal;
  };

  // Update an existing goal
  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id 
        ? { ...goal, ...updates, updatedAt: new Date() }
        : goal
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  // Delete a goal
  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  // Toggle milestone completion
  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return {
              ...milestone,
              completed: !milestone.completed,
              completedAt: !milestone.completed ? new Date() : undefined
            };
          }
          return milestone;
        });

        // Recalculate progress based on completed milestones
        const completedMilestones = updatedMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedMilestones / updatedMilestones.length) * 100);

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: newProgress,
          updatedAt: new Date()
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  // Update goal progress
  const updateProgress = (id: string, progress: number) => {
    updateGoal(id, { progress: Math.max(0, Math.min(100, progress)) });
  };

  // Get goal statistics
  const getStats = (): GoalStats => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.status === 'completed').length;
    const active = goals.filter(goal => goal.status === 'active').length;
    const paused = goals.filter(goal => goal.status === 'paused').length;
    const averageProgress = total > 0 ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / total) : 0;

    return {
      total,
      completed,
      active,
      paused,
      averageProgress
    };
  };

  // Get goals by type
  const getGoalsByType = (type: Goal['type']) => {
    return goals.filter(goal => goal.type === type);
  };

  // Get goals by status
  const getGoalsByStatus = (status: Goal['status']) => {
    return goals.filter(goal => goal.status === status);
  };

  // Get goals by priority
  const getGoalsByPriority = (priority: Goal['priority']) => {
    return goals.filter(goal => goal.priority === priority);
  };

  // Get upcoming goals (due within next 30 days)
  const getUpcomingGoals = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return goals.filter(goal => 
      goal.status === 'active' && 
      goal.targetDate <= thirtyDaysFromNow
    );
  };

  // Get overdue goals
  const getOverdueGoals = () => {
    const now = new Date();
    return goals.filter(goal => 
      goal.status === 'active' && 
      goal.targetDate < now
    );
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    updateProgress,
    getStats,
    getGoalsByType,
    getGoalsByStatus,
    getGoalsByPriority,
    getUpcomingGoals,
    getOverdueGoals
  };
};

export default useGoals;
