import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  steps: Array<{ id: string; title: string }>;
}

const ProgressIndicator = ({ currentStep, steps }: ProgressIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center w-full">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                  index < currentStep
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 border-orange-400 text-black scale-105'
                    : index === currentStep
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400 ring-4 ring-orange-500/20'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span className="text-base font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm mt-3 text-center font-medium transition-colors duration-300 ${
                  index <= currentStep ? 'text-orange-300' : 'text-slate-500'
                }`}
              >
                {step.title}
              </span>
              {index === currentStep && (
                <div className="mt-1 text-xs text-orange-400/60 font-medium">
                  {index + 1} of {steps.length}
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 px-2 sm:px-4">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index < currentStep 
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500' 
                      : 'bg-slate-700'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
