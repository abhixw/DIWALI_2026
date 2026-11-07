import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface PromiseCardProps {
  promise: string;
  blessing: string;
}

export const PromiseCard: React.FC<PromiseCardProps> = ({ promise, blessing }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Section D: Your Personal Promise */}
      <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#1C1714] via-[#161311] to-[#121110] border border-[#E97832]/35 shadow-[0_15px_40px_rgba(233,120,50,0.15)] text-center overflow-hidden">
        <div className="absolute top-4 left-6 text-[#E97832]/20">
          <Quote className="w-12 h-12 rotate-180" />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-[#E97832] font-semibold mb-3">
          Your Personal Promise
        </p>

        <p className="text-xl sm:text-2xl md:text-3xl font-heading font-medium text-[#FFF4CC] leading-relaxed italic max-w-lg mx-auto">
          "{promise}"
        </p>

        <p className="mt-4 text-xs text-[#A39B92] tracking-wider uppercase font-sans">
          Remember. Release. Rise.
        </p>
      </div>

      {/* Section E: Your Diwali Blessing */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#181613] border border-[#D4A64C]/30 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#D4A64C] font-semibold mb-2">
          Your Diwali Blessing
        </p>
        <p className="text-base sm:text-lg text-[#F5E9D1] font-letter leading-relaxed max-w-md mx-auto">
          {blessing}
        </p>
      </div>
    </motion.div>
  );
};
