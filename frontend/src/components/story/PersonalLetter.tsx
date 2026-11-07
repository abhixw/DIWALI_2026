import React from 'react';
import { motion } from 'framer-motion';

interface PersonalLetterProps {
  letter: string;
  name?: string;
}

export const PersonalLetter: React.FC<PersonalLetterProps> = ({ letter }) => {
  // Split letter into paragraphs
  const paragraphs = letter.split('\n\n').filter((p) => p.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 bg-[#171513]/90 border border-[#D4A64C]/30 shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-md"
    >
      {/* Decorative Gold Header Ribbon */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A64C]/60" />
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4A64C] font-medium">
          A Letter Written For You
        </span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A64C]/60" />
      </div>

      {/* Letter Body in Cormorant Garamond */}
      <div className="space-y-6 text-lg sm:text-xl md:text-2xl font-letter text-[#F5F0E8] leading-relaxed tracking-wide selection:bg-[#D4A64C]/30">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className="whitespace-pre-line text-[#F5E9D1]/95">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Decorative Closing Signature */}
      <div className="mt-8 pt-6 border-t border-[#D4A64C]/15 flex items-center justify-between text-xs sm:text-sm text-[#A39B92]">
        <span className="italic font-letter text-base text-[#D4A64C]">The Diwali Within</span>
        <span>Every Light Has a Story</span>
      </div>
    </motion.div>
  );
};
