import React from 'react';
import { useStoryStore } from '../store/storyStore';
import { PageTransition } from '../components/common/PageTransition';
import { QuestionCard } from '../components/journey/QuestionCard';
import { OptionSelector } from '../components/journey/OptionSelector';
import { Button } from '../components/common/Button';

export const LifeChapter: React.FC = () => {
  const { formData, updateFormData, nextStep, prevStep } = useStoryStore();

  const isYoung = formData.ageGroup === 'Under 13' || formData.ageGroup === '13–17';

  // Age-adapted occupation list
  const occupationOptions = isYoung
    ? ['School Student', 'College Student', 'Exploring My Interests', 'Creative Learner', 'Other']
    : [
        'Software Engineer / Developer',
        'Working Professional',
        'Entrepreneur',
        'Business Owner',
        'College Student',
        'Homemaker',
        'Freelancer / Creative',
        'Healthcare Professional',
        'Teacher / Professor',
        'Job Seeker',
        'Retired',
        'Other',
      ];

  const chapterOptions = [
    'Exploring possibilities',
    'Building my career',
    'Working towards a dream',
    'Starting something new',
    'Focusing on my family',
    'Learning and growing',
    'Enjoying a peaceful chapter',
    'Still figuring things out',
    'Something else',
  ];

  const hasOccupation =
    Boolean(formData.occupation) &&
    (formData.occupation !== 'Other' || Boolean(formData.customOccupation.trim()));

  const hasChapter =
    Boolean(formData.currentChapter) &&
    (formData.currentChapter !== 'Something else' || Boolean(formData.customChapter.trim()));

  const canContinue = hasOccupation && hasChapter;

  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <QuestionCard
        stepNumber={2}
        title="Your Current Chapter"
        subtitle="Every season of life has its own quiet meaning."
      >
        <div className="space-y-8">
          {/* Question 1: Occupation */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#F5E9D1]">
              What does life look like for you right now? <span className="text-[#E97832]">*</span>
            </label>
            <OptionSelector
              options={occupationOptions}
              selected={formData.occupation}
              onSelect={(opt) => updateFormData({ occupation: opt })}
              columns={2}
              customOptionLabel="Other"
              customValue={formData.customOccupation}
              onCustomChange={(val) => updateFormData({ customOccupation: val })}
              customPlaceholder="Enter your occupation or daily role..."
            />
          </div>

          {/* Question 2: Current Chapter */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#F5E9D1]">
              How would you describe your current chapter? <span className="text-[#E97832]">*</span>
            </label>
            <OptionSelector
              options={chapterOptions}
              selected={formData.currentChapter}
              onSelect={(opt) => updateFormData({ currentChapter: opt })}
              columns={2}
              customOptionLabel="Something else"
              customValue={formData.customChapter}
              onCustomChange={(val) => updateFormData({ customChapter: val })}
              customPlaceholder="Describe your current chapter..."
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
