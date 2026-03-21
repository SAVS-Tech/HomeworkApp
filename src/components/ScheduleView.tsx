import { useSchedule } from '../hooks/useSchedule';
import { format, startOfWeek, addDays } from 'date-fns';

const HOURS = [12, 13, 14, 15, 16, 17];
const HOUR_LABELS: Record<number, string> = {
  12: '12:00 PM',
  13: '1:00 PM',
  14: '2:00 PM',
  15: '3:00 PM',
  16: '4:00 PM',
  17: '5:00 PM',
};

export const ScheduleView = () => {
  const { schedule } = useSchedule();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getBlocksForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule.filter(b => b.date === dateStr);
  };

  return (
    <div className="pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekDays.map(day => {
          const dayBlocks = getBlocksForDay(day);
          const dayName = format(day, 'EEEE');

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

              <div className="space-y-2">
                {HOURS.map(hour => {
                  const block = dayBlocks.find(b => b.hour === hour);
                  return (
                    <div key={hour} className="flex items-center gap-2 min-h-[28px]">
                      <span className="font-display text-cream-text/60 text-[10px] w-16 flex-shrink-0">
                        {HOUR_LABELS[hour]}
                      </span>
                      {block ? (
                        <div className="flex-1 bg-cream rounded-full px-3 py-1 flex items-center gap-2">
                          <span className="font-display text-navy text-[10px] truncate flex-1">
                            {block.title}
                          </span>
                          <span className="font-display text-navy/50 text-[8px] flex-shrink-0 leading-tight text-right">
                            {block.importance.toUpperCase()} PRIORITY
                            <br />
                            DUE: {block.dueDate ? format(new Date(block.dueDate + 'T12:00:00'), 'M/d/yyyy') : ''}
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
