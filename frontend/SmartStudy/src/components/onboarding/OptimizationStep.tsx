import { useState } from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';

export interface OptimizationData {
  learningStyle: '' | 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
  aiPreferences: string[];
}

interface OptimizationStepProps {
  data?: Partial<OptimizationData>;
  onDataChange: (data: OptimizationData) => void;
  errors?: Record<string, string>;
}

const defaultOptimizationData: OptimizationData = {
  learningStyle: '',
  aiPreferences: [],
};

const OptimizationStep = ({ data, onDataChange, errors = {} }: OptimizationStepProps) => {
  const [formData, setFormData] = useState<OptimizationData>({
    ...defaultOptimizationData,
    ...data,
  });

  const handleInputChange = <K extends keyof OptimizationData>(field: K, value: OptimizationData[K]) => {
    const newData: OptimizationData = { ...formData, [field]: value } as OptimizationData;
    setFormData(newData);
    onDataChange(newData);
  };

  const handleArrayToggle = (field: 'aiPreferences', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const learningStyles = [
    { id: 'visual', label: 'Visual Learner', description: 'Charts, diagrams, and visual aids', icon: '👁️' },
    { id: 'auditory', label: 'Auditory Learner', description: 'Listening, discussions, and audio', icon: '👂' },
    { id: 'kinesthetic', label: 'Kinesthetic Learner', description: 'Hands-on activities and movement', icon: '✋' },
    { id: 'reading', label: 'Reading/Writing', description: 'Text-based materials and notes', icon: '📝' },
    { id: 'mixed', label: 'Mixed Style', description: 'Combination of different approaches', icon: '🔀' },
  ];

  const aiFeatures = [
    { id: 'smart-scheduling', label: 'Smart Study Scheduling', icon: '📅' },
    { id: 'progress-tracking', label: 'Progress Tracking', icon: '📊' },
    { id: 'personalized-recommendations', label: 'Personalized Recommendations', icon: '💡' },
    { id: 'focus-optimization', label: 'Focus Optimization', icon: '🎯' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Personalization</h2>
        <p className="text-slate-300">
          Help us tailor SmartStudy to your unique learning style
        </p>
      </div>

      {/* Learning Style */}
      <div className="space-y-4">
        <label className={`text-lg font-medium ${errors.learningStyle ? 'text-red-400' : 'text-orange-300'}`}>
          What's your learning style? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleInputChange('learningStyle', style.id as OptimizationData['learningStyle'])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.learningStyle === style.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : errors.learningStyle
                    ? 'border-red-500/50 bg-slate-700/50 text-slate-300 hover:border-red-500'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{style.icon}</span>
                <div>
                  <div className="font-medium text-lg">{style.label}</div>
                  <div className="text-sm text-slate-400 mt-1">{style.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-orange-400" />
          <label className="text-lg font-medium text-orange-300">AI-powered features (optional)</label>
        </div>
        <p className="text-sm text-slate-400">Select the features you'd like to enable</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleArrayToggle('aiPreferences', feature.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.aiPreferences.includes(feature.id)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="font-medium">{feature.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-300">
            <p className="font-medium text-orange-300 mb-1">Almost done!</p>
            <p>You can customize notifications, privacy settings, and more from your dashboard settings later.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationStep;
