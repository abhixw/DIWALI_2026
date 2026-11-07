import React from 'react';

interface TextResponseProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  helperText?: string;
}

export const TextResponse: React.FC<TextResponseProps> = ({
  label,
  placeholder = 'Write here...',
  value,
  onChange,
  multiline = false,
  rows = 3,
  maxLength = 250,
  helperText,
}) => {
  const currentLen = value.length;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#F5E9D1]">
          {label}
        </label>
      )}

      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3 bg-[#141312] border border-[#D4A64C]/30 rounded-2xl text-[#F5F0E8] placeholder-[#A39B92]/60 focus:outline-none focus:border-[#E9BD62] focus:ring-1 focus:ring-[#E9BD62] transition-all resize-none text-sm sm:text-base leading-relaxed"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3.5 bg-[#141312] border border-[#D4A64C]/30 rounded-2xl text-[#F5F0E8] placeholder-[#A39B92]/60 focus:outline-none focus:border-[#E9BD62] focus:ring-1 focus:ring-[#E9BD62] transition-all text-sm sm:text-base"
        />
      )}

      <div className="flex items-center justify-between text-xs text-[#A39B92] px-1">
        <span>{helperText || ''}</span>
        <span>
          {currentLen} / {maxLength}
        </span>
      </div>
    </div>
  );
};
