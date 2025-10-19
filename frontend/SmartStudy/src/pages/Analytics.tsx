import React from 'react';
import { 
  BarChart, 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  BookOpen,
  Brain,
  Award,
  Activity,
  PieChart
} from 'lucide-react';
import ActivityHeatMap from '../components/Analytics/ActivityHeatMap';
import CourseProgression from '../components/Analytics/CourseProgression';
import WeeklyOverview from '../components/Analytics/WeeklyOverview';
import EffectivenessChart from '../components/Analytics/EffectivenessChart';
import useAnalytics from '../hooks/useAnalytics';

const Analytics = () => {
  const { 
    analyticsData, 
    loading, 
    error,
    getStudyStreak,
    getWeeklyHours,
    getCompletionRate,
    getTopPerformingCourses,
    getStudyTechniqueEffectiveness
  } = useAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <BarChart className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Analytics</h3>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const studyStreak = getStudyStreak();
  const weeklyHours = getWeeklyHours();
  const completionRate = getCompletionRate();
  const topCourses = getTopPerformingCourses();
  const techniqueEffectiveness = getStudyTechniqueEffectiveness();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-300">Track your study performance and identify improvement opportunities</p>
        </div>
        <div className="flex items-center space-x-4">
          <select className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">{weeklyHours}h</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Study Hours This Week</h3>
          <p className="text-slate-400 text-xs mt-1">+2.5h from last week</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{completionRate}%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Task Completion Rate</h3>
          <p className="text-slate-400 text-xs mt-1">Above average performance</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{studyStreak}</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Study Streak (Days)</h3>
          <p className="text-slate-400 text-xs mt-1">Keep it up!</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-white">85%</span>
          </div>
          <h3 className="text-slate-300 text-sm font-medium">Focus Score</h3>
          <p className="text-slate-400 text-xs mt-1">Excellent concentration</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Overview */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Weekly Study Overview</h2>
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <WeeklyOverview />
        </div>

        {/* Course Progression */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Course Progression</h2>
            <BookOpen className="h-5 w-5 text-slate-400" />
          </div>
          <CourseProgression />
        </div>
      </div>

      {/* Activity Heatmap and Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Heatmap */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Study Activity Heatmap</h2>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <ActivityHeatMap />
        </div>

        {/* Study Technique Effectiveness */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Study Technique Effectiveness</h2>
            <PieChart className="h-5 w-5 text-slate-400" />
          </div>
          <EffectivenessChart />
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Performance Insights</h2>
          <Award className="h-5 w-5 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <h3 className="font-medium text-white mb-2">Best Study Time</h3>
            <p className="text-2xl font-bold text-orange-400 mb-1">9:00 AM - 11:00 AM</p>
            <p className="text-sm text-slate-400">Your most productive hours</p>
          </div>
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <h3 className="font-medium text-white mb-2">Top Performing Course</h3>
            <p className="text-2xl font-bold text-green-400 mb-1">{topCourses[0]?.name || 'Mathematics'}</p>
            <p className="text-sm text-slate-400">{topCourses[0]?.progress || 92}% completion rate</p>
          </div>
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <h3 className="font-medium text-white mb-2">Most Effective Technique</h3>
            <p className="text-2xl font-bold text-blue-400 mb-1">Pomodoro</p>
            <p className="text-sm text-slate-400">{techniqueEffectiveness.pomodoro || 85}% effectiveness</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-xl p-6 border border-orange-500/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Brain className="h-6 w-6 text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-white">AI Recommendations</h2>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-medium text-white mb-1">Increase Study Consistency</h3>
            <p className="text-sm text-slate-300">Try studying for 2 hours daily at 9:00 AM for better results.</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-medium text-white mb-1">Optimize Break Timing</h3>
            <p className="text-sm text-slate-300">Take 5-minute breaks every 25 minutes to maintain focus.</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-medium text-white mb-1">Focus on Weak Areas</h3>
            <p className="text-sm text-slate-300">Spend more time on Physics - your lowest performing subject.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
