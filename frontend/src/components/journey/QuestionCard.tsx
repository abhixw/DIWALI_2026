import React from 'react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  stepNumber?: number;
  title: string;
  subtitle?: string;
  isOptional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  stepNumber,
  title,
  subtitle,
  isOptional = false,
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#1B1916]/95 via-[#181614]/90 to-[#121110]/95 border border-[#D4A64C]/25 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden ${className}`}
    >
      {/* Decorative Traditional Rangoli Corner Accents */}
      <div className="absolute -top-12 -right-12 w-28 h-28 border border-[#D4A64C]/20 rounded-full pointer-events-none rotate-45" />
      <div className="absolute -bottom-12 -left-12 w-28 h-28 border border-[#E97832]/20 rounded-full pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 mb-6 text-center sm:text-left">
        <div className="flex items-center justify-between gap-4 mb-2">
          {stepNumber && (
            <span className="text-xs uppercase tracking-widest text-[#D4A64C] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9BD62] inline-block animate-pulse" />
              Chapter 0{stepNumber}
            </span>
          )}
          {isOptional && (
            <span className="text-[11px] font-medium text-[#A39B92] bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              Optional
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F5F0E8] tracking-tight leading-snug">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-[#A39B92] font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
