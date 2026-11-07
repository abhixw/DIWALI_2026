import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ChevronDown, ChevronUp } from 'lucide-react';

interface FutureLetterProps {
  futureLetter: string;
}

export const FutureLetter: React.FC<FutureLetterProps> = ({ futureLetter }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="relative w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-[#1C1A17] to-[#121110] border border-[#D4A64C]/30 shadow-[0_15px_45px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      {/* Header bar styled like an envelope flap */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 sm:px-8 py-5 flex items-center justify-between text-left border-b border-[#D4A64C]/20 bg-[#1F1C18]/60 hover:bg-[#25221E] transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7B3428]/40 border border-[#D4A64C]/40 flex items-center justify-center text-[#E9BD62]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#D4A64C] font-semibold">
              Time Capsule
            </p>
            <h3 className="text-lg sm:text-xl font-heading text-[#F5F0E8] font-bold">
              A Letter to Your Future Self
            </h3>
          </div>
        </div>

        <div className="text-[#A39B92]">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Collapsible Letter Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-10"
          >
            <div className="relative p-6 sm:p-8 rounded-2xl bg-[#141311] border border-[#D4A64C]/15 shadow-inner">
              {/* Wax Seal Symbol */}
              <div className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-gradient-to-br from-[#7B3428] to-[#4A1E17] border border-[#E9BD62]/50 flex items-center justify-center text-[10px] text-[#FFF4CC] font-bold shadow-md">
                2027
              </div>

              <div className="text-base sm:text-lg md:text-xl font-letter text-[#F5E9D1] leading-relaxed whitespace-pre-line tracking-wide">
                {futureLetter}
              </div>

              <div className="mt-6 pt-4 border-t border-[#D4A64C]/10 text-xs text-[#A39B92] text-right italic font-letter">
                To be re-opened next Diwali
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
