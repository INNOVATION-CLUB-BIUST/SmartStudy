import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import ProfileStep from './ProfileStep';
import GoalsStep from './GoalsStep';
import StudyTimeStep from './StudyTimeStep';
import ScheduleStep from './ScheduleStep';
import EventPrepStep from './EventPrepStep';
import OptimizationStep from './OptimizationStep';
import { getCurrentUser } from '../../services/auth';
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
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ExtendedOnboardingFormData>({
    profile: {},
    goals: {},
    studyTimes: {},
    schedule: {},
    eventPrep: {},
    optimization: {},
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

  const handleStepData = (stepId: string, data: Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const handleComplete = async () => {
    // Prepare payload for backend
    const user = getCurrentUser();
    const uid = user?.uid || "demo-uid"; // TODO: require auth before onboarding
    const email = user?.email || formData.profile.email || "demo@example.com";

    // Map frontend data to backend payload
    const payload = {
      uid,
      email,
      profile: {
        firstName: formData.profile.firstName || '',
        lastName: formData.profile.lastName || '',
        institution: formData.profile.university || '',
        program: formData.profile.major || '',
        year: formData.profile.yearOfStudy || '',
      },
      subjects: formData.goals.focusAreas || [],
      goals: [
        {
          title: formData.goals.primaryGoal || '',
          description: formData.goals.careerGoals || '',
          targetDate: formData.goals.graduationDate || '',
          category: 'academic',
        }
      ],
      preferences: {
        studyTimePerDay: Number(formData.goals.studyHoursPerWeek) || 120,
        preferredStudyTimes: formData.studyTimes.preferredStudyTime ? [formData.studyTimes.preferredStudyTime] : [],
        breakDuration: Number(formData.studyTimes.breakDuration) || 15,
        notifications: true,
      },
    };

    try {
      const result = await postOnboarding(payload);
      console.log('Onboarding completed:', result);
      // TODO: Redirect to dashboard or main app
    } catch (error) {
      console.error('Onboarding error:', error);
      // TODO: Show error to user
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
              className="flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Complete Setup
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
