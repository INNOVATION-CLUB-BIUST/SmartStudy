import { useState } from 'react';
import { User, GraduationCap } from 'lucide-react';

export interface GetStartedData {
  // Account Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Student Info
  university: string;
  studentId: string;
  yearOfStudy: string;
  
  // Academic Goals
  primaryGoal: '' | 'improve-grades' | 'maintain-gpa' | 'time-management' | 'study-skills' | 'exam-prep';
  gpaTarget: string;
  course: string;
  graduationMonth: string;
  graduationYear: string;
}

interface GetStartedStepProps {
  data?: Partial<GetStartedData>;
  onDataChange: (data: GetStartedData) => void;
  errors?: Record<string, string>;
}

const defaultGetStartedData: GetStartedData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  university: '',
  studentId: '',
  yearOfStudy: '',
  primaryGoal: '',
  gpaTarget: '',
  course: '',
  graduationMonth: '',
  graduationYear: '',
};

const GetStartedStep = ({ data, onDataChange, errors = {} }: GetStartedStepProps) => {
  const [formData, setFormData] = useState<GetStartedData>({
    ...defaultGetStartedData,
    ...data,
  });

  const handleInputChange = <K extends keyof GetStartedData>(field: K, value: GetStartedData[K]) => {
    const newData: GetStartedData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const primaryGoals = [
    { value: 'improve-grades', label: 'Improve my grades', icon: '📈' },
    { value: 'maintain-gpa', label: 'Maintain my current GPA', icon: '🎯' },
    { value: 'time-management', label: 'Better time management', icon: '⏰' },
    { value: 'study-skills', label: 'Develop study skills', icon: '📚' },
    { value: 'exam-prep', label: 'Prepare for exams', icon: '✍️' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <User className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Let's get started!</h2>
        <p className="text-slate-300">
          Create your account and tell us about your academic goals
        </p>
      </div>

      {/* Account Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-orange-400" />
          <h3 className="text-xl font-semibold text-orange-300">Account Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-orange-300">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
                errors.firstName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="John"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-orange-300">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
                errors.lastName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-orange-300">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
            }`}
            placeholder="john.doe@university.edu"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-orange-300">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-orange-300">Confirm Password *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-orange-300">University *</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
                errors.university 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="BIUST"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-orange-300">Year of Study *</label>
            <select
              value={formData.yearOfStudy}
              onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:ring-2 transition-all duration-300 ${
                errors.yearOfStudy 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
            >
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="5th Year">5th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-orange-300">Student ID *</label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => handleInputChange('studentId', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
              errors.studentId 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
            }`}
            placeholder="202012345"
          />
        </div>
      </div>

      {/* Academic Goals */}
      <div className="space-y-4 pt-6 border-t border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <GraduationCap className="h-5 w-5 text-orange-400" />
          <h3 className="text-xl font-semibold text-orange-300">Academic Goals</h3>
        </div>

        <div>
          <label className={`text-sm font-medium ${errors.primaryGoal ? 'text-red-400' : 'text-orange-300'}`}>
            What's your primary goal? *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {primaryGoals.map((goal) => (
              <button
                key={goal.value}
                onClick={() => handleInputChange('primaryGoal', goal.value as GetStartedData['primaryGoal'])}
                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  formData.primaryGoal === goal.value
                    ? 'border-orange-500 bg-orange-500/20 text-white'
                    : errors.primaryGoal
                    ? 'border-red-500/50 bg-slate-700/50 text-slate-300 hover:border-red-500 hover:bg-red-500/10'
                    : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="font-medium">{goal.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-orange-300">Target GPA *</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.gpaTarget}
              onChange={(e) => handleInputChange('gpaTarget', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
                errors.gpaTarget 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="3.5"
            />
            <p className="text-xs text-slate-400 mt-1">On a scale of 0-5</p>
          </div>

          <div>
            <label className="text-sm font-medium text-orange-300">Course/Program *</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => handleInputChange('course', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 ${
                errors.course 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
              placeholder="Computer Science"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-orange-300">Expected Graduation *</label>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.graduationMonth}
              onChange={(e) => handleInputChange('graduationMonth', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:ring-2 transition-all duration-300 ${
                errors.graduationMonth 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
            >
              <option value="">Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>

            <select
              value={formData.graduationYear}
              onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white focus:ring-2 transition-all duration-300 ${
                errors.graduationYear 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:border-orange-500 focus:ring-orange-500'
              }`}
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedStep;
