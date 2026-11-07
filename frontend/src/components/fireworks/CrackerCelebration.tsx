import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, X, ChevronUp } from 'lucide-react';
import { fireworkAudio } from '../../utils/audioSynthesizer';
import { CrackerRenderer, type CrackerType } from '../../utils/crackerPhysics';

interface CrackerInfo {
  id: CrackerType;
  name: string;
  hindiName: string;
  tagline: string;
  icon: string;
  badgeColor: string;
}

const CRACKERS: CrackerInfo[] = [
  {
    id: 'sparkler',
    name: 'Phooljhadi',
    hindiName: 'फुलझड़ी',
    tagline: 'Gentle glittering sparkles & sizzle',
    icon: '🎇',
    badgeColor: 'border-[#E9BD62] text-[#FFF4CC]',
  },
  {
    id: 'anar',
    name: 'Anar Fountain',
    hindiName: 'अनार',
    tagline: 'Towering golden shower of light',
    icon: '🌋',
    badgeColor: 'border-[#E97832] text-[#FFD591]',
  },
  {
    id: 'chakri',
    name: 'Chakri Spinner',
    hindiName: 'चकरी',
    tagline: 'Whizzing vortex of spinning fire',
    icon: '🌀',
    badgeColor: 'border-[#52C41A] text-[#D9F7BE]',
  },
  {
    id: 'rocket',
    name: 'Sky Shot',
    hindiName: 'रॉकेट',
    tagline: 'Whistling ascent & aerial boom',
    icon: '🚀',
    badgeColor: 'border-[#1890FF] text-[#BAE7FF]',
  },
  {
    id: 'ladi',
    name: '1,000 Ladi',
    hindiName: 'लड़ी',
    tagline: 'Rapid machine-gun crackle burst',
    icon: '🧨',
    badgeColor: 'border-[#FF4D4F] text-[#FFCCC7]',
  },
  {
    id: 'bomb',
    name: 'Sutli Bomb',
    hindiName: 'सुतली बम',
    tagline: 'Deep deafening explosive blast!',
    icon: '💣',
    badgeColor: 'border-[#D4A64C] text-[#FFF1B8]',
  },
];

export const CrackerCelebration: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<CrackerRenderer | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCracker, setActiveCracker] = useState<string | null>(null);
  const [screenFlash, setScreenFlash] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new CrackerRenderer(canvasRef.current);
    rendererRef.current = renderer;

    const handleResize = () => {
      renderer.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const triggerScreenFlash = () => {
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 200);
  };

  const burstCracker = (type: CrackerType, name: string) => {
    setActiveCracker(name);
    setTimeout(() => setActiveCracker(null), 2500);

    const renderer = rendererRef.current;

    switch (type) {
      case 'sparkler':
        fireworkAudio.playSparkler();
        renderer?.igniteSparkler();
        break;
      case 'anar':
        fireworkAudio.playAnar();
        renderer?.igniteAnar();
        break;
      case 'chakri':
        fireworkAudio.playChakri();
        renderer?.igniteChakri();
        break;
      case 'rocket':
        fireworkAudio.playRocket(() => triggerScreenFlash());
        renderer?.igniteRocket();
        break;
      case 'ladi':
        fireworkAudio.playLadi();
        renderer?.igniteLadi();
        break;
      case 'bomb':
        fireworkAudio.playBomb();
        setTimeout(triggerScreenFlash, 400);
        renderer?.igniteBomb();
        break;
    }
  };

  // Allow clicking anywhere on the screen to shoot an aerial firework!
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    fireworkAudio.playRocket(() => triggerScreenFlash());
    rendererRef.current?.igniteRocket(x, y);

    setActiveCracker('Sky Shot');
    setTimeout(() => setActiveCracker(null), 2000);
  };

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    fireworkAudio.setMuted(nextState);
  };

  return (
    <>
      {/* Fullscreen Overlay Canvas for Interactive Cracker Blasts */}
      <canvas
        ref={canvasRef}
        onClick={isOpen ? handleCanvasClick : undefined}
        className="fixed inset-0"
        style={{
          background: 'transparent',
          zIndex: 25,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        title={isOpen ? 'Click anywhere in the night sky to launch a rocket!' : ''}
      />

      {/* Screen flash effect on big explosions */}
      {screenFlash && (
        <div className="fixed inset-0 z-40 bg-white/20 pointer-events-none transition-opacity duration-150" />
      )}

      {/* Celebration Notification Toast when Cracker blasts */}
      <AnimatePresence>
        {activeCracker && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-[#1B1916]/95 border border-[#E9BD62] shadow-[0_0_30px_rgba(233,189,98,0.5)] text-center pointer-events-none backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🪔</span>
              <span className="text-sm font-bold text-gold-gradient">
                {activeCracker} Blasted!
              </span>
              <Sparkles className="w-4 h-4 text-[#E9BD62] animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Festive Launcher Bar */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-3 pointer-events-auto">
        <AnimatePresence>
          {isOpen ? (
            /* Expanded Cracker Showcase Drawer */
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6 rounded-3xl bg-[#171513]/95 border border-[#D4A64C]/40 shadow-[0_15px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D4A64C]/20">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🎆</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-gold-gradient">
                      Diwali Crackers Celebration
                    </h3>
                    <p className="text-[11px] text-[#A39B92]">
                      Tap any cracker to blast with authentic real-life sound & visuals!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSound}
                    className="p-2 rounded-xl bg-[#25221E] hover:bg-[#302B25] text-[#E9BD62] border border-[#D4A64C]/30 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-[#25221E] hover:bg-[#302B25] text-[#A39B92] hover:text-[#F5E9D1] transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 6 Cracker Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
                {CRACKERS.map((c) => (
                  <motion.button
                    key={c.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => burstCracker(c.id, c.name)}
                    className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-[#201D19] to-[#141311] border border-[#D4A64C]/25 hover:border-[#E9BD62] hover:shadow-[0_0_20px_rgba(233,189,98,0.3)] transition-all cursor-pointer group text-center select-none"
                  >
                    <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                      {c.icon}
                    </span>
                    <span className="text-xs font-bold text-[#F5E9D1] leading-tight">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-[#E9BD62]/80 font-serif">
                      {c.hindiName}
                    </span>
                    <span className="text-[9px] text-[#A39B92] mt-1 line-clamp-1">
                      Tap to blast
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-3 pt-2 text-center text-[11px] text-[#D4A64C]/70 italic">
                ✨ Pro-tip: You can also tap anywhere on the screen sky to launch a rocket!
              </div>
            </motion.div>
          ) : (
            /* Minimized Floating Button in Bottom Right */
            <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsOpen(true)}
                className="group flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#7B3428] via-[#1E1B17] to-[#7B3428] border border-[#E9BD62]/60 shadow-[0_0_25px_rgba(233,189,98,0.35)] backdrop-blur-md cursor-pointer select-none"
              >
                <span className="text-xl animate-bounce">🎇</span>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold text-gold-gradient flex items-center gap-1">
                    <span>Burst Crackers</span>
                    <ChevronUp className="w-3.5 h-3.5 text-[#E9BD62] group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div className="text-[10px] text-[#A39B92] hidden sm:block">
                    Real sound & fireworks
                  </div>
                </div>
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
