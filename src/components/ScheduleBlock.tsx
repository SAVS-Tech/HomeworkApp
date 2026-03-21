import { ScheduleBlock } from '../types/schedule';
import { Clock } from 'lucide-react';

interface StudyBlockProps {
  block: ScheduleBlock;
}

export const StudyBlock = ({ block }: StudyBlockProps) => {
  const getImportanceColor = () => {
    switch (block.importance) {
      case 'high': return 'bg-red-500 border-red-600';
      case 'medium': return 'bg-amber-500 border-amber-600';
      case 'low': return 'bg-emerald-500 border-emerald-600';
    }
  };

  const timeSlots: Record<number, string> = {
    16: '4:00 PM',
    17: '5:00 PM',
    18: '6:00 PM',
    19: '7:00 PM',
    20: '8:00 PM',
  };

  return (
    <div className={`p-3 rounded-lg border-2 ${getImportanceColor()} text-white transition-all hover:scale-105`}>
      <div className="flex items-center gap-2 text-xs opacity-90 mb-1">
        <Clock className="w-3 h-3" />
        {timeSlots[block.hour]}
      </div>
      <div className="font-medium text-sm truncate">{block.title}</div>
    </div>
  );
};