import { Calculator, Target, TrendingUp } from 'lucide-react';

/**
 * Props for the GradeCalculator component.
 * 
 * @property currentCAPercentage - The percentage of CA marks earned (0-100%).
 *   This is calculated as (total earned marks / total possible marks) * 100.
 *   Example: If student scored 14/20 on assessments worth 40% total, this would be 70%.
 * @property caWeight - The total weight of CA in the final grade (e.g., 40 or 50).
 * @property finalWeight - The weight of the final exam (e.g., 60 or 50).
 * @property passingMark - The minimum overall percentage to pass (e.g., 50).
 * @property targetGrade - Optional target grade percentage the student aims for.
 */
interface GradeCalculatorProps {
  currentCAPercentage: number;
  caWeight: number;
  finalWeight: number;
  passingMark: number;
  targetGrade?: number;
}

const GradeCalculator = ({ currentCAPercentage, caWeight, finalWeight, passingMark, targetGrade }: GradeCalculatorProps) => {
  // Convert the CA percentage to actual points based on CA weight
  // Example: 70% earned on CA worth 40 points = 0.70 * 40 = 28 points
  const caPointsEarned = (currentCAPercentage / 100) * caWeight;

  const calculateNeeded = (target: number) => {
    // Formula: (Target - CA_Points_Earned) / Final_Weight * 100
    // This gives us the percentage needed on the final exam
    const neededPoints = target - caPointsEarned;
    const neededPercentage = (neededPoints / finalWeight) * 100;
    
    return {
      percentage: Math.max(0, Math.min(100, neededPercentage)),
      isPossible: neededPercentage <= 100
    };
  };

  const toPass = calculateNeeded(passingMark);
  const toTarget = targetGrade ? calculateNeeded(targetGrade) : null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-orange-400" />
        Grade Calculator
      </h3>

      <div className="space-y-4">
        {/* Current Standing */}
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Current CA Standing</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{currentCAPercentage.toFixed(1)}%</span>
            <span className="text-sm text-slate-500">({caPointsEarned.toFixed(1)} / {caWeight} pts)</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-orange-500" 
              style={{ width: `${currentCAPercentage}%` }}
            />
          </div>
        </div>

        {/* To Pass */}
        <div className={`p-4 rounded-lg border ${toPass.isPossible ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Target className="h-4 w-4 text-blue-400" />
              <span>To Pass ({passingMark}%)</span>
            </div>
            <span className={`text-xs font-bold ${toPass.isPossible ? 'text-blue-400' : 'text-red-400'}`}>
              {toPass.isPossible ? 'POSSIBLE' : 'IMPOSSIBLE'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${toPass.isPossible ? 'text-white' : 'text-red-300'}`}>
              {toPass.percentage.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">needed on Final</span>
          </div>
        </div>

        {/* To Target */}
        {targetGrade && toTarget && (
          <div className={`p-4 rounded-lg border ${toTarget.isPossible ? 'bg-orange-500/10 border-orange-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <TrendingUp className="h-4 w-4 text-orange-400" />
                <span>Target ({targetGrade}%)</span>
              </div>
              <span className={`text-xs font-bold ${toTarget.isPossible ? 'text-orange-400' : 'text-red-400'}`}>
                {toTarget.isPossible ? 'ACHIEVABLE' : 'UNREACHABLE'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${toTarget.isPossible ? 'text-white' : 'text-red-300'}`}>
                {toTarget.percentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">needed on Final</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeCalculator;
