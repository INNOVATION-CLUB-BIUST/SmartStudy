import { useState } from 'react';
import { Target, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';

export interface GoalsStepData {
  primaryGoal: '' | 'improve-grades' | 'maintain-gpa' | 'time-management' | 'study-skills' | 'exam-prep';
  gpaTarget: string;
  studyHoursPerWeek: string;
  course: string;
  graduationMonth: string;
  graduationYear: string;
}

interface GoalsStepProps {
  data?: Partial<GoalsStepData>;
  onDataChange: (data: GoalsStepData) => void;
  errors?: Record<string, string>;
}

const defaultGoalsStepData: GoalsStepData = {
  primaryGoal: '',
  gpaTarget: '',
  studyHoursPerWeek: '',
  course: '',
  graduationMonth: '',
  graduationYear: '',
};

const GoalsStep = ({ data, onDataChange, errors = {} }: GoalsStepProps) => {
  const [formData, setFormData] = useState<GoalsStepData>({
    ...defaultGoalsStepData,
    ...data,
  });

  const handleInputChange = <K extends keyof GoalsStepData>(field: K, value: GoalsStepData[K]) => {
    const newData: GoalsStepData = { ...formData, [field]: value } as GoalsStepData;
    setFormData(newData);
    onDataChange(newData);
  };

  const primaryGoals = [
    { id: 'improve-grades', label: 'Improve my grades', icon: TrendingUp },
    { id: 'maintain-gpa', label: 'Maintain my current GPA', icon: Trophy },
    { id: 'time-management', label: 'Better time management', icon: Clock },
    { id: 'study-skills', label: 'Develop better study skills', icon: BookOpen },
    { id: 'exam-prep', label: 'Better exam preparation', icon: Target },
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());

  const getInputClass = (field: string) => `w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-1 transition-all duration-300 ${
    errors[field] 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
      : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
  }`;

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
        <label className={`text-lg font-medium ${errors.primaryGoal ? 'text-red-400' : 'text-orange-300'}`}>
          What's your primary academic goal?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {primaryGoals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleInputChange('primaryGoal', goal.id as GoalsStepData['primaryGoal'])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                formData.primaryGoal === goal.id
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : errors.primaryGoal 
                    ? 'border-red-500/50 bg-slate-700/50 text-slate-300 hover:border-red-500'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
              }`}
            >
              <goal.icon className={`h-6 w-6 mb-2 ${formData.primaryGoal === goal.id ? 'text-orange-400' : 'text-slate-400'}`} />
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
            className={getInputClass('gpaTarget')}
            placeholder="3.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Study Hours per Week</label>
          <input
            type="number"
            min="1"
            max="168"
            value={formData.studyHoursPerWeek}
            onChange={(e) => handleInputChange('studyHoursPerWeek', e.target.value)}
            className={getInputClass('studyHoursPerWeek')}
            placeholder="20"
          />
        </div>
      </div>

      {/* Course/Program */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-orange-300">Course / Program</label>
        <input
          type="text"
          value={formData.course}
          onChange={(e) => handleInputChange('course', e.target.value)}
          className={getInputClass('course')}
          placeholder="e.g. Computer Engineering, BSc Computer Science"
        />
      </div>

      {/* Graduation Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-300">Expected Graduation Date</label>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.graduationMonth}
            onChange={(e) => handleInputChange('graduationMonth', e.target.value)}
            className={getInputClass('graduationMonth')}
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={formData.graduationYear}
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
            className={getInputClass('graduationYear')}
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GoalsStep;
