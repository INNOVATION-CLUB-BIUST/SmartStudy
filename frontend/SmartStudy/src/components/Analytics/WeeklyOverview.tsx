import { TrendingUp, TrendingDown } from 'lucide-react';
import useAnalytics from '../../hooks/useAnalytics';

const WeeklyOverview: React.FC = () => {
  const { getWeeklyData } = useAnalytics();
  const weeklyData = getWeeklyData();

  const maxHours = Math.max(...weeklyData.map(w => w.hours));
  const maxSessions = Math.max(...weeklyData.map(w => w.sessions));

  const getBarHeight = (value: number, max: number): string => {
    return `${(value / max) * 100}%`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (current < previous) return <TrendingDown className="h-3 w-3 text-red-400" />;
    return null;
  };

  // removed unused getTrendColor helper

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-48 flex items-end justify-between space-x-2">
        {weeklyData.map((week, index) => {
          const previousWeek = index > 0 ? weeklyData[index - 1] : null;
          const hoursTrend = previousWeek ? getTrendIcon(week.hours, previousWeek.hours) : null;
          const sessionsTrend = previousWeek ? getTrendIcon(week.sessions, previousWeek.sessions) : null;
          
          return (
            <div key={week.week} className="flex-1 flex flex-col items-center space-y-2">
              {/* Bars */}
              <div className="w-full flex items-end justify-center space-x-1 h-32">
                {/* Hours Bar */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-4 bg-gradient-to-t from-orange-500 to-yellow-500 rounded-t-sm relative group">
                    <div 
                      className="w-full bg-orange-500 rounded-t-sm transition-all duration-500"
                      style={{ height: getBarHeight(week.hours, maxHours) }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {week.hours}h
                    </div>
                  </div>
                </div>
                
                {/* Sessions Bar */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-4 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-sm relative group">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm transition-all duration-500"
                      style={{ height: getBarHeight(week.sessions, maxSessions) }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {week.sessions} sessions
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Week Label */}
              <div className="text-xs text-slate-400 text-center">
                {week.week}
              </div>
              
              {/* Trend Indicators */}
              <div className="flex items-center space-x-1">
                {hoursTrend}
                {sessionsTrend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
          <span className="text-slate-300">Study Hours</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span className="text-slate-300">Sessions</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Math.round(weeklyData.reduce((sum, w) => sum + w.hours, 0) * 10) / 10}h
          </div>
          <div className="text-xs text-slate-400">Total Hours</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {weeklyData.reduce((sum, w) => sum + w.sessions, 0)}
          </div>
          <div className="text-xs text-slate-400">Total Sessions</div>
        </div>
      </div>

      {/* Weekly Averages */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="text-center">
          <div className="text-sm font-medium text-white">
            {Math.round(weeklyData.reduce((sum, w) => sum + w.hours, 0) / weeklyData.length * 10) / 10}h
          </div>
          <div className="text-xs text-slate-400">Avg Hours/Week</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-white">
            {Math.round(weeklyData.reduce((sum, w) => sum + w.sessions, 0) / weeklyData.length)}
          </div>
          <div className="text-xs text-slate-400">Avg Sessions/Week</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-white">
            {Math.round(weeklyData.reduce((sum, w) => sum + w.averageFocus, 0) / weeklyData.length)}%
          </div>
          <div className="text-xs text-slate-400">Avg Focus</div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOverview;
