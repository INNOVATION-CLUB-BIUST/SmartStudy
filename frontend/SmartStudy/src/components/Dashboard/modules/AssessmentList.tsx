import { Award, AlertCircle, CheckCircle } from 'lucide-react';

interface AssessmentComponent {
  name: string;
  weight: number;
  score?: number;
  maxScore: number;
  dueDate?: string;
}

interface AssessmentData {
  ca: {
    weight: number;
    components: AssessmentComponent[];
  };
  finalExam: {
    weight: number;
    date: string;
    score?: number;
  };
  dpRequirement: number;
  passingMark: number;
}

interface AssessmentListProps {
  assessments: AssessmentData;
  onUpdateScore: (componentIndex: number, newScore: number) => void;
  onUpdateFinalScore: (newScore: number) => void;
}

const AssessmentList = ({ assessments, onUpdateScore, onUpdateFinalScore }: AssessmentListProps) => {
  const calculateTotalProgress = () => {
    const earned = assessments.ca.components.reduce((sum, comp) => {
      if (comp.score !== undefined) {
        return sum + (comp.score / comp.maxScore) * comp.weight;
      }
      return sum;
    }, 0);
    return earned;
  };

  const calculateDPStatus = () => {
    const earned = calculateTotalProgress();
    const dpThreshold = (assessments.dpRequirement / 100) * assessments.ca.weight;
    return {
      achieved: earned >= dpThreshold,
      current: earned,
      required: dpThreshold
    };
  };

  const dpStatus = calculateDPStatus();
  const currentProgress = calculateTotalProgress();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-orange-400" />
          Assessments
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
          dpStatus.achieved 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        }`}>
          {dpStatus.achieved ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
          {dpStatus.achieved ? 'DP Achieved' : 'DP Pending'}
        </div>
      </div>

      {/* CA Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-slate-400 font-medium">Continuous Assessment ({assessments.ca.weight}%)</span>
          <span className="text-white font-bold">{currentProgress.toFixed(1)} / {assessments.ca.weight} pts</span>
        </div>
        
        <div className="space-y-2">
          {assessments.ca.components.map((comp, idx) => (
            <div key={idx} className="p-3 bg-slate-700/30 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-white font-medium text-sm">{comp.name}</div>
                  <div className="text-xs text-slate-500">Weight: {comp.weight}%</div>
                </div>
                <div className="text-right">
                  {comp.score !== undefined ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold text-sm">{comp.score}/{comp.maxScore}</span>
                      <button 
                        onClick={() => {
                          const newScore = prompt(`Update score for ${comp.name} (Max: ${comp.maxScore})`, comp.score?.toString());
                          if (newScore !== null && !isNaN(Number(newScore))) {
                            onUpdateScore(idx, Number(newScore));
                          }
                        }}
                        className="text-[10px] text-slate-400 hover:text-white underline decoration-dotted"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        const newScore = prompt(`Enter score for ${comp.name} (Max: ${comp.maxScore})`);
                        if (newScore !== null && !isNaN(Number(newScore))) {
                          onUpdateScore(idx, Number(newScore));
                        }
                      }}
                      className="text-xs px-2 py-1 bg-slate-700 hover:bg-orange-500 hover:text-black text-slate-300 rounded transition-colors"
                    >
                      Add Score
                    </button>
                  )}
                </div>
              </div>
              
              {/* Progress bar for individual component */}
              {comp.score !== undefined && (
                <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(comp.score / comp.maxScore) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final Exam Section */}
      <div>
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-slate-400 font-medium">Final Exam ({assessments.finalExam.weight}%)</span>
          <span className="text-slate-400">{new Date(assessments.finalExam.date).toLocaleDateString()}</span>
        </div>
        
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-red-200 font-medium text-sm">Final Exam Score</div>
              <div className="text-xs text-red-400/60">Required to pass</div>
            </div>
          </div>
          
          {assessments.finalExam.score !== undefined ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{assessments.finalExam.score}%</span>
              <button 
                onClick={() => {
                  const newScore = prompt('Update Final Exam Score (%)', assessments.finalExam.score?.toString());
                  if (newScore !== null && !isNaN(Number(newScore))) {
                    onUpdateFinalScore(Number(newScore));
                  }
                }}
                className="text-xs text-slate-500 hover:text-white"
              >
                Edit
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                const newScore = prompt('Enter Final Exam Score (%)');
                if (newScore !== null && !isNaN(Number(newScore))) {
                  onUpdateFinalScore(Number(newScore));
                }
              }}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-300 text-xs font-medium rounded-lg transition-colors"
            >
              Add Result
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentList;
