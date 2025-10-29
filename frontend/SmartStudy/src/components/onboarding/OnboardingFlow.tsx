import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';
import ProfileStep from './ProfileStep';
import GoalsStep from './GoalsStep';
import StudyTimeStep from './StudyTimeStep';
import ScheduleStep from './ScheduleStep';
import EventPrepStep from './EventPrepStep';
import OptimizationStep from './OptimizationStep';
import { getCurrentUser, signUp } from '../../services/auth';
import { postOnboarding } from '../../services/api';

// Extended types to match actual form data from step components
interface ExtendedProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  studentId?: string;
  university?: string;
  yearOfStudy?: string;
  major?: string;
  dateOfBirth?: string;
  [key: string]: string | undefined;
}

interface ExtendedGoalsData {
  primaryGoal?: string;
  gpaTarget?: string;
  studyHoursPerWeek?: string;
  focusAreas?: string[];
  graduationDate?: string;
  careerGoals?: string;
  [key: string]: string | string[] | undefined;
}

interface ExtendedStudyTimesData {
  preferredStudyTime?: string;
  studyDuration?: string;
  breakDuration?: string;
  studyEnvironment?: string;
  focusLevel?: string;
  studyMethods?: string[];
  distractions?: string[];
  [key: string]: string | string[] | undefined;
}

interface ExtendedScheduleData {
  weeklySchedule?: Record<string, Record<string, string>>;
  classSchedule?: unknown[];
  extracurricularActivities?: unknown[];
  workSchedule?: Record<string, unknown>;
  freeTime?: string;
  studyBlocks?: unknown[];
  [key: string]: unknown;
}

interface ExtendedEventPrepData {
  upcomingExams?: unknown[];
  assignmentDeadlines?: unknown[];
  projectDeadlines?: unknown[];
  prepTimePreference?: string;
  studyIntensity?: string;
  reminderPreferences?: string[];
  stressLevel?: string;
  [key: string]: unknown;
}

interface ExtendedOptimizationData {
  aiPreferences?: string[];
  learningStyle?: string;
  productivityTools?: string[];
  notificationSettings?: Record<string, unknown>;
  privacySettings?: Record<string, unknown>;
  optimizationGoals?: string[];
  [key: string]: unknown;
}

interface ExtendedOnboardingFormData {
  profile: ExtendedProfileData;
  goals: ExtendedGoalsData;
  studyTimes: ExtendedStudyTimesData;
  schedule: ExtendedScheduleData;
  eventPrep: ExtendedEventPrepData;
  optimization: ExtendedOptimizationData;
}

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCreated, setUserCreated] = useState(false);
  const [formData, setFormData] = useState<ExtendedOnboardingFormData>(() => {
    const draft = localStorage.getItem('onboardingDraft');
    if (draft) {
      try {
        return JSON.parse(draft) as ExtendedOnboardingFormData;
      } catch { 
        // ignore malformed draft
      }
    }
    return {
      profile: {},
      goals: {},
      studyTimes: {},
      schedule: {},
      eventPrep: {},
      optimization: {},
    };
  });

  const steps = [
    { id: 'profile', title: 'Profile Setup', component: ProfileStep },
    { id: 'goals', title: 'Academic Goals', component: GoalsStep },
    { id: 'studyTimes', title: 'Study Preferences', component: StudyTimeStep },
    { id: 'schedule', title: 'Schedule Setup', component: ScheduleStep },
    { id: 'eventPrep', title: 'Event Preparation', component: EventPrepStep },
    { id: 'optimization', title: 'Optimization', component: OptimizationStep },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepData = async (stepId: string, data: Record<string, unknown>) => {
    setFormData(prev => {
      const next = { ...prev, [stepId]: data } as ExtendedOnboardingFormData;
      localStorage.setItem('onboardingDraft', JSON.stringify(next));
      return next;
    });

    // If profile step is completed and user account hasn't been created yet, create it
    if (stepId === 'profile' && !userCreated && currentStep === 0) {
      const profileData = data as ExtendedProfileData;

      // If user already logged in (via login), skip signup
      const existingUser = getCurrentUser();
      if (existingUser) return;
      
      // Validate required fields
      if (!profileData.email || !profileData.password) {
        setError('Email and password are required');
        return;
      }

      if (profileData.password !== profileData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        // Create Firebase user account
        const user = await signUp(profileData.email, profileData.password);
        console.log('User account created:', user.uid);
        setUserCreated(true);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
        setError(errorMessage);
        console.error('Signup error:', err);
        throw err; // Prevent navigation to next step
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError('');

    const user = getCurrentUser();
    
    if (!user) {
      setError('You must be logged in to complete onboarding');
      setIsLoading(false);
      return;
    }

    // Simple payload - just what backend needs
    const payload = {
      userId: user.uid,
      email: user.email || formData.profile.email || '',
      profile: {
        firstName: formData.profile.firstName || '',
        lastName: formData.profile.lastName || '',
        university: formData.profile.university || '',
        major: formData.profile.major || '',
        yearOfStudy: formData.profile.yearOfStudy || '',
        studentId: formData.profile.studentId || '',
        dateOfBirth: formData.profile.dateOfBirth || '',
      },
      subjects: formData.goals.focusAreas || [],
      goals: formData.goals.primaryGoal ? [{
        title: formData.goals.primaryGoal,
        targetDate: formData.goals.graduationDate || '',
        priority: 'high'
      }] : [],
      preferences: {
        studyTimePreference: formData.studyTimes.preferredStudyTime || 'morning',
        weeklyStudyHours: Number(formData.goals.studyHoursPerWeek) || 20,
      },
    };

    console.log('Sending payload:', payload);

    try {
      const result = await postOnboarding(payload);
      console.log('Onboarding completed:', result);
      
      localStorage.removeItem('onboardingDraft');
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding';
      setError(errorMessage);
      console.error('Onboarding error:', error);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl">
                <CheckCircle className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  SmartStudy Setup
                </h1>
                <p className="text-sm text-orange-300">by BIUST Innovation Club</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={steps.length}
          steps={steps}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-8">
          <CurrentStepComponent 
            data={formData[steps[currentStep].id as keyof ExtendedOnboardingFormData]}
            onDataChange={(data: Record<string, unknown>) => handleStepData(steps[currentStep].id, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
            onComplete={handleComplete}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
              currentStep === 0
                ? 'text-slate-500 cursor-not-allowed'
                : 'text-orange-300 hover:text-orange-400 hover:bg-orange-500/10'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-orange-500'
                    : index < currentStep
                    ? 'bg-orange-300'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className={`flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-400 hover:to-yellow-400'
              }`}
            >
              {isLoading ? 'Completing Setup...' : 'Complete Setup'}
              <CheckCircle className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
