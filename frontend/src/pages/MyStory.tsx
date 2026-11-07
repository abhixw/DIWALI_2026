import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, RotateCcw, Sparkles, Sliders } from 'lucide-react';
import { useStoryStore } from '../store/storyStore';
import { PageTransition } from '../components/common/PageTransition';
import { IdentityCard } from '../components/story/IdentityCard';
import { PersonalLetter } from '../components/story/PersonalLetter';
import { FutureLetter } from '../components/story/FutureLetter';
import { PromiseCard } from '../components/story/PromiseCard';
import { Button } from '../components/common/Button';
import { shareDiwaliStory } from '../utils/whatsappShare';

export const MyStory: React.FC = () => {
  const { generatedStory, formData, refineTone, isGenerating, setStep, resetJourney } =
    useStoryStore();
  const [activeTone, setActiveTone] = useState(formData.tone || 'heartfelt');
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  if (!generatedStory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <p className="text-lg text-[#F5E9D1] mb-4">No story found yet.</p>
        <Button variant="primary" onClick={() => setStep(1)}>
          Begin Journey
        </Button>
      </div>
    );
  }

  const tones = [
    { id: 'heartfelt', label: 'Heartfelt' },
    { id: 'emotional', label: 'Emotional' },
    { id: 'motivational', label: 'Motivational' },
    { id: 'poetic', label: 'Poetic' },
    { id: 'simple and heartfelt', label: 'Simple' },
  ];

  const handleToneChange = async (tone: string) => {
    setActiveTone(tone);
    await refineTone(tone);
  };

  const handleShare = async () => {
    const ok = await shareDiwaliStory(generatedStory, formData.name);
    if (ok) {
      setShareSuccess('Opening share options...');
      setTimeout(() => setShareSuccess(null), 3000);
    }
  };

  return (
    <PageTransition className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1B1916] border border-[#D4A64C]/30 text-xs font-medium text-[#E9BD62]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E9BD62]" />
          <span>The Diwali Within  •  Personalized Journey</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-gold-gradient tracking-tight">
          Your Diwali Story
        </h1>
        <p className="text-xs sm:text-sm text-[#A39B92]">
          Every Light Has a Story. Every Flame Has a Purpose.
        </p>
      </div>

      {/* Tone Refinement Switcher */}
      <div className="p-4 rounded-2xl bg-[#181613]/80 border border-[#D4A64C]/20 backdrop-blur-md max-w-xl mx-auto">
        <div className="flex items-center justify-between text-xs text-[#A39B92] mb-2 px-1">
          <span className="flex items-center gap-1.5 font-medium text-[#E9BD62]">
            <Sliders className="w-3.5 h-3.5" />
            Refine Tone:
          </span>
          {isGenerating && <span className="text-[#E9BD62] animate-pulse">Adapting voice...</span>}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => handleToneChange(t.id)}
              disabled={isGenerating}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeTone === t.id
                  ? 'bg-[#E9BD62] text-[#11100F] shadow-md font-semibold'
                  : 'bg-[#141311] text-[#A39B92] hover:text-[#F5E9D1] border border-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section A: Your Diwali Identity */}
      <IdentityCard identity={generatedStory.identity} />

      {/* Section B: A Letter Written For You */}
      <PersonalLetter letter={generatedStory.diwali_letter} name={formData.name} />

      {/* Section C: Letter To Your Future Self */}
      <FutureLetter futureLetter={generatedStory.future_letter} />

      {/* Section D & E: Personal Promise & Blessing */}
      <PromiseCard
        promise={generatedStory.personal_promise}
        blessing={generatedStory.blessing}
      />

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-6 border-t border-[#D4A64C]/20 space-y-4 max-w-xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setStep(8)}
            className="w-full flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(233,189,98,0.3)]"
          >
            <Download className="w-5 h-5" />
            Create Greeting Card
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5 text-[#E9BD62]" />
            Share My Story
          </Button>
        </div>

        {shareSuccess && (
          <p className="text-xs text-center text-[#E9BD62] animate-fade-in">{shareSuccess}</p>
        )}

        <div className="flex justify-center pt-2">
          <button
            onClick={resetJourney}
            className="inline-flex items-center gap-2 text-xs text-[#A39B92] hover:text-[#F5E9D1] transition-colors cursor-pointer select-none py-2 px-4 rounded-full hover:bg-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start a New Journey
          </button>
        </div>
      </motion.div>
    </PageTransition>
  );
};
