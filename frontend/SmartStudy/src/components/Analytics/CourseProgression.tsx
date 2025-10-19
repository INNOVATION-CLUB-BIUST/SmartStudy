import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import useAnalytics from '../../hooks/useAnalytics';

const CourseProgression: React.FC = () => {
  const { getTopPerformingCourses } = useAnalytics();
  const courses = getTopPerformingCourses();

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 60) return 'text-yellow-400';
    if (progress >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (progress: number): string => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (progress: number) => {
    if (progress >= 80) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (progress >= 60) return <Minus className="h-4 w-4 text-yellow-400" />;
    return <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  return (
    <div className="space-y-4">
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <div key={course.id} className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-white">{course.name}</h3>
                  <p className="text-sm text-slate-400">{course.sessions} sessions</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getTrendIcon(course.progress)}
                <span className={`text-lg font-bold ${getProgressColor(course.progress)}`}>
                  {course.progress}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-slate-300">{course.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-600 rounded-full">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(course.progress)}`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-600">
              <div>
                <p className="text-xs text-slate-400">Hours Studied</p>
                <p className="text-sm font-medium text-white">{course.hoursStudied}h</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Avg Focus Score</p>
                <p className="text-sm font-medium text-white">{course.averageScore}%</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="text-slate-400 mb-2">
            <TrendingUp className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No Course Data</h3>
          <p className="text-sm text-slate-400">Start studying to see your course progression</p>
        </div>
      )}

      {/* Overall Performance Summary */}
      {courses.length > 0 && (
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <h4 className="font-medium text-white mb-3">Overall Performance</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%
              </div>
              <div className="text-xs text-slate-400">Avg Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round(courses.reduce((sum, c) => sum + c.hoursStudied, 0) * 10) / 10}h
              </div>
              <div className="text-xs text-slate-400">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round(courses.reduce((sum, c) => sum + c.averageScore, 0) / courses.length)}%
              </div>
              <div className="text-xs text-slate-400">Avg Focus</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseProgression;