import React from 'react';
import { useStoryStore } from '../store/storyStore';
import { PageTransition } from '../components/common/PageTransition';
import { QuestionCard } from '../components/journey/QuestionCard';
import { OptionSelector } from '../components/journey/OptionSelector';
import { Button } from '../components/common/Button';

export const Dreams: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useStoryStore();

  const wishOptions = [
    'Make my parents proud',
    'Achieve my dream career',
    'Become financially independent',
    'Build my own business',
    'Find happiness and peace',
    'Spend more time with loved ones',
    'Overcome my fears',
    'Achieve something meaningful',
    'Something else',
  ];

  const leaveOptions = [
    'Fear of failure',
    'Self-doubt',
    'Negative habits',
    'Regrets',
    'Procrastination',
    'Unnecessary worries',
    'Something else',
  ];

  const hasWish =
    Boolean(formData.heartWish) &&
    (formData.heartWish !== 'Something else' || Boolean(formData.customHeartWish.trim()));

  const canContinue = hasWish;

  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <QuestionCard
        stepNumber={4}
        title="Your Dreams and Hopes"
        subtitle="Diwali is the return of light. What flame will you ignite within yourself?"
      >
        <div className="space-y-8">
          {/* Question 1: Heart's Wish */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#F5E9D1]">
              What is one thing your heart truly wishes for? <span className="text-[#E97832]">*</span>
            </label>
            <OptionSelector
              options={wishOptions}
              selected={formData.heartWish}
              onSelect={(opt) => updateFormData({ heartWish: opt })}
              columns={2}
              customOptionLabel="Something else"
              customValue={formData.customHeartWish}
              onCustomChange={(val) => updateFormData({ customHeartWish: val })}
              customPlaceholder="Share your heartfelt dream..."
            />
          </div>

          {/* Question 2: Leave Behind (Optional Letting Go) */}
          <div className="space-y-3 pt-4 border-t border-[#D4A64C]/10">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#F5E9D1]">
                What is one thing you want to leave behind this Diwali?
              </label>
              <span className="text-xs text-[#A39B92]">Optional</span>
            </div>
            <p className="text-xs text-[#A39B92]">
              Release what no longer serves your spirit into the sacred flame.
            </p>
            <OptionSelector
              options={leaveOptions}
              selected={formData.leaveBehind}
              onSelect={(opt) => updateFormData({ leaveBehind: opt })}
              columns={2}
              customOptionLabel="Something else"
              customValue={formData.customLeaveBehind}
              onCustomChange={(val) => updateFormData({ customLeaveBehind: val })}
              customPlaceholder="Name what you are ready to let go of..."
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
              className="px-8 shadow-[0_0_25px_rgba(233,189,98,0.35)]"
            >
              Continue to Light Diya →
            </Button>
          </div>
        </div>
      </QuestionCard>
    </PageTransition>
  );
};
