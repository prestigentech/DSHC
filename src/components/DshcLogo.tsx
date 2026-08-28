import React from 'react';

interface DshcLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'icon-only';
  theme?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export const DshcLogoIcon: React.FC<{ className?: string; size?: number | string }> = ({ 
  className = "w-9 h-9", 
  size 
}) => {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="DSHC Mark"
    >
      <defs>
        {/* Soft subtle gradients for high-end rendering */}
        <linearGradient id="dshcCrossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#004D6D" />
          <stop offset="100%" stopColor="#025B7F" />
        </linearGradient>
        <linearGradient id="dshcBrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A887" />
          <stop offset="100%" stopColor="#00C49F" />
        </linearGradient>
      </defs>

      {/* LEFT: Deep Blue-Teal Medical Cross */}
      {/* Top arm of cross */}
      <path
        d="M52 14 H78 V48 H52 Z"
        fill="url(#dshcCrossGrad)"
      />
      {/* Left arm of cross */}
      <path
        d="M20 48 H52 V82 H20 C16.7 82 14 79.3 14 76 V54 C14 50.7 16.7 48 20 48 Z"
        fill="url(#dshcCrossGrad)"
      />
      {/* Bottom arm of cross */}
      <path
        d="M52 82 H78 V116 C78 119.3 75.3 122 72 122 H58 C54.7 122 52 119.3 52 116 Z"
        fill="url(#dshcCrossGrad)"
      />
      {/* Center connection block */}
      <path
        d="M52 48 H74 V62 H62 C59.8 62 58 63.8 58 66 V74 C58 76.2 59.8 78 62 78 H74 V82 H52 Z"
        fill="url(#dshcCrossGrad)"
      />
      {/* White puzzle keyway inset in cross */}
      <rect x="64" y="66" width="10" height="8" rx="2" fill="white" />

      {/* RIGHT: Emerald/Teal Brain Silhouette & Neural Circuit */}
      {/* Brain Outer Silhouette Curves */}
      <path
        d="M78 16 C88 12 102 14 110 22 C118 18 132 22 136 34 C144 38 148 50 144 60 C150 70 148 84 140 92 C142 102 136 114 124 118 C116 122 104 120 96 116 C90 120 82 120 78 116 V82 H84 C86.2 82 88 80.2 88 78 V66 C88 63.8 86.2 62 84 62 H78 V16 Z"
        fill="none"
        stroke="url(#dshcBrainGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Brain Circuit Internal Pathways */}
      {/* Circuit Line 1 (Upper) */}
      <path
        d="M80 38 H96 L108 50"
        stroke="#00A887"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Node 1 */}
      <circle cx="108" cy="50" r="5.5" fill="#F59E0B" stroke="#00A887" strokeWidth="2" />

      {/* Circuit Line 2 (Middle) */}
      <path
        d="M80 66 H98 L114 66"
        stroke="#00A887"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Node 2 */}
      <circle cx="114" cy="66" r="5.5" fill="#F59E0B" stroke="#00A887" strokeWidth="2" />

      {/* Circuit Line 3 (Lower) */}
      <path
        d="M80 94 H94 L106 82"
        stroke="#00A887"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Node 3 */}
      <circle cx="106" cy="82" r="5.5" fill="#F59E0B" stroke="#00A887" strokeWidth="2" />

      {/* Bottom Neural/Circuit Connector Stem & Ring */}
      <path
        d="M78 122 V134"
        stroke="#00A887"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="78" cy="142" r="7" fill="none" stroke="#00A887" strokeWidth="4.5" />
    </svg>
  );
};

export const DshcLogo: React.FC<DshcLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  theme = 'light',
  showSubtitle = true,
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]', gap: 'gap-1.5' },
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[11px]', gap: 'gap-2.5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs', gap: 'gap-3' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-sm', gap: 'gap-3.5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isDark = theme === 'dark';

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <DshcLogoIcon className={currentSize.icon} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${currentSize.gap} shrink-0 ${className}`}>
      {/* Vector Medical Cross + Neural Circuit Icon */}
      <DshcLogoIcon className={`${currentSize.icon} shrink-0`} />

      {/* DSHC Title & Subtitle Branding */}
      <div className="flex flex-col justify-center leading-none select-none">
        <div 
          className={`font-black tracking-tight ${currentSize.text} leading-tight ${
            isDark ? 'text-white' : 'text-[#004365]'
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          DSHC
        </div>

        {showSubtitle && variant === 'full' && (
          <div className="flex flex-col mt-0.5">
            <span 
              className={`font-semibold tracking-normal ${currentSize.sub} leading-tight ${
                isDark ? 'text-cyan-200/90' : 'text-[#1E3A5F]'
              }`}
            >
              Decision Support
            </span>
            <span 
              className={`font-normal tracking-normal ${currentSize.sub} leading-tight ${
                isDark ? 'text-slate-300/80' : 'text-slate-600'
              }`}
            >
              in Healthcare
            </span>
          </div>
        )}

        {variant === 'compact' && (
          <span 
            className={`font-medium tracking-tight text-[10px] ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Ghana CDSS
          </span>
        )}
      </div>
    </div>
  );
};
