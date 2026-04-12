import { Home, PenSquare, Calendar, Heart, Settings } from 'lucide-react';
import type { View } from '../App';

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
    <nav className="bg-navy border-t-2 border-navy-light sticky bottom-0">
      <div className="max-w-4xl mx-auto flex justify-around py-2">
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
    </nav>
  );
};
