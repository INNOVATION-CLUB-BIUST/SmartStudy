import { useState } from 'react';
import { User, Mail, GraduationCap, Calendar } from 'lucide-react';
import { getCurrentUser } from '../../services/auth';

interface ProfileStepProps {
  data: Record<string, unknown>;
  onDataChange: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onComplete: () => void;
}

const ProfileStep = ({ data, onDataChange, onNext }: ProfileStepProps) => {
  const profileData = data as Record<string, string | undefined>;
  
  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;
  const existingUserEmail = currentUser?.email || '';
  const [formData, setFormData] = useState({
    firstName: profileData?.firstName || '',
    lastName: profileData?.lastName || '',
    email: profileData?.email || existingUserEmail,
    password: profileData?.password || '',
    confirmPassword: profileData?.confirmPassword || '',
    studentId: profileData?.studentId || '',
    university: profileData?.university || 'BIUST',
    yearOfStudy: profileData?.yearOfStudy || '',
    major: profileData?.major || '',
    dateOfBirth: profileData?.dateOfBirth || '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleNext = async () => {
    setError('');
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    if (!isLoggedIn) {
      if (!formData.password) {
        setError('Password is required');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      onDataChange(formData);
      
      // The parent component will handle user creation
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for state update
      
      onNext();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const majors = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Law',
    'Arts & Humanities',
    'Sciences',
    'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <User className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
        <p className="text-slate-300">
          Help us personalize your SmartStudy experience by sharing your academic profile.
        </p>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
            placeholder="Enter your last name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
              placeholder="your.email@biust.ac.bw"
              disabled={isLoggedIn}
            />
          </div>
        </div>

        {/* Password fields (only when not logged in) */}
        {!isLoggedIn && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-orange-300">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                placeholder="Create a password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-orange-300">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                placeholder="Confirm your password"
              />
            </div>
          </>
        )}

        {/* Student ID */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Student ID</label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => handleInputChange('studentId', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
            placeholder="Enter your student ID"
          />
        </div>

        {/* University */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">University</label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
              placeholder="BIUST"
            />
          </div>
        </div>

        {/* Year of Study */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-orange-300">Year of Study</label>
          <select
            value={formData.yearOfStudy}
            onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
          >
            <option value="">Select your year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Major */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-orange-300">Major/Field of Study</label>
          <select
            value={formData.major}
            onChange={(e) => handleInputChange('major', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
          >
            <option value="">Select your major</option>
            {majors.map((major) => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-orange-300">Date of Birth</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={`px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-400 hover:to-yellow-400'
          }`}
        >
          {isSubmitting ? (isLoggedIn ? 'Saving...' : 'Creating Account...') : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default ProfileStep;
