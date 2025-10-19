import { useState } from 'react';
import { 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  Brain
} from 'lucide-react';
import useGoals from '../../hooks/useGoals';
import type { Goal } from '../../types';
import GoalModal from './GoalModal';

const Goals = () => {
  const { 
    goals, 
    loading, 
    error, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    toggleMilestone, 
    getStats 
  } = useGoals();

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const stats = getStats();

  const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }
    setEditingGoal(null);
  };

  const getGoalIcon = (type: Goal['type']) => {
    switch (type) {
      case 'academic': return BookOpen;
      case 'study': return Brain;
      case 'personal': return Target;
      case 'career': return TrendingUp;
      default: return Target;
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'paused': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <Target className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Goals</h3>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Goals</h1>
          <p className="text-slate-300">Track and manage your academic and personal goals</p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.completed}</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Completed Goals</h3>
          <p className="text-slate-400 text-xs mt-1">Great progress!</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.active}</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Active Goals</h3>
          <p className="text-slate-400 text-xs mt-1">Keep pushing forward!</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.averageProgress}%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Average Progress</h3>
          <p className="text-slate-400 text-xs mt-1">Overall completion rate</p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.map((goal) => {
          const GoalIcon = getGoalIcon(goal.type);
          const completedMilestones = goal.milestones.filter(m => m.completed).length;
          const totalMilestones = goal.milestones.length;
          
          return (
            <div key={goal.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <GoalIcon className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {goal.targetDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4" />
                        <span>{completedMilestones}/{totalMilestones} milestones</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="p-2 text-slate-400 hover:text-orange-400 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Progress</span>
                  <span className="text-sm text-slate-400">{goal.progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full">
                  <div 
                    className="h-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                
                <h4 className="text-sm font-medium text-slate-300 mb-3">Milestones</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {goal.milestones.map((milestone) => (
                    <div 
                      key={milestone.id} 
                      className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors"
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                    >
                      <div className={`p-1 rounded-full ${milestone.completed ? 'bg-green-500/20' : 'bg-slate-600/50'}`}>
                        {milestone.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${milestone.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                          {milestone.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          Due: {milestone.targetDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-full mb-6">
            <Target className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No goals yet</h3>
          <p className="text-slate-400 mb-6">Start by creating your first goal to track your progress</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={showAddGoal || editingGoal !== null}
        onClose={() => {
          setShowAddGoal(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
      />
    </div>
  );
};

export default Goals;
