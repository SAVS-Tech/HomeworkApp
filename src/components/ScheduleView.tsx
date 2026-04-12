import { useSchedule } from '../hooks/useSchedule';
import { useSettings } from '../hooks/useSettings';
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';
import { useState } from 'react';

export const ScheduleView = () => {
  const { schedule } = useSchedule();
  const { settings } = useSettings();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  
  const weekStart = startOfWeek(addWeeks(new Date(), currentWeekOffset), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Generate hours based on settings with fallback
  const startHour = settings?.defaultStartTime || 9;
  const endHour = settings?.defaultEndTime || 20;
  const HOURS = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const HOUR_LABELS: Record<number, string> = {};
  
  HOURS.forEach(hour => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    HOUR_LABELS[hour] = `${displayHour}:00 ${ampm}`;
  });

  const getBlocksForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule.filter(b => b.date === dateStr);
  };

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentWeekOffset(prev => prev - 1)}
          className="font-display text-cream-text bg-navy-light hover:bg-navy-light/80 px-4 py-2 rounded-lg transition-colors"
        >
          ← Previous Week
        </button>
        <h2 className="font-display text-white font-bold text-xl">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </h2>
        <button
          onClick={() => setCurrentWeekOffset(prev => prev + 1)}
          className="font-display text-cream-text bg-navy-light hover:bg-navy-light/80 px-4 py-2 rounded-lg transition-colors"
        >
          Next Week →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekDays.map(day => {
          const dayBlocks = getBlocksForDay(day);
          const dayName = format(day, 'EEEE, MMM d');

          return (
            <div
              key={day.toISOString()}
              className={`bg-navy rounded-2xl p-4 border-2 border-navy-light shadow-lg ${
                weekDays.indexOf(day) === 6 ? 'sm:col-start-1 lg:col-start-2' : ''
              }`}
            >
              <h3 className="font-display text-cream-text text-center text-lg mb-3">
                {dayName}
              </h3>

              <div className="space-y-1">
                {HOURS.map(hour => {
                  const block = dayBlocks.find(b => b.hour === hour);
                  return (
                    <div key={hour} className="flex items-center gap-2 min-h-[24px]">
                      <span className="font-display text-cream-text/60 text-[9px] w-16 flex-shrink-0">
                        {HOUR_LABELS[hour]}
                      </span>
                      {block ? (
                        <div className="flex-1 bg-cream rounded-full px-2 py-0.5 flex items-center gap-1">
                          <span className="font-display text-navy text-[9px] truncate flex-1">
                            {block.title}
                          </span>
                          <span className="font-display text-navy/50 text-[7px] flex-shrink-0 leading-tight text-right">
                            {block.importance.toUpperCase()}
                            <br />
                            DUE: {block.dueDate ? format(new Date(block.dueDate + 'T12:00:00'), 'M/d') : ''}
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {schedule.length === 0 && (
        <div className="text-center py-8 mt-4">
          <p className="font-display text-navy/40 text-lg">No study sessions scheduled</p>
          <p className="text-navy/30 mt-1 text-sm">Add assignments to generate a schedule!</p>
        </div>
      )}
    </div>
  );
};
