import React, { useState } from 'react';
import { Settings, Brain, Target, Zap, CheckCircle } from 'lucide-react';

interface OptimizationStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
}

const OptimizationStep = ({ data, onDataChange, onComplete }: OptimizationStepProps) => {
  const [formData, setFormData] = useState({
    aiPreferences: data?.aiPreferences || [],
    learningStyle: data?.learningStyle || '',
    productivityTools: data?.productivityTools || [],
    notificationSettings: data?.notificationSettings || {},
    privacySettings: data?.privacySettings || {},
    optimizationGoals: data?.optimizationGoals || [],
  });

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleArrayToggle = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const handleComplete = () => {
    onDataChange(formData);
    onComplete();
  };

  const aiFeatures = [
    { id: 'smart-scheduling', label: 'Smart Study Scheduling', description: 'AI-powered study time optimization' },
    { id: 'progress-tracking', label: 'Progress Tracking', description: 'Automatic performance monitoring' },
    { id: 'personalized-recommendations', label: 'Personalized Recommendations', description: 'Custom study suggestions' },
    { id: 'focus-optimization', label: 'Focus Optimization', description: 'AI-driven focus improvement' },
    { id: 'exam-prediction', label: 'Exam Performance Prediction', description: 'Predict and improve exam outcomes' },
  ];

  const learningStyles = [
    { id: 'visual', label: 'Visual Learner', description: 'Charts, diagrams, and visual aids' },
    { id: 'auditory', label: 'Auditory Learner', description: 'Listening, discussions, and audio' },
    { id: 'kinesthetic', label: 'Kinesthetic Learner', description: 'Hands-on activities and movement' },
    { id: 'reading', label: 'Reading/Writing Learner', description: 'Text-based materials and notes' },
    { id: 'mixed', label: 'Mixed Learning Style', description: 'Combination of different approaches' },
  ];

  const productivityTools = [
    'Pomodoro Timer',
    'Focus Music',
    'Study Groups',
    'Flashcards',
    'Mind Maps',
    'Note Templates',
    'Progress Charts',
    'Study Analytics',
    'Goal Tracking',
    'Habit Building'
  ];

  const optimizationGoals = [
    { id: 'time-management', label: 'Better Time Management', icon: Target },
    { id: 'focus-improvement', label: 'Improved Focus', icon: Brain },
    { id: 'grade-improvement', label: 'Higher Grades', icon: Zap },
    { id: 'stress-reduction', label: 'Reduced Stress', icon: Settings },
    { id: 'study-efficiency', label: 'Study Efficiency', icon: CheckCircle },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <Settings className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Optimize your experience</h2>
        <p className="text-slate-300">
          Fine-tune SmartStudy to work perfectly for your learning style and preferences.
        </p>
      </div>

      {/* AI Features */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Which AI features interest you?</label>
        <div className="space-y-3">
          {aiFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleArrayToggle('aiPreferences', feature.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.aiPreferences.includes(feature.id)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="font-medium">{feature.label}</div>
              <div className="text-sm text-slate-400">{feature.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Style */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">What's your learning style?</label>
        <div className="space-y-3">
          {learningStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleInputChange('learningStyle', style.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.learningStyle === style.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="font-medium">{style.label}</div>
              <div className="text-sm text-slate-400">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Productivity Tools */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Productivity tools you'd like to use</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {productivityTools.map((tool) => (
            <button
              key={tool}
              onClick={() => handleArrayToggle('productivityTools', tool)}
              className={`p-3 rounded-lg border transition-all duration-300 text-sm ${
                formData.productivityTools.includes(tool)
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Goals */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">What do you want to optimize?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizationGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleArrayToggle('optimizationGoals', goal.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.optimizationGoals.includes(goal.id)
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

      {/* Notification Settings */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Notification preferences</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Study reminders</label>
            <select
              value={formData.notificationSettings.studyReminders || ''}
              onChange={(e) => {
                const newSettings = { ...formData.notificationSettings, studyReminders: e.target.value };
                handleInputChange('notificationSettings', newSettings);
              }}
              className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500"
            >
              <option value="">Select frequency</option>
              <option value="never">Never</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Deadline alerts</label>
            <select
              value={formData.notificationSettings.deadlineAlerts || ''}
              onChange={(e) => {
                const newSettings = { ...formData.notificationSettings, deadlineAlerts: e.target.value };
                handleInputChange('notificationSettings', newSettings);
              }}
              className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500"
            >
              <option value="">Select frequency</option>
              <option value="1-day">1 day before</option>
              <option value="3-days">3 days before</option>
              <option value="1-week">1 week before</option>
              <option value="2-weeks">2 weeks before</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <label className="text-lg font-medium text-orange-300">Privacy preferences</label>
        <div className="space-y-3">
          {[
            { id: 'data-sharing', label: 'Share anonymous data to improve AI', description: 'Help improve SmartStudy for all students' },
            { id: 'study-buddy', label: 'Allow study buddy matching', description: 'Connect with other students for group study' },
            { id: 'progress-sharing', label: 'Share progress with mentors', description: 'Allow academic advisors to view your progress' },
          ].map((setting) => (
            <button
              key={setting.id}
              onClick={() => {
                const newSettings = { ...formData.privacySettings, [setting.id]: !formData.privacySettings[setting.id] };
                handleInputChange('privacySettings', newSettings);
              }}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.privacySettings[setting.id]
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <div className="font-medium">{setting.label}</div>
              <div className="text-sm text-slate-400">{setting.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default OptimizationStep;
