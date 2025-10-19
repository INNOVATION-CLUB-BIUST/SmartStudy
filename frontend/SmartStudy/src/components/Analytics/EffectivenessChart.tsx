import React from 'react';
import { Brain, Clock, Target, Zap } from 'lucide-react';
import useAnalytics from '../../hooks/useAnalytics';

const EffectivenessChart: React.FC = () => {
  const { getStudyTechniqueEffectiveness } = useAnalytics();
  const effectiveness = getStudyTechniqueEffectiveness();

  const techniques = [
    {
      id: 'pomodoro',
      name: 'Pomodoro',
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400'
    },
    {
      id: 'deep-work',
      name: 'Deep Work',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      id: 'spaced-repetition',
      name: 'Spaced Repetition',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    {
      id: 'active-recall',
      name: 'Active Recall',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    }
  ];

  const maxEffectiveness = Math.max(...Object.values(effectiveness));

  const getEffectivenessLevel = (value: number): string => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Poor';
  };

  const getEffectivenessColor = (value: number): string => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Technique Cards */}
      <div className="space-y-4">
        {techniques.map((technique) => {
          const Icon = technique.icon;
          const value = effectiveness[technique.id as keyof typeof effectiveness];
          const percentage = maxEffectiveness > 0 ? (value / maxEffectiveness) * 100 : 0;
          
          return (
            <div key={technique.id} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${technique.bgColor}`}>
                    <Icon className={`h-5 w-5 ${technique.textColor}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{technique.name}</h3>
                    <p className={`text-sm ${getEffectivenessColor(value)}`}>
                      {getEffectivenessLevel(value)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getEffectivenessColor(value)}`}>
                    {value}%
                  </div>
                  <div className="text-xs text-slate-400">Effectiveness</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-600 rounded-full">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${technique.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Object.values(effectiveness).reduce((sum, val) => sum + val, 0) / Object.keys(effectiveness).length}%
          </div>
          <div className="text-xs text-slate-400">Average Effectiveness</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Object.keys(effectiveness).reduce((best, current) => 
              effectiveness[current as keyof typeof effectiveness] > effectiveness[best as keyof typeof effectiveness] 
                ? current 
                : best
            )}
          </div>
          <div className="text-xs text-slate-400">Best Technique</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-slate-700/30 rounded-lg">
        <h4 className="font-medium text-white mb-3">Recommendations</h4>
        <div className="space-y-2">
          {Object.entries(effectiveness).map(([technique, value]) => {
            const techniqueInfo = techniques.find(t => t.id === technique);
            if (!techniqueInfo) return null;
            
            if (value < 60) {
              return (
                <div key={technique} className="text-sm text-slate-300">
                  • Consider practicing <span className="text-orange-400">{techniqueInfo.name}</span> more to improve effectiveness
                </div>
              );
            }
            return null;
          })}
          {Object.values(effectiveness).every(val => val >= 60) && (
            <div className="text-sm text-green-400">
              • Great job! All your study techniques are performing well.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EffectivenessChart;
