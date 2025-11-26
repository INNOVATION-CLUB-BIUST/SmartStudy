import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator';
import GetStartedStep, { type GetStartedData } from './GetStartedStep';
import StudyTimeStep, { type StudyTimeData } from './StudyTimeStep';
import EventPrepStep, { type EventPrepData } from './EventPrepStep';
import OptimizationStep, { type OptimizationData } from './OptimizationStep';
import { getCurrentUser, signUp, subscribeToAuth } from '../../services/auth';
import type { User } from 'firebase/auth';
import { postOnboarding, type OnboardingPayload } from '../../services/api';

interface OnboardingFormData {
  getStarted: Partial<GetStartedData>;
  studyPreferences: Partial<StudyTimeData>;
  academicPlanning: Partial<EventPrepData>;
  personalization: Partial<OptimizationData>;
}

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userCreated, setUserCreated] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    const draft = localStorage.getItem('onboardingDraft');
    if (draft) {
      try {
        return JSON.parse(draft) as OnboardingFormData;
      } catch (e) { 
        if (import.meta.env.DEV) console.warn('Failed to parse onboarding draft:', e);
      }
    }
    return {
      getStarted: {},
      studyPreferences: {},
      academicPlanning: {},
      personalization: {},
    };
  });

  const steps = [
    { id: 'getStarted', title: 'Get Started', component: GetStartedStep },
    { id: 'studyPreferences', title: 'Study Preferences', component: StudyTimeStep },
    { id: 'academicPlanning', title: 'Academic Planning', component: EventPrepStep },
    { id: 'personalization', title: 'Personalization', component: OptimizationStep },
  ];

  // Listen to auth state and block access if signed in
  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setAuthUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (authReady && authUser && !isCompleting) {
      navigate('/dashboard');
    }
  }, [authReady, authUser, isCompleting, navigate]);

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (stepIndex === 0) { // Get Started (Profile + Goals)
      const data = formData.getStarted;
      // Profile fields
      if (!data.firstName) newErrors.firstName = 'First name is required';
      if (!data.lastName) newErrors.lastName = 'Last name is required';
      if (!data.email) newErrors.email = 'Email is required';
      if (!data.university) newErrors.university = 'University is required';
      if (!data.studentId) newErrors.studentId = 'Student ID is required';
      if (!data.yearOfStudy) newErrors.yearOfStudy = 'Year of study is required';
      
      if (!userCreated) {
        if (!data.password) newErrors.password = 'Password is required';
        else if (data.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        
        if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      }

      // Goals fields
      if (!data.primaryGoal) newErrors.primaryGoal = 'Primary goal is required';
      if (!data.gpaTarget) newErrors.gpaTarget = 'Target GPA is required';
      else {
        const gpa = parseFloat(data.gpaTarget);
        if (isNaN(gpa) || gpa < 0 || gpa > 5.0) newErrors.gpaTarget = 'GPA must be between 0 and 5.0';
      }
      if (!data.course) newErrors.course = 'Course/Program is required';
      if (!data.graduationMonth) newErrors.graduationMonth = 'Graduation month is required';
      if (!data.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    } else if (stepIndex === 1) { // Study Preferences
      const data = formData.studyPreferences;
      if (!data.preferredStudyTime) newErrors.preferredStudyTime = 'Preferred study time is required';
      if (!data.studyDuration) newErrors.studyDuration = 'Study duration is required';
      if (!data.breakDuration) newErrors.breakDuration = 'Break duration is required';
      if (!data.studyEnvironment) newErrors.studyEnvironment = 'Study environment is required';
      if (!data.focusLevel) newErrors.focusLevel = 'Focus level is required';
      if (!data.freeTime) newErrors.freeTime = 'Free time preference is required';
    } else if (stepIndex === 2) { // Academic Planning
      const data = formData.academicPlanning;
      if (!data.prepTimePreference) newErrors.prepTimePreference = 'Prep time preference is required';
      if (!data.studyIntensity) newErrors.studyIntensity = 'Study intensity is required';
      if (!data.stressLevel) newErrors.stressLevel = 'Stress level is required';
    } else if (stepIndex === 3) { // Personalization
      const data = formData.personalization;
      if (!data.learningStyle) newErrors.learningStyle = 'Learning style is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }

    return isValid;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      window.scrollTo(0, 0);
    }
  };

  const handleStepData = (stepId: string, data: unknown) => {
    setFormData(prev => {
      const next = { ...prev, [stepId]: data } as OnboardingFormData;
      localStorage.setItem('onboardingDraft', JSON.stringify(next));
      return next;
    });
    // Clear errors for fields that are being updated
    if (Object.keys(errors).length > 0) {
      const newErrors = { ...errors };
      Object.keys(data as object).forEach(key => {
        delete newErrors[key];
      });
      setErrors(newErrors);
    }
  };

  const handleComplete = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setIsCompleting(true);
    setErrors({});

    let user = getCurrentUser();
    // Create the account now if not signed in
    if (!user) {
      const { email, password } = formData.getStarted;
      if (!email || !password) {
        setErrors({ general: 'Email and password are required to create your account' });
        setIsLoading(false);
        setIsCompleting(false);
        return;
      }
      try {
        user = await signUp(email, password);
        setUserCreated(true);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
        setErrors({ general: errorMessage });
        console.error('Signup error:', err);
        setIsLoading(false);
        setIsCompleting(false);
        return;
      }
    }

    // Construct payload from new form structure
    const payload: OnboardingPayload = {
      userId: user.uid,
      email: user.email || formData.getStarted.email || '',
      profile: {
        firstName: formData.getStarted.firstName || '',
        lastName: formData.getStarted.lastName || '',
        university: formData.getStarted.university || '',
        major: formData.getStarted.course || '',
        yearOfStudy: formData.getStarted.yearOfStudy || '',
        studentId: formData.getStarted.studentId || '',
      },
      course: formData.getStarted.course || '',
      goals: formData.getStarted.primaryGoal ? [{
        title: formData.getStarted.primaryGoal,
        targetDate: `${formData.getStarted.graduationMonth} ${formData.getStarted.graduationYear}`,
        priority: 'high'
      }] : [],
      preferences: {
        studyTimePreference: formData.studyPreferences.preferredStudyTime || 'morning',
        weeklyStudyHours: 20, // Default value since we removed this field
      },
    };

    console.log('Sending payload:', payload);

    try {
      const result = await postOnboarding(payload);
      console.log('Onboarding completed:', result);
      
      localStorage.removeItem('onboardingDraft');
      setIsLoading(false);
      setIsCompleting(false);
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      setIsCompleting(false);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete onboarding';
      setErrors({ general: errorMessage });
      console.error('Onboarding error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white relative overflow-hidden">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {Object.entries(errors).map(([key, message]) => (
          <div 
            key={key}
            className="bg-red-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-2xl border border-red-400/50 flex items-center animate-in slide-in-from-right-full duration-300 pointer-events-auto max-w-md"
          >
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm opacity-90">Action Required</p>
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-orange-500/20 sticky top-0 z-40">
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
          steps={steps}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-8 transition-all duration-500">
          {steps[currentStep].id === 'getStarted' && (
            <GetStartedStep
              data={formData.getStarted}
              onDataChange={(data: GetStartedData) => handleStepData('getStarted', data)}
              errors={errors}
            />
          )}
          {steps[currentStep].id === 'studyPreferences' && (
            <StudyTimeStep
              data={formData.studyPreferences}
              onDataChange={(data: StudyTimeData) => handleStepData('studyPreferences', data)}
              errors={errors}
            />
          )}
          {steps[currentStep].id === 'academicPlanning' && (
            <EventPrepStep
              data={formData.academicPlanning}
              onDataChange={(data: EventPrepData) => handleStepData('academicPlanning', data)}
              errors={errors}
            />
          )}
          {steps[currentStep].id === 'personalization' && (
            <OptimizationStep
              data={formData.personalization}
              onDataChange={(data: OptimizationData) => handleStepData('personalization', data)}
              errors={errors}
            />
          )}
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
