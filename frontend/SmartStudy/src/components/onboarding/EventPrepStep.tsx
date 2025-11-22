import { useState } from 'react';
import { Calendar, Target } from 'lucide-react';

export interface EventPrepData {
  prepTimePreference: '' | '1-week' | '2-weeks' | '1-month' | 'flexible';
  studyIntensity: '' | 'light' | 'moderate' | 'intense';
  stressLevel: '' | '1' | '2' | '3' | '4' | '5';
}

interface EventPrepStepProps {
  data?: Partial<EventPrepData>;
  onDataChange: (data: EventPrepData) => void;
  errors?: Record<string, string>;
}

const defaultEventPrepData: EventPrepData = {
  prepTimePreference: '',
  studyIntensity: '',
  stressLevel: '',
};

const EventPrepStep = ({ data, onDataChange, errors = {} }: EventPrepStepProps) => {
  const [formData, setFormData] = useState<EventPrepData>({
    ...defaultEventPrepData,
    ...data,
  });

  const handleInputChange = <K extends keyof EventPrepData>(field: K, value: EventPrepData[K]) => {
    const newData: EventPrepData = { ...formData, [field]: value } as EventPrepData;
    setFormData(newData);
    onDataChange(newData);
  };

  const prepTimeOptions = [
    { value: '1-week', label: '1 week before', icon: '📅' },
    { value: '2-weeks', label: '2 weeks before', icon: '📆' },
    { value: '1-month', label: '1 month before', icon: '🗓️' },
    { value: 'flexible', label: 'Flexible', icon: '🔄' },
  ];

  const intensityOptions = [
    { value: 'light', label: 'Light', description: 'Relaxed pace', icon: '🌱' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced approach', icon: '⚖️' },
    { value: 'intense', label: 'Intense', description: 'Focused, longer sessions', icon: '🔥' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Academic planning</h2>
        <p className="text-slate-300">
          Tell us how you like to prepare for exams and assignments
        </p>
      </div>

      {/* Prep Time Preference */}
      <div className="space-y-4">
        <label className={`text-lg font-medium ${errors.prepTimePreference ? 'text-red-400' : 'text-orange-300'}`}>
          When do you prefer to start preparing for exams? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prepTimeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleInputChange('prepTimePreference', option.value as EventPrepData['prepTimePreference'])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.prepTimePreference === option.value
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : errors.prepTimePreference
                    ? 'border-red-500/50 bg-slate-700/50 text-slate-300 hover:border-red-500'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Intensity */}
      <div className="space-y-4">
        <label className={`text-lg font-medium ${errors.studyIntensity ? 'text-red-400' : 'text-orange-300'}`}>
          What's your preferred study intensity? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {intensityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleInputChange('studyIntensity', option.value as EventPrepData['studyIntensity'])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.studyIntensity === option.value
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : errors.studyIntensity
                    ? 'border-red-500/50 bg-slate-700/50 text-slate-300 hover:border-red-500'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium text-lg">{option.label}</div>
              <div className="text-sm text-slate-400 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stress Level */}
      <div className="space-y-4">
        <label className={`text-lg font-medium ${errors.stressLevel ? 'text-red-400' : 'text-orange-300'}`}>
          How do you typically feel during exam periods? *
        </label>
        <div className="space-y-3">
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => handleInputChange('stressLevel', level.toString() as EventPrepData['stressLevel'])}
                className={`flex-1 h-16 rounded-lg border-2 transition-all duration-300 font-semibold text-lg ${
                  formData.stressLevel === level.toString()
                    ? 'border-orange-500 bg-orange-500 text-black'
                    : errors.stressLevel
                      ? 'border-red-500/50 bg-slate-700 text-slate-300 hover:border-red-500'
                      : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-orange-500/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-slate-400 px-2">
            <span>😌 Very calm</span>
            <span>😰 Very stressed</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-orange-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Target className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-300">
            <p className="font-medium text-orange-300 mb-1">Note:</p>
            <p>You can add specific exams, assignments, and deadlines later from your dashboard. This helps us understand your general preparation style.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPrepStep;
