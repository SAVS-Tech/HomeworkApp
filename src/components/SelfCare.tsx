import { useState, useEffect } from 'react';
import { SelfCareTip } from '../types/selfCare';

export const SelfCare = () => {
  const [tips, setTips] = useState<SelfCareTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const response = await fetch('/self-care-tips.json');
        if (!response.ok) {
          throw new Error('Failed to load self care tips');
        }
        const data = await response.json();
        setTips(data.filter((tip: SelfCareTip) => tip.active));
      } catch (err) {
        setError('Unable to load self care tips');
        console.error('Error loading self care tips:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, []);

  if (loading) {
    return (
      <div className="pb-8">
        <div className="bg-navy rounded-2xl p-8 border-2 border-navy-light shadow-lg min-h-[400px] flex items-center justify-center">
          <span className="font-display text-cream-text text-xl">Loading self care tips...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pb-8">
        <div className="bg-navy rounded-2xl p-8 border-2 border-navy-light shadow-lg min-h-[400px] flex items-center justify-center">
          <span className="font-display text-cream-text text-xl">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="bg-navy rounded-2xl p-8 border-2 border-navy-light shadow-lg min-h-[400px]">
        <ul className="space-y-4">
          {tips.map(tip => (
            <li key={tip.id} className="flex items-center gap-4">
              <span className="w-3 h-3 bg-cream-text rounded-full flex-shrink-0" />
              <span className="font-display text-cream-text text-xl md:text-2xl tracking-wide">
                {tip.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
