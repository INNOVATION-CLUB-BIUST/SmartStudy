import { Calculator, Target, TrendingUp } from 'lucide-react';

interface GradeCalculatorProps {
  currentCA: number;
  caWeight: number;
  finalWeight: number;
  passingMark: number;
  targetGrade?: number;
}

const GradeCalculator = ({ currentCA, caWeight, finalWeight, passingMark, targetGrade }: GradeCalculatorProps) => {
  const calculateNeeded = (target: number) => {
    // Formula: (Target - CurrentCA_Points) / Final_Weight * 100
    // CurrentCA_Points is passed in as raw points out of 100 (e.g. 25.5 out of 40)
    // Wait, the prop currentCA is likely the percentage of CA earned?
    // Let's assume currentCA is the weighted points earned so far (e.g. 25 points out of 40 max CA points)
    
    // If currentCA is points:
    const neededPoints = target - currentCA;
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
          <div className="text-sm text-slate-400 mb-1">Current Standing</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{currentCA.toFixed(1)}%</span>
            <span className="text-sm text-slate-500">/ {caWeight}% (CA)</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-orange-500" 
              style={{ width: `${(currentCA / caWeight) * 100}%` }}
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
