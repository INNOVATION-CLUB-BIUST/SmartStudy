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
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-orange-500 border-orange-500 text-black'
                    : index === currentStep
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2 text-center max-w-20 ${
                  index <= currentStep ? 'text-orange-300' : 'text-slate-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  index < currentStep ? 'bg-orange-500' : 'bg-slate-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
