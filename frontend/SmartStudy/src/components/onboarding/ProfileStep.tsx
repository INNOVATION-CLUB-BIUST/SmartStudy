import { useState } from 'react';
import { User, Mail, GraduationCap } from 'lucide-react';
import { getCurrentUser } from '../../services/auth';

interface ProfileStepProps {
  data: Record<string, unknown>;
  onDataChange: (data: Record<string, unknown>) => void;
}

const ProfileStep = ({ data, onDataChange }: ProfileStepProps) => {
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
    yearOfStudy: profileData?.yearOfStudy || '',
    university: profileData?.university || 'BIUST',
  });

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
          <User className="h-8 w-8 text-black" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
        <p className="text-slate-300">
          Let's start with the basics to personalize your SmartStudy experience.
        </p>
      </div>

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
              // Allow editing even when logged in to enable creating a new account
              disabled={false}
            />
          </div>
          {isLoggedIn && (
            <p className="text-xs text-slate-400 mt-1">
              Currently signed in as {existingUserEmail}. Enter a different email to create a new account.
            </p>
          )}
        </div>

        {/* Password fields: show when not logged in OR when user enters a different email than current session */}
        {(!isLoggedIn || formData.email !== existingUserEmail) && (
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

        {/* Year of Study */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-orange-300">Year of Study</label>
          <select
            value={formData.yearOfStudy}
            onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-orange-500/30 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
          >
            <option value="">Select your year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="5th Year">5th Year</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
        </div>
      </div>
  );
};

export default ProfileStep;
