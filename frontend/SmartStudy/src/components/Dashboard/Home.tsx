import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Brain,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGoals from '../../hooks/useGoals';
import { useUser } from '../../hooks/useUser';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const { getStats, getUpcomingGoals, loading: goalsLoading } = useGoals();
  
  const goalStats = getStats();
  const upcomingGoals = getUpcomingGoals();

  if (userLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const todayStats = {
    studyTime: '0h 0m',
    tasksCompleted: 0,
    totalTasks: 0,
    focusScore: 0,
    streak: 0,
    goalsCompleted: goalStats.completed,
    activeGoals: goalStats.active,
    goalProgress: goalStats.averageProgress
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Modules */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">My Modules</h2>
            <button 
              onClick={() => navigate('/dashboard/modules')}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              Manage
            </button>
          </div>
          
          {!user?.subjects || user.subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">No modules added yet</p>
              <button 
                onClick={() => navigate('/dashboard/modules')}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
              >
                Add Modules
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {user.subjects.map((subject, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate('/dashboard/modules')}
                  className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-orange-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{subject.name}</h3>
                      <p className="text-sm text-slate-400">{subject.code}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                      {subject.credits} credits
                    </span>
                  </div>
                  {subject.instructor && (
                    <p className="text-xs text-slate-500">Instructor: {subject.instructor}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals Overview */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Goals Progress</h2>
            <button className="text-orange-400 hover:text-orange-300 text-sm font-medium">
              View All
            </button>
          </div>
          
          {goalStats.total === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">No goals set yet</p>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium">
                Set Your First Goal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Completed Goals</span>
                <span className="text-white font-bold">{goalStats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Active Goals</span>
                <span className="text-white font-bold">{goalStats.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Average Progress</span>
                <span className="text-white font-bold">{goalStats.averageProgress}%</span>
              </div>
              <div className="pt-2">
                <div className="w-full h-2 bg-slate-600 rounded-full">
                  <div 
                    className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${goalStats.averageProgress}%` }}
                  ></div>
                </div>
              </div>
              {upcomingGoals.length > 0 && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Upcoming deadlines:</p>
                  {upcomingGoals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-300 flex-1 truncate">• {goal.title}</span>
                      <span className="text-xs text-slate-500 ml-2">
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Study Preferences & Quick Stats */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Study Preferences</h2>
          </div>
          
          {!user?.preferences ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No preferences set</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Study Time Preference</span>
                <span className="text-white font-medium capitalize">{user.preferences.studyTimePreference}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Weekly Study Hours</span>
                <span className="text-white font-medium">{user.preferences.weeklyStudyHours}h</span>
              </div>
              {user.preferences.preferredStudyMethods && user.preferences.preferredStudyMethods.length > 0 && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Preferred Methods:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.preferredStudyMethods.map((method, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
