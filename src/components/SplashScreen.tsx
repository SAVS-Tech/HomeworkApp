import { useEffect, useState } from 'react';
import { StudyFlowLogo } from './StudyFlowLogo';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading after 2 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Complete after fade animation (1 second)
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-navy via-navy-light to-navy z-50 flex items-center justify-center transition-opacity duration-1000 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="animate-pulse">
          <StudyFlowLogo size={128} />
        </div>
        
        {/* App Name */}
        <div className="text-center">
          <h1 className="font-display text-cream-text text-5xl font-bold tracking-wide mb-2">
            StudyFlow
          </h1>
          <p className="text-cream-text/50 text-sm tracking-widest">YOUR STUDY COMPANION</p>
        </div>

        {/* Loading indicator */}
        <div className="mt-8">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-cream-text/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-cream-text/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-cream-text/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
