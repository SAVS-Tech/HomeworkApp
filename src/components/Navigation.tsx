import { Home, PenSquare, Calendar, Heart, Settings } from 'lucide-react';
import type { View } from '../App';
import { StudyFlowLogo } from './StudyFlowLogo';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard' as const, label: 'Home', icon: Home },
    { id: 'assignment' as const, label: 'New', icon: PenSquare },
    { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
    { id: 'selfcare' as const, label: 'Self Care', icon: Heart },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-gradient-to-t from-navy to-navy-light border-t-2 border-navy-light sticky bottom-0 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-cream-text scale-110'
                    : 'text-cream-text/50 hover:text-cream-text/80'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-display tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 pb-2 pt-1 border-t border-cream-text/10">
          <StudyFlowLogo size={20} />
          <span className="text-cream-text/40 text-[10px] font-display tracking-widest">STUDYFLOW</span>
        </div>
      </div>
    </nav>
  );
};
