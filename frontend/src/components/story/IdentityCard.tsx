import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { DiwaliIdentity } from '../../types/story';

interface IdentityCardProps {
  identity: DiwaliIdentity;
}

export const IdentityCard: React.FC<IdentityCardProps> = ({ identity }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-b from-[#1E1B17] via-[#161412] to-[#11100F] border border-[#D4A64C]/40 shadow-[0_0_50px_rgba(212,166,76,0.18)] overflow-hidden"
    >
      {/* Decorative Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-radial from-[#E9BD62]/20 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative Mandala / Star Icon */}
      <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#D4A64C]/30 via-[#E9BD62]/20 to-transparent border border-[#E9BD62]/50 text-[#FFF4CC] mb-5 shadow-[0_0_20px_rgba(233,189,98,0.3)]">
        <Sparkles className="w-7 h-7 text-[#E9BD62] animate-pulse" />
      </div>

      <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#D4A64C] font-semibold mb-2">
        Your Diwali Identity
      </p>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-gold-gradient tracking-tight mb-4">
        {identity.title}
      </h2>

      <p className="text-base sm:text-lg text-[#F5E9D1]/90 font-light max-w-lg mx-auto leading-relaxed">
        {identity.description}
      </p>
    </motion.div>
  );
};
