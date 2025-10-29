import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getCurrentUser } from '../services/auth';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type?: 'academic' | 'study' | 'personal' | 'career';
  priority: 'low' | 'medium' | 'high';
  status?: 'active' | 'completed' | 'paused';
  targetDate: Date;
  progress?: number; // 0-100
  milestones?: Milestone[];
  createdAt: Date;
  updatedAt?: Date;
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

  // Load goals from Firestore on mount
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
          setGoals([]);
          setLoading(false);
          return;
        }

        // Fetch goals from Firestore
        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(goalsQuery);
        const fetchedGoals: Goal[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description || '',
            type: data.type || 'academic',
            priority: data.priority,
            status: data.status || 'active',
            targetDate: new Date(data.targetDate),
            progress: data.progress || 0,
            milestones: data.milestones || [],
            createdAt: new Date(data.createdAt),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
          };
        });

        setGoals(fetchedGoals);
      } catch (err) {
        setError('Failed to load goals');
        console.error('Error loading goals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  // Get goal statistics
  const getStats = (): GoalStats => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.status === 'completed').length;
    const active = goals.filter(goal => goal.status === 'active').length;
    const paused = goals.filter(goal => goal.status === 'paused').length;
    const averageProgress = total > 0 ? Math.round(goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / total) : 0;

    return {
      total,
      completed,
      active,
      paused,
      averageProgress
    };
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

  return {
    goals,
    loading,
    error,
    getStats,
    getUpcomingGoals
  };
};

export default useGoals;
