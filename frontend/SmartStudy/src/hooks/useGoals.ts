import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getCurrentUser } from '../services/auth';
import type { Goal, Milestone, GoalStats } from '../types';

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
        const fetchedGoals: Goal[] = querySnapshot.docs.map(docSnap => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            title: data.title,
            description: data.description || '',
            type: data.type || 'academic',
            priority: data.priority || 'medium',
            status: data.status || 'active',
            targetDate: data.targetDate ? new Date(data.targetDate) : new Date(),
            progress: data.progress || 0,
            milestones: (data.milestones || []).map((m: any) => ({
              id: m.id,
              title: m.title,
              completed: m.completed,
              targetDate: m.targetDate ? new Date(m.targetDate) : new Date(),
              completedAt: m.completedAt ? new Date(m.completedAt) : undefined
            })) as Milestone[],
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
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

  // Basic mutators (local + Firestore)
  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'goals'), {
        ...goal,
        userId: getCurrentUser()?.uid || null,
        createdAt: new Date().toISOString()
      });
      setGoals(prev => [{ ...goal, id: docRef.id, createdAt: new Date(), updatedAt: new Date() } as Goal, ...prev]);
    } catch (err) {
      console.error('Failed to add goal', err);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const docRef = doc(db, 'goals', id);
      await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() } as any);
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...(updates as any) } : g));
    } catch (err) {
      console.error('Failed to update goal', err);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      // simple local removal; actual deletion in Firestore can be added
      setGoals(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to delete goal', err);
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      const updatedMilestones = goal.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
      return { ...goal, milestones: updatedMilestones } as Goal;
    }));
  };

  return {
    goals,
    loading,
    error,
    getStats,
    getUpcomingGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone
  };
};

export default useGoals;
