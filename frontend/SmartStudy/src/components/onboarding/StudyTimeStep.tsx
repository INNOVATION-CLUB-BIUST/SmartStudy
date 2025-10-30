import { useState } from 'react';
import { Clock, Sun, Moon, Coffee, Brain } from 'lucide-react';

export interface StudyTimeData {
  preferredStudyTime: '' | 'morning' | 'afternoon' | 'evening' | 'night';
  studyDuration: '' | '15' | '25' | '45' | '60' | '90' | '120' | '180';
  breakDuration: '' | '5' | '10' | '15' | '30' | '45' | '60';
  studyEnvironment: '' | 'library' | 'home' | 'cafe' | 'classroom' | 'study-room' | 'outdoor' | 'anywhere';
  focusLevel: '' | '1' | '2' | '3' | '4' | '5';
  studyMethods: string[];
  distractions: string[];
}

interface StudyTimeStepProps {
  data?: Partial<StudyTimeData>;
  onDataChange: (data: StudyTimeData) => void;
}

const defaultStudyTimeData: StudyTimeData = {
  preferredStudyTime: '',
  studyDuration: '',
  breakDuration: '',
  studyEnvironment: '',
  focusLevel: '',
  studyMethods: [],
  distractions: [],
};

const StudyTimeStep = ({ data, onDataChange }: StudyTimeStepProps) => {
  const [formData, setFormData] = useState<StudyTimeData>({
    ...defaultStudyTimeData,
    ...data,
  });

  const handleInputChange = <K extends keyof StudyTimeData>(field: K, value: StudyTimeData[K]) => {
    const newData: StudyTimeData = { ...formData, [field]: value } as StudyTimeData;
    setFormData(newData);
    onDataChange(newData);
  };

  const handleArrayToggle = (field: 'studyMethods' | 'distractions', value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const studyTimes = [
    { id: 'morning', label: 'Morning (6 AM - 12 PM)', icon: Sun },
    { id: 'afternoon', label: 'Afternoon (12 PM - 6 PM)', icon: Coffee },
    { id: 'evening', label: 'Evening (6 PM - 12 AM)', icon: Moon },
    { id: 'night', label: 'Night (12 AM - 6 AM)', icon: Brain },
  ];

  const studyMethods = [
    'Pomodoro Technique',
    'Active Recall',
    'Spaced Repetition',
    'Mind Mapping',
    'Group Study',
    'Solo Study',
    'Flashcards',
    'Practice Problems',
    'Summarization',
    'Teaching Others'
  ];

  const distractions = [
    'Social Media',
    'Phone Notifications',
    'Noise',
    'Internet Browsing',
    'Friends/Family',
    'Music',
    'TV/Streaming',
    'Gaming',
    'Food/Cooking',
    'Other'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <Clock className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Your study preferences</h2>
        <p className="text-slate-300">
          Help us understand your study habits and preferences for better scheduling.
        </p>
      </div>

      {/* Preferred Study Time */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">When do you prefer to study?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyTimes.map((time) => (
            <button
              key={time.id}
              onClick={() => handleInputChange('preferredStudyTime', time.id as StudyTimeData['preferredStudyTime'])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.preferredStudyTime === time.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <time.icon className="h-6 w-6 mb-2 text-orange-400" />
              <div className="font-medium">{time.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Study Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Preferred Study Session Duration</label>
          <select
            value={formData.studyDuration}
            onChange={(e) => handleInputChange('studyDuration', e.target.value as StudyTimeData['studyDuration'])}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
          >
            <option value="">Select duration</option>
            <option value="15">15 minutes</option>
            <option value="25">25 minutes (Pomodoro)</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Break Duration</label>
          <select
            value={formData.breakDuration}
            onChange={(e) => handleInputChange('breakDuration', e.target.value as StudyTimeData['breakDuration'])}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
          >
            <option value="">Select break duration</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
      </div>

      {/* Study Environment */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-300">Preferred Study Environment</label>
        <select
          value={formData.studyEnvironment}
          onChange={(e) => handleInputChange('studyEnvironment', e.target.value as StudyTimeData['studyEnvironment'])}
          className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
        >
          <option value="">Select environment</option>
          <option value="library">Library</option>
          <option value="home">Home</option>
          <option value="cafe">Café</option>
          <option value="classroom">Classroom</option>
          <option value="study-room">Study Room</option>
          <option value="outdoor">Outdoor</option>
          <option value="anywhere">Anywhere</option>
        </select>
      </div>

      {/* Focus Level */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-300">How would you rate your current focus level?</label>
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => handleInputChange('focusLevel', level.toString() as StudyTimeData['focusLevel'])}
              className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                formData.focusLevel === level.toString()
                  ? 'border-orange-500 bg-orange-500 text-black'
                  : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-orange-500/50'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Study Methods */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Study methods you use (Select all that apply)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {studyMethods.map((method) => (
            <button
              key={method}
              onClick={() => handleArrayToggle('studyMethods', method)}
              className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                formData.studyMethods.includes(method)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Distractions */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">What distracts you most? (Select all that apply)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {distractions.map((distraction) => (
            <button
              key={distraction}
              onClick={() => handleArrayToggle('distractions', distraction)}
              className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                formData.distractions.includes(distraction)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              {distraction}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyTimeStep;
