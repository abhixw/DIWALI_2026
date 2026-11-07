import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStoryStore } from '../store/storyStore';
import { DiyaAnimation } from '../components/animations/DiyaAnimation';
import { Button } from '../components/common/Button';
import { PageTransition } from '../components/common/PageTransition';

export const Home: React.FC = () => {
  const nextStep = useStoryStore((state) => state.nextStep);

  return (
    <PageTransition className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Traditional Rangoli Ring in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] md:w-[680px] aspect-square rounded-full border border-[#D4A64C]/15 pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[400px] md:w-[540px] aspect-square rounded-full border border-[#E97832]/10 pointer-events-none -z-10" />

      {/* Subtle Tagline Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B1916]/80 border border-[#D4A64C]/30 text-xs sm:text-sm font-medium text-[#E9BD62] mb-6 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#E9BD62]" />
        <span>Remember  •  Release  •  Rise</span>
      </motion.div>

      {/* Main Glowing Diya Showcase */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="my-4 sm:my-6"
      >
        <DiyaAnimation isLit={true} size="lg" />
      </motion.div>

      {/* Primary Headings */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-2xl mx-auto space-y-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-gold-gradient tracking-tight leading-[1.15]">
          Every Light Has a Story.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#F5E9D1]/85 font-light leading-relaxed max-w-xl mx-auto">
          Behind every smile is a story. Behind every dream is a journey. This Diwali, take a moment to discover yours.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-8 sm:mt-10 space-y-3"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={nextStep}
          className="group px-8 sm:px-10 py-4 text-base sm:text-lg shadow-[0_0_35px_rgba(233,189,98,0.4)]"
        >
          <span>Begin My Story</span>
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>

        <p className="text-xs sm:text-sm text-[#A39B92] tracking-wide">
          A personal Diwali experience, created just for you.
        </p>

        <p className="text-[11px] text-[#E9BD62]/90 font-medium pt-2">
          ✨ Tap the floating launcher below to burst Phooljhadi, Anar, Chakri & Bombs with authentic real-life sound!
        </p>
      </motion.div>
    </PageTransition>
  );
};
