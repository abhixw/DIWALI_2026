import React from 'react';
import { useStoryStore } from '../store/storyStore';
import { PageTransition } from '../components/common/PageTransition';
import { QuestionCard } from '../components/journey/QuestionCard';
import { OptionSelector } from '../components/journey/OptionSelector';
import { Button } from '../components/common/Button';
import type { AgeGroup } from '../types/story';

export const Introduction: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useStoryStore();

  const ageOptions: AgeGroup[] = [
    'Under 13',
    '13–17',
    '18–22',
    '23–30',
    '31–45',
    '46–60',
    'Above 60',
  ];

  const canContinue = Boolean(formData.ageGroup);

  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <QuestionCard
        stepNumber={1}
        title="Welcome. Let's begin with you."
        subtitle="This journey is for you alone. Share only what feels comfortable."
      >
        <div className="space-y-8">
          {/* Question 1: Name / Nickname */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#F5E9D1]">
                What should we call you?
              </label>
              <span className="text-xs text-[#A39B92]">Optional</span>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="Your name or nickname..."
              maxLength={40}
              className="w-full px-4 py-3.5 bg-[#141312] border border-[#D4A64C]/30 rounded-2xl text-[#F5F0E8] placeholder-[#A39B92]/60 focus:outline-none focus:border-[#E9BD62] focus:ring-1 focus:ring-[#E9BD62] transition-all text-sm sm:text-base"
            />
          </div>

          {/* Question 2: Age Group */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#F5E9D1]">
              How old are you? <span className="text-[#E97832]">*</span>
            </label>
            <OptionSelector
              options={ageOptions}
              selected={formData.ageGroup}
              onSelect={(opt) => updateFormData({ ageGroup: opt as AgeGroup })}
              columns={3}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#D4A64C]/15">
            <Button variant="ghost" onClick={prevStep}>
              ← Back
            </Button>

            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canContinue}
              className="px-8"
            >
              Continue →
            </Button>
          </div>
        </div>
      </QuestionCard>
    </PageTransition>
  );
};
