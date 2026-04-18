export const StudyFlowLogo = ({ size = 64, className = "" }: { size?: number; className?: string }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#2b4c7e" />
        </linearGradient>
        <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Gradient rounded square background */}
      <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#bgGradient)" />
      
      {/* Stack of books - bottom book with shadow */}
      <rect x="16" y="66" width="68" height="16" rx="4" fill="url(#bookGradient)" />
      <line x1="16" y1="74" x2="84" y2="74" stroke="#faf5eb" strokeWidth="2.5" opacity="0.8" />
      
      {/* Stack of books - middle book */}
      <rect x="18" y="50" width="64" height="16" rx="4" fill="url(#bookGradient)" />
      <line x1="18" y1="58" x2="82" y2="58" stroke="#faf5eb" strokeWidth="2.5" opacity="0.8" />
      
      {/* Stack of books - top book */}
      <rect x="20" y="34" width="60" height="16" rx="4" fill="url(#bookGradient)" />
      <line x1="20" y1="42" x2="80" y2="42" stroke="#faf5eb" strokeWidth="2.5" opacity="0.8" />
      
      {/* Lightbulb base */}
      <rect x="40" y="24" width="20" height="10" rx="3" fill="#1e3a5f" />
      <line x1="42" y1="29" x2="58" y2="29" stroke="#faf5eb" strokeWidth="2" opacity="0.9" />
      
      {/* Lightbulb bulb with gradient and glow */}
      <circle cx="50" cy="16" r="14" fill="url(#bulbGradient)" stroke="#1e3a5f" strokeWidth="3" filter="url(#glow)" />
      
      {/* Lightbulb filament */}
      <path d="M45 16 L47 11 L50 13 L53 11 L55 16" stroke="#1e3a5f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      
      {/* Dynamic light rays with glow */}
      <line x1="50" y1="-2" x2="50" y2="4" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      <line x1="34" y1="6" x2="38" y2="10" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      <line x1="66" y1="6" x2="62" y2="10" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      <line x1="28" y1="16" x2="34" y2="16" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      <line x1="72" y1="16" x2="66" y2="16" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
      
      {/* Sparkle accents */}
      <path d="M88 12 L90 10 L92 12 L90 14 Z" fill="#1e3a5f" />
      <path d="M12 88 L14 86 L16 88 L14 90 Z" fill="#1e3a5f" />
      <circle cx="85" cy="25" r="2.5" fill="#1e3a5f" opacity="0.6" />
      <circle cx="15" cy="75" r="2.5" fill="#1e3a5f" opacity="0.6" />
    </svg>
  );
};
