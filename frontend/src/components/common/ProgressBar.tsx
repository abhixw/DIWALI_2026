import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps = 5 }) => {
  // Journey steps: Step 2 (Intro) to Step 6 (Diya Lighting)
  // Step 1 is Home (no progress bar), Step 7 is MyStory, Step 8 is CardStudio
  const activeStep = Math.max(1, Math.min(currentStep - 1, totalSteps));
  const progressPercent = ((activeStep - 1) / (totalSteps - 1)) * 100;

  const stepLabels = [
    'You',
    'Chapter',
    'Reflection',
    'Hopes',
    'Light',
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 select-none">
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#25221E]" />

        {/* Active glowing progress line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#D4A64C] to-[#E9BD62] shadow-[0_0_12px_rgba(233,189,98,0.7)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Step dots */}
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isPassed = activeStep > stepNum;
          const isCurrent = activeStep === stepNum;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#E9BD62] text-[#11100F] shadow-[0_0_15px_rgba(233,189,98,0.9)] ring-4 ring-[#D4A64C]/30 scale-110'
                    : isPassed
                    ? 'bg-[#D4A64C] text-[#11100F]'
                    : 'bg-[#1B1916] border border-[#D4A64C]/30 text-[#A39B92]'
                }`}
              >
                {isPassed ? (
                  <span className="text-xs font-bold leading-none">✓</span>
                ) : (
                  <span className="text-[10px] font-semibold">{stepNum}</span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1.5 font-medium transition-colors hidden sm:block ${
                  isCurrent ? 'text-[#E9BD62] font-semibold' : 'text-[#A39B92]'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
