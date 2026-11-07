import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Shield, RotateCcw } from 'lucide-react';
import { useStoryStore } from './store/storyStore';
import { GoldenParticles } from './components/animations/GoldenParticles';
import { ProgressBar } from './components/common/ProgressBar';
import { checkBackendHealth } from './services/api';

// Pages
import { Home } from './pages/Home';
import { Introduction } from './pages/Introduction';
import { LifeChapter } from './pages/LifeChapter';
import { Reflection } from './pages/Reflection';
import { Dreams } from './pages/Dreams';
import { DiyaReveal } from './pages/DiyaReveal';
import { MyStory } from './pages/MyStory';
import { CardStudio } from './pages/CardStudio';
import { CrackerCelebration } from './components/fireworks/CrackerCelebration';

export const App: React.FC = () => {
  const { currentStep, resetJourney, setStep } = useStoryStore();

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const renderCurrentPage = () => {
    switch (currentStep) {
      case 1:
        return <Home key="home" />;
      case 2:
        return <Introduction key="introduction" />;
      case 3:
        return <LifeChapter key="life-chapter" />;
      case 4:
        return <Reflection key="reflection" />;
      case 5:
        return <Dreams key="dreams" />;
      case 6:
        return <DiyaReveal key="diya-reveal" />;
      case 7:
        return <MyStory key="my-story" />;
      case 8:
        return <CardStudio key="card-studio" />;
      default:
        return <Home key="home-default" />;
    }
  };

  const showProgressBar = currentStep >= 2 && currentStep <= 6;

  return (
    <div className="min-h-screen bg-[#11100F] text-[#F5F0E8] font-sans relative flex flex-col justify-between selection:bg-[#D4A64C]/30 selection:text-[#E9BD62]">
      {/* Ambient Floating Golden Particles */}
      <GoldenParticles density="normal" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full border-b border-[#D4A64C]/15 bg-[#11100F]/80 backdrop-blur-md px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / Brand */}
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7B3428] via-[#D4A64C] to-[#E9BD62] p-0.5 shadow-[0_0_12px_rgba(233,189,98,0.5)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#11100F] rounded-full flex items-center justify-center">
                <span className="text-sm">🪔</span>
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold font-heading text-gold-gradient tracking-wide block leading-none">
                The Diwali Within
              </span>
              <span className="text-[10px] text-[#A39B92] tracking-wider uppercase block mt-0.5">
                Every Light Has a Story
              </span>
            </div>
          </button>

          {/* Right Header Status / Reset */}
          <div className="flex items-center gap-4">
            {currentStep > 1 && (
              <button
                onClick={resetJourney}
                className="text-xs text-[#A39B92] hover:text-[#F5E9D1] transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-white/5"
                title="Restart Journey"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}



          </div>
        </div>

        {/* Step Progress Bar during questionnaire */}
        {showProgressBar && (
          <div className="pt-2">
            <ProgressBar currentStep={currentStep} totalSteps={5} />
          </div>
        )}
      </header>

      {/* Main Dynamic Viewport */}
      <main className="relative z-10 flex-grow flex items-center justify-center w-full max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <AnimatePresence mode="wait">{renderCurrentPage()}</AnimatePresence>
      </main>

      {/* Interactive Real Diwali Crackers Launcher */}
      <CrackerCelebration />

      {/* Footer with Privacy Notice & Philosophy */}
      <footer className="relative z-20 w-full border-t border-[#D4A64C]/15 bg-[#0D0C0B]/90 backdrop-blur-md px-4 py-6 text-center text-xs text-[#A39B92] space-y-2">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#D4A64C]" />
            <span>Private & secure. Your personal reflections are never stored permanently.</span>
          </p>

          <p className="font-serif italic text-sm text-[#F5E9D1]/80">
            Remember. Release. Rise.
          </p>
        </div>

        <p className="text-[11px] text-[#A39B92]/60 pt-1">
          © 2026 The Diwali Within. An interactive emotional journey.
        </p>
      </footer>
    </div>
  );
};

export default App;
