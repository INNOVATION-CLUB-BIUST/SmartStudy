import React from 'react';
import useAnalytics from '../../hooks/useAnalytics';

interface HeatmapData {
  date: string;
  value: number;
  level: number; // 0-4 for intensity levels
}

const ActivityHeatMap: React.FC = () => {
  const { getStudySessions } = useAnalytics();
  const sessions = getStudySessions();

  // Generate heatmap data for the last 12 weeks
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    const today = new Date();
    
    // Generate data for the last 84 days (12 weeks)
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Find sessions for this date
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === date.toDateString();
      });
      
      // Calculate total study time for the day
      const totalMinutes = daySessions.reduce((sum, session) => sum + session.duration, 0);
      const totalHours = totalMinutes / 60;
      
      // Determine intensity level (0-4)
      let level = 0;
      if (totalHours > 0 && totalHours <= 1) level = 1;
      else if (totalHours > 1 && totalHours <= 2) level = 2;
      else if (totalHours > 2 && totalHours <= 4) level = 3;
      else if (totalHours > 4) level = 4;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: totalHours,
        level
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (level: number): string => {
    switch (level) {
      case 0: return 'bg-slate-700'; // No activity
      case 1: return 'bg-orange-500/30'; // Low activity
      case 2: return 'bg-orange-500/50'; // Medium activity
      case 3: return 'bg-orange-500/70'; // High activity
      case 4: return 'bg-orange-500'; // Very high activity
      default: return 'bg-slate-700';
    }
  };

  const getTooltipText = (data: HeatmapData): string => {
    if (data.value === 0) return 'No study time';
    return `${data.value.toFixed(1)}h studied`;
  };

  // Group data by weeks
  const weeks: HeatmapData[][] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Less</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-orange-500/30 rounded-sm"></div>
          <div className="w-3 h-3 bg-orange-500/50 rounded-sm"></div>
          <div className="w-3 h-3 bg-orange-500/70 rounded-sm"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
        </div>
        <span className="text-slate-400">More</span>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex space-x-1">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-orange-400 transition-all ${getIntensityColor(day.level)}`}
                title={`${new Date(day.date).toLocaleDateString()}: ${getTooltipText(day)}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {sessions.filter(s => {
              const sessionDate = new Date(s.date);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return sessionDate >= weekAgo;
            }).length}
          </div>
          <div className="text-xs text-slate-400">Sessions this week</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10}h
          </div>
          <div className="text-xs text-slate-400">Total study time</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Math.round(sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length) || 0}%
          </div>
          <div className="text-xs text-slate-400">Average focus</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatMap;
