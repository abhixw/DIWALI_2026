import React from 'react';
import { motion } from 'framer-motion';

interface DiyaAnimationProps {
  isLit?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onIgnite?: () => void;
  className?: string;
}

export const DiyaAnimation: React.FC<DiyaAnimationProps> = ({
  isLit = true,
  size = 'md',
  interactive = false,
  onIgnite,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={interactive && !isLit ? onIgnite : undefined}
      role={interactive ? 'button' : 'img'}
      aria-label={isLit ? 'A glowing festive Diya' : 'An unlit Diya. Click to light.'}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(e) => {
        if (interactive && !isLit && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onIgnite?.();
        }
      }}
    >
      {/* Ambient Pulsing Glow Behind Diya */}
      {isLit && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.08, 0.98, 1.05, 1],
            opacity: [0.7, 0.95, 0.75, 0.9, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-10 w-44 h-44 rounded-full bg-radial-glow blur-2xl pointer-events-none"
        />
      )}

      {/* Interactive prompt hint when unlit */}
      {interactive && !isLit && (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-10 text-xs font-medium tracking-widest uppercase text-[#E9BD62] bg-[#1B1916]/80 px-3 py-1 rounded-full border border-[#D4A64C]/40 pointer-events-none shadow-lg"
        >
          Tap to Light
        </motion.div>
      )}

      <svg
        viewBox="0 0 200 160"
        className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Flame Gradients */}
          <radialGradient id="flameCore" cx="50%" cy="65%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FFF2B2" />
            <stop offset="60%" stopColor="#E9BD62" />
            <stop offset="90%" stopColor="#E97832" />
            <stop offset="100%" stopColor="rgba(233, 120, 50, 0)" />
          </radialGradient>

          <radialGradient id="flameOuter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(233, 189, 98, 0.9)" />
            <stop offset="60%" stopColor="rgba(233, 120, 50, 0.5)" />
            <stop offset="100%" stopColor="rgba(123, 52, 40, 0)" />
          </radialGradient>

          {/* Clay Diya Gradients */}
          <linearGradient id="clayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B3653B" />
            <stop offset="40%" stopColor="#7B3428" />
            <stop offset="80%" stopColor="#4A1E17" />
            <stop offset="100%" stopColor="#2D110D" />
          </linearGradient>

          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6B29" />
            <stop offset="30%" stopColor="#E9BD62" />
            <stop offset="50%" stopColor="#FFF4CC" />
            <stop offset="70%" stopColor="#E9BD62" />
            <stop offset="100%" stopColor="#8A6B29" />
          </linearGradient>

          <radialGradient id="oilPool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A64C" />
            <stop offset="70%" stopColor="#5E2E18" />
            <stop offset="100%" stopColor="#30150A" />
          </radialGradient>
        </defs>

        {/* Diya Shadow */}
        <ellipse cx="100" cy="148" rx="65" ry="12" fill="rgba(0,0,0,0.55)" />

        {/* Flame (Only visible when lit) */}
        {isLit && (
          <g className="flame-animation">
            {/* Outer flame aura */}
            <ellipse
              cx="100"
              cy="52"
              rx="24"
              ry="38"
              fill="url(#flameOuter)"
              className="filter blur-sm"
            />

            {/* Main Teardrop Flame */}
            <path
              d="M100 15 
                 C108 35, 122 55, 116 75 
                 C110 88, 90 88, 84 75 
                 C78 55, 92 35, 100 15 Z"
              fill="url(#flameCore)"
            />

            {/* Hot Inner Flame Core */}
            <path
              d="M100 35 
                 C104 48, 110 60, 107 72 
                 C104 80, 96 80, 93 72 
                 C90 60, 96 48, 100 35 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        )}

        {/* Wick */}
        <path
          d="M100 78 C99 74, 98 70, 101 64"
          stroke={isLit ? '#FFF4CC' : '#332E2B'}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Diya Clay Base */}
        <path
          d="M32 94 
             C38 136, 162 136, 168 94 
             C145 106, 55 106, 32 94 Z"
          fill="url(#clayGradient)"
          stroke="#4A1E17"
          strokeWidth="1.5"
        />

        {/* Oil Interior Pool */}
        <ellipse
          cx="100"
          cy="94"
          rx="68"
          ry="15"
          fill="url(#oilPool)"
          stroke="url(#goldRim)"
          strokeWidth="2.5"
        />

        {/* Decorative Golden Rangoli Dots on Rim */}
        <g fill="#E9BD62" opacity="0.8">
          <circle cx="48" cy="94" r="1.5" />
          <circle cx="62" cy="98" r="1.5" />
          <circle cx="80" cy="101" r="1.8" />
          <circle cx="100" cy="102" r="2" />
          <circle cx="120" cy="101" r="1.8" />
          <circle cx="138" cy="98" r="1.5" />
          <circle cx="152" cy="94" r="1.5" />
        </g>
      </svg>
    </div>
  );
};
