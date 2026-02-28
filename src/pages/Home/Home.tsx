import { useState } from 'react'
import { TOTAL_STEPS } from './Constants'
import { Step1, type Step1Data } from './Steps/Step1'
import { Step2 } from './Steps/Step2'
import { Step3 } from './Steps/Step3'
import { Step4 } from './Steps/Step4'

const STEP_LABELS = ['Brand', 'Details', 'Content', 'Review']

export const Home = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const handleStep1Next = (data: Step1Data) => {
    setStep1Data(data)
    goNext()
  }

  const handleFinish = () => {
    // final submission logic will go here
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top bar */}
      <header className="border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto px-6 h-16 flex items-center justify-start">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <img src="/icon.svg" alt="Marqai Studio" height={48} width={68} />
            <span className="text-lg font-bold text-white tracking-tight">
              Marqai {" "}
              <span className="text-primary-500 font-medium">Studio</span>
            </span>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="flex items-center gap-1 self-center p-6">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          return (
            <div key={step} className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary-500 text-white"
                      : isCompleted
                        ? "bg-primary-600 text-white"
                        : "bg-surface-800 text-surface-500"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`text-sm hidden sm:inline ${
                    isActive
                      ? "text-white font-medium"
                      : isCompleted
                        ? "text-surface-300"
                        : "text-surface-500"
                  }`}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>
              {step < TOTAL_STEPS && (
                <div
                  className={`w-8 h-px mx-1 ${
                    isCompleted ? "bg-primary-600" : "bg-surface-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Step content */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className={`w-full ${currentStep === 4 ? 'w-full mx-auto' : 'max-w-5xl'}`}>
          {currentStep === 1 && <Step1 onNext={handleStep1Next} />}
          {currentStep === 2 && <Step2 onNext={goNext} onBack={goBack} step1Data={step1Data} />}
          {currentStep === 3 && <Step3 onNext={goNext} onBack={goBack} />}
          {currentStep === 4 && (
            <Step4 onSubmit={handleFinish} onBack={goBack} />
          )}
        </div>
      </main>
    </div>
  );
}
