import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStoryStore } from '../store/storyStore';
import { DiyaAnimation } from '../components/animations/DiyaAnimation';
import { PageTransition } from '../components/common/PageTransition';
import { Button } from '../components/common/Button';

export const DiyaReveal: React.FC = () => {
  const { isDiyaLit, setDiyaLit, generateStory, nextStep, prevStep, isGenerating, error } =
    useStoryStore();
  const [hasTriggered, setHasTriggered] = useState(isDiyaLit);

  const handleIgnite = async () => {
    if (hasTriggered) return;
    setHasTriggered(true);
    setDiyaLit(true);

    // Warm golden festive confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4A64C', '#E9BD62', '#E97832', '#FFF4CC'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignored if confetti fails
    }

    // Call API in parallel
    const success = await generateStory();
    if (success) {
      setTimeout(() => {
        nextStep();
      }, 1500);
    }
  };

  const handleRetry = async () => {
    const success = await generateStory();
    if (success) {
      nextStep();
    }
  };

  return (
    <PageTransition className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 text-center overflow-hidden">
      {/* Background illumination that expands when Diya is lit */}
      <AnimatePresence>
        {isDiyaLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute inset-0 bg-radial from-[#D4A64C]/20 via-[#7B3428]/15 to-transparent blur-3xl pointer-events-none -z-10"
          />
        )}
      </AnimatePresence>

      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4A64C] font-semibold">
            {isDiyaLit ? 'The Flame Is Lit' : 'The Sacred Moment'}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-gold-gradient leading-tight">
            Light Your Diya
          </h2>

          <p className="text-base sm:text-lg text-[#F5E9D1]/90 font-light max-w-md mx-auto leading-relaxed">
            {isDiyaLit ? (
              <span className="text-[#FFF4CC]">
                {isGenerating
                  ? 'Your light is glowing. Unfolding your personalized story...'
                  : 'Your story is ready.'}
              </span>
            ) : (
              'You have shared your story. Now, light a diya for the person you are becoming.'
            )}
          </p>
        </motion.div>

        {/* Central Diya Interactive Element */}
        <div className="py-6 sm:py-8 flex justify-center">
          <DiyaAnimation
            isLit={isDiyaLit}
            size="xl"
            interactive={!isDiyaLit && !isGenerating}
            onIgnite={handleIgnite}
          />
        </div>

        {/* Status / Loading / Retry Controls */}
        <div className="space-y-4">
          {!isDiyaLit && (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleIgnite}
                className="px-8 shadow-[0_0_30px_rgba(233,189,98,0.4)]"
              >
                Tap or Click to Light Your Diya 🪔
              </Button>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 text-sm text-[#E9BD62]"
            >
              <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Crafting your personalized Diwali reflections...</span>
            </motion.div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-[#7B3428]/30 border border-[#E97832]/40 text-sm text-[#FFF4CC] space-y-3">
              <p>{error}</p>
              <Button variant="secondary" size="sm" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          )}

          {!isGenerating && !isDiyaLit && (
            <div>
              <Button variant="ghost" size="sm" onClick={prevStep} className="text-xs text-[#A39B92]">
                ← Back to previous question
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
