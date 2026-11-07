import React from 'react';
import { useStoryStore } from '../store/storyStore';
import { PageTransition } from '../components/common/PageTransition';
import { QuestionCard } from '../components/journey/QuestionCard';
import { OptionSelector } from '../components/journey/OptionSelector';
import { TextResponse } from '../components/journey/TextResponse';
import { Button } from '../components/common/Button';

export const Reflection: React.FC = () => {
  const { formData, updateFormData, toggleGratitude, nextStep, prevStep } = useStoryStore();

  const feelingOptions = [
    'I grew more than I expected.',
    'I faced challenges nobody knows about.',
    'I achieved something I once dreamed of.',
    'I am still figuring things out.',
    'I lost something but learned something.',
    'I am grateful for what I have.',
    'I am waiting for my moment.',
    'Something else',
  ];

  const gratitudeOptions = [
    'Family',
    'Friends',
    'Opportunities',
    'Personal growth',
    'Health and happiness',
    'Myself',
  ];

  const hasFeeling =
    Boolean(formData.yearFeeling) &&
    (formData.yearFeeling !== 'Something else' || Boolean(formData.customYearFeeling.trim()));

  const canContinue = hasFeeling;

  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <QuestionCard
        stepNumber={3}
        title="Your Year in Reflection"
        subtitle="Looking back with honesty and grace. The highs, the quiet battles, and the steady moments."
      >
        <div className="space-y-8">
          {/* Question 1: Year Feeling */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#F5E9D1]">
              If this year had a feeling, what would it be? <span className="text-[#E97832]">*</span>
            </label>
            <OptionSelector
              options={feelingOptions}
              selected={formData.yearFeeling}
              onSelect={(opt) => updateFormData({ yearFeeling: opt })}
              columns={1}
              customOptionLabel="Something else"
              customValue={formData.customYearFeeling}
              onCustomChange={(val) => updateFormData({ customYearFeeling: val })}
              customPlaceholder="Describe the feeling of your year..."
            />
          </div>

          {/* Question 2: Proud of (Optional) */}
          <div className="space-y-2 pt-2 border-t border-[#D4A64C]/10">
            <TextResponse
              label="What is something you are proud of this year? (Optional)"
              placeholder="A milestone, a quiet victory, surviving a tough week, or simply showing up..."
              value={formData.proudOf}
              onChange={(val) => updateFormData({ proudOf: val })}
              multiline={true}
              rows={2}
              maxLength={220}
              helperText="Big or small, your pride is valid."
            />
          </div>

          {/* Question 3: Gratitude (Multi-select) */}
          <div className="space-y-3 pt-2 border-t border-[#D4A64C]/10">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[#F5E9D1]">
                What are you grateful for?
              </label>
              <span className="text-xs text-[#A39B92]">Select all that apply</span>
            </div>
            <OptionSelector
              options={gratitudeOptions}
              selected={formData.gratitude}
              onSelect={(opt) => toggleGratitude(opt)}
              isMulti={true}
              columns={2}
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
