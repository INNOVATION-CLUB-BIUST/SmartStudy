import React, { useState } from 'react';
import { Target, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';

interface GoalsStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
}

const GoalsStep = ({ data, onDataChange, onNext }: GoalsStepProps) => {
  const [formData, setFormData] = useState({
    primaryGoal: data?.primaryGoal || '',
    gpaTarget: data?.gpaTarget || '',
    studyHoursPerWeek: data?.studyHoursPerWeek || '',
    focusAreas: data?.focusAreas || [],
    graduationDate: data?.graduationDate || '',
    careerGoals: data?.careerGoals || '',
  });

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleFocusAreaToggle = (area: string) => {
    const currentAreas = formData.focusAreas;
    const newAreas = currentAreas.includes(area)
      ? currentAreas.filter((a: string) => a !== area)
      : [...currentAreas, area];
    handleInputChange('focusAreas', newAreas);
  };

  const handleNext = () => {
    onDataChange(formData);
    onNext();
  };

  const primaryGoals = [
    { id: 'improve-grades', label: 'Improve my grades', icon: TrendingUp },
    { id: 'maintain-gpa', label: 'Maintain my current GPA', icon: Trophy },
    { id: 'time-management', label: 'Better time management', icon: Clock },
    { id: 'study-skills', label: 'Develop better study skills', icon: BookOpen },
    { id: 'exam-prep', label: 'Better exam preparation', icon: Target },
  ];

  const focusAreas = [
    'Mathematics',
    'Sciences',
    'Programming',
    'Writing & Communication',
    'Research',
    'Problem Solving',
    'Critical Thinking',
    'Time Management',
    'Note Taking',
    'Exam Strategies'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <Target className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Set your academic goals</h2>
        <p className="text-slate-300">
          Help us understand what you want to achieve with SmartStudy.
        </p>
      </div>

      {/* Primary Goal */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">What's your primary academic goal?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {primaryGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleInputChange('primaryGoal', goal.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.primaryGoal === goal.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <goal.icon className="h-6 w-6 mb-2 text-orange-400" />
              <div className="font-medium">{goal.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* GPA Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Target GPA</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            value={formData.gpaTarget}
            onChange={(e) => handleInputChange('gpaTarget', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
            placeholder="3.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Study Hours per Week</label>
          <input
            type="number"
            min="1"
            max="60"
            value={formData.studyHoursPerWeek}
            onChange={(e) => handleInputChange('studyHoursPerWeek', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
            placeholder="20"
          />
        </div>
      </div>

      {/* Focus Areas */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">What areas do you want to focus on? (Select all that apply)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {focusAreas.map((area) => (
            <button
              key={area}
              onClick={() => handleFocusAreaToggle(area)}
              className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                formData.focusAreas.includes(area)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Graduation Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-300">Expected Graduation Date</label>
        <input
          type="date"
          value={formData.graduationDate}
          onChange={(e) => handleInputChange('graduationDate', e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
        />
      </div>

      {/* Career Goals */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-300">Career Goals (Optional)</label>
        <textarea
          value={formData.careerGoals}
          onChange={(e) => handleInputChange('careerGoals', e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
          placeholder="Tell us about your career aspirations..."
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default GoalsStep;
