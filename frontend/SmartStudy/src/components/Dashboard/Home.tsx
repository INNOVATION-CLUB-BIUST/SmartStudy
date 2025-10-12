import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Brain,
  Zap,
  Award
} from 'lucide-react';

const Home = () => {
  const todayStats = {
    studyTime: '2h 30m',
    tasksCompleted: 3,
    totalTasks: 5,
    focusScore: 85,
    streak: 7
  };

  const upcomingTasks = [
    {
      id: 1,
      title: 'Complete Math Assignment',
      subject: 'Mathematics',
      dueDate: 'Today, 5:00 PM',
      priority: 'high',
      progress: 60
    },
    {
      id: 2,
      title: 'Read Chapter 5 - Physics',
      subject: 'Physics',
      dueDate: 'Tomorrow, 10:00 AM',
      priority: 'medium',
      progress: 30
    },
    {
      id: 3,
      title: 'Prepare for Chemistry Lab',
      subject: 'Chemistry',
      dueDate: 'Wednesday, 2:00 PM',
      priority: 'high',
      progress: 0
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Study Streak',
      description: '7 days in a row',
      icon: Award,
      color: 'text-orange-400'
    },
    {
      id: 2,
      title: 'Focus Master',
      description: '85% focus score',
      icon: Brain,
      color: 'text-yellow-400'
    },
    {
      id: 3,
      title: 'Task Completer',
      description: '3 tasks done today',
      icon: CheckCircle,
      color: 'text-green-400'
    }
  ];

  const studyTips = [
    {
      title: 'Pomodoro Technique',
      description: 'Try 25-minute focused study sessions with 5-minute breaks',
      icon: Clock
    },
    {
      title: 'Active Recall',
      description: 'Test yourself on material instead of just re-reading',
      icon: Brain
    },
    {
      title: 'Spaced Repetition',
      description: 'Review material at increasing intervals for better retention',
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl p-8 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
            <p className="text-orange-900 text-lg">
              Ready to continue your academic journey? Let's make today productive.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">{todayStats.studyTime}</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Study Time Today</h3>
          <p className="text-slate-400 text-xs mt-1">+30min from yesterday</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{todayStats.tasksCompleted}/{todayStats.totalTasks}</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Tasks Completed</h3>
          <p className="text-slate-400 text-xs mt-1">60% completion rate</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Target className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-white">{todayStats.focusScore}%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Focus Score</h3>
          <p className="text-slate-400 text-xs mt-1">Excellent focus today!</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">{todayStats.streak}</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Day Streak</h3>
          <p className="text-slate-400 text-xs mt-1">Keep it up!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Tasks */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Upcoming Tasks</h2>
            <button className="text-orange-400 hover:text-orange-300 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{task.title}</h3>
                    <p className="text-sm text-slate-400">{task.subject}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{task.dueDate}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-slate-600 rounded-full">
                      <div 
                        className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400">{task.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Achievements</h2>
            <button className="text-orange-400 hover:text-orange-300 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{achievement.title}</h3>
                  <p className="text-sm text-slate-400">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
        <h2 className="text-xl font-bold text-white mb-6">AI Study Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyTips.map((tip, index) => (
            <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <tip.icon className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="font-medium text-white">{tip.title}</h3>
              </div>
              <p className="text-sm text-slate-400">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
