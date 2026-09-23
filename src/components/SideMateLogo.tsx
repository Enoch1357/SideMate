import React from 'react';

interface SideMateLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SideMateLogo: React.FC<SideMateLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Refined Geometric S-Mate Badge */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-teal-400 p-[1.5px] shadow-md shadow-indigo-500/25 shrink-0 group`}>
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-teal-400/20 opacity-80" />
          
          {/* Custom SVG Monogram */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 relative z-10"
          >
            {/* Upper S-Curve */}
            <path 
              d="M16 6C14.5 4.5 12.5 4 10.5 4.5C8 5.1 6.5 7.2 7 9.5C7.5 11.8 9.5 12.8 12 13.5C15 14.3 17 15.5 17.5 18C18 20.5 16 22.5 13 22.8C10.5 23 8.5 21.8 7.5 20.5" 
              stroke="url(#sm-grad-1)" 
              strokeWidth="2.4" 
              strokeLinecap="round"
            />
            {/* Partner Node / Companion Spark */}
            <circle cx="17.5" cy="6.5" r="2" fill="#38bdf8" />
            <path 
              d="M12 11L14.5 13.5" 
              stroke="#2dd4bf" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="sm-grad-1" x1="6" y1="4" x2="18" y2="23" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="0.5" stopColor="#6366f1" />
                <stop offset="1" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${textSizes[size]} bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent`}>
              SideMate
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Digital Product &amp; Creator OS
          </span>
        </div>
      )}
    </div>
  );
};
