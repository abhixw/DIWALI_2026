import React from 'react';
import { motion } from 'framer-motion';

interface OptionSelectorProps {
  options: string[];
  selected: string | string[];
  onSelect: (option: string) => void;
  isMulti?: boolean;
  columns?: 1 | 2 | 3;
  customOptionLabel?: string;
  customValue?: string;
  onCustomChange?: (val: string) => void;
  customPlaceholder?: string;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selected,
  onSelect,
  isMulti = false,
  columns = 2,
  customOptionLabel = 'Something else',
  customValue = '',
  onCustomChange,
  customPlaceholder = 'Please specify in your own words...',
}) => {
  const isSelected = (opt: string) => {
    if (isMulti && Array.isArray(selected)) {
      return selected.includes(opt);
    }
    return selected === opt;
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  };

  const isCustomActive = isSelected(customOptionLabel) || (customOptionLabel === 'Other' && isSelected('Other'));

  return (
    <div className="space-y-4">
      <div className={`grid gap-3 ${gridCols[columns]}`}>
        {options.map((option) => {
          const active = isSelected(option);

          return (
            <motion.button
              key={option}
              type="button"
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(option)}
              className={`relative px-4 py-3.5 sm:px-5 sm:py-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer select-none flex items-center justify-between text-sm sm:text-base ${
                active
                  ? 'bg-gradient-to-r from-[#D4A64C]/20 via-[#E9BD62]/15 to-[#D4A64C]/10 border-[#E9BD62] text-[#FFF4CC] shadow-[0_0_20px_rgba(233,189,98,0.25)] ring-1 ring-[#E9BD62]/60'
                  : 'bg-[#181614]/70 border-[#D4A64C]/20 text-[#F5F0E8] hover:border-[#D4A64C]/45 hover:bg-[#201E1A]'
              }`}
            >
              <span className="font-medium pr-2 leading-snug">{option}</span>

              {/* Checkmark or Radio indicator */}
              <div
                className={`w-5 h-5 flex-shrink-0 rounded-${
                  isMulti ? 'md' : 'full'
                } flex items-center justify-center border transition-all ${
                  active
                    ? 'bg-[#E9BD62] border-[#E9BD62] text-[#11100F]'
                    : 'border-[#D4A64C]/40 bg-transparent'
                }`}
              >
                {active && (
                  <svg className="w-3 h-3 stroke-current stroke-[3] fill-none" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Conditional Custom Input Field */}
      {isCustomActive && onCustomChange && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-2"
        >
          <input
            type="text"
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder={customPlaceholder}
            maxLength={120}
            className="w-full px-4 py-3 bg-[#141312] border border-[#D4A64C]/40 rounded-xl text-[#F5F0E8] placeholder-[#A39B92]/60 focus:outline-none focus:border-[#E9BD62] focus:ring-1 focus:ring-[#E9BD62] transition-colors text-sm sm:text-base"
          />
        </motion.div>
      )}
    </div>
  );
};
