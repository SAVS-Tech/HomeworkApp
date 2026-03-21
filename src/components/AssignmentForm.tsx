import { useState } from 'react';
import { Importance } from '../types/assignment';
import { useAssignments } from '../hooks/useAssignments';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, isBefore, startOfDay } from 'date-fns';

interface AssignmentFormProps {
  onBack: () => void;
}

const TIME_OPTIONS = [
  { label: '15 MINS', value: 0.25 },
  { label: '30 MINS', value: 0.5 },
  { label: '45 MINS', value: 0.75 },
  { label: '1 HOUR', value: 1 },
  { label: '1.5 HOUR', value: 1.5 },
  { label: '2 HOURS', value: 2 },
  { label: '3 HOURS', value: 3 },
  { label: '4+HOURS', value: 4 },
];

export const AssignmentForm = ({ onBack }: AssignmentFormProps) => {
  const { addAssignment } = useAssignments();
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [preferredStartDate, setPreferredStartDate] = useState<string>('');
  const [preferredStartTime, setPreferredStartTime] = useState<string>('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [importance, setImportance] = useState<Importance>('medium');
  const [stressLevel, setStressLevel] = useState(3);
  const [estimatedHours, setEstimatedHours] = useState(1);

  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(calendarDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const handleSubmit = () => {
    if (!title || !selectedDate) return;
    
    let preferredStartDateTime: string | undefined;
    if (preferredStartDate && preferredStartTime) {
      preferredStartDateTime = `${preferredStartDate}T${preferredStartTime}:00`;
    }
    
    addAssignment({ 
      title, 
      dueDate: selectedDate, 
      importance, 
      estimatedHours, 
      stressLevel,
      preferredStartDate: preferredStartDateTime
    });
    onBack();
  };

  const handleDayClick = (day: Date) => {
    // Prevent selecting dates before today
    if (isBefore(day, startOfDay(new Date()))) {
      return;
    }
    setSelectedDate(format(day, 'yyyy-MM-dd'));
  };

  return (
    <div className="pb-8">
      <div className="bg-navy rounded-3xl p-6 md:p-8 border-4 border-green-600/30 shadow-xl">
        <h2 className="font-display text-cream-text text-2xl md:text-3xl text-center mb-8">
          New Assignment
        </h2>

        {/* Assignment Title */}
        <div className="mb-8">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-2">
            Assignment Title
          </label>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="What do you need to do?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full max-w-md bg-cream-text/20 border-2 border-cream-text/30 rounded-full px-5 py-2.5 text-center font-display text-cream-text text-sm placeholder:text-cream-text/50 focus:outline-none focus:border-cream-text/60"
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-8">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-3">
            Due Date
          </label>
          <div className="flex justify-center">
            <div className="bg-cream rounded-2xl p-4 w-fit">
              {/* Month navigation */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <button onClick={() => setCalendarDate(subMonths(calendarDate, 1))} className="text-navy font-bold text-lg px-2">&lt;</button>
                <span className="font-display text-navy text-sm">
                  {format(calendarDate, 'MMMM yyyy')}
                </span>
                <button onClick={() => setCalendarDate(addMonths(calendarDate, 1))} className="text-navy font-bold text-lg px-2">&gt;</button>
              </div>
              {/* Day grid */}
              <div className="grid grid-cols-7 gap-1">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="w-7 h-7 flex items-center justify-center text-[10px] font-bold text-navy/50">
                    {d}
                  </div>
                ))}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-7 h-7" />
                ))}
                {days.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isSelected = dateStr === selectedDate;
                  const isBeforeToday = isBefore(day, startOfDay(new Date()));
                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDayClick(day)}
                      disabled={isBeforeToday}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isSelected
                          ? 'bg-navy text-white'
                          : isBeforeToday
                          ? 'text-navy/20 cursor-not-allowed'
                          : 'text-navy hover:bg-navy/10'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Start Date & Time (Optional) */}
        <div className="mb-8">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-3">
            Preferred Start Date & Time (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex justify-center">
              <input
                type="date"
                value={preferredStartDate}
                onChange={e => setPreferredStartDate(e.target.value)}
                placeholder="Select date..."
                className={`bg-cream-text/20 border-2 rounded-full px-4 py-2 text-center font-display text-sm focus:outline-none transition-all ${
                  preferredStartDate 
                    ? 'border-cream-text/30 text-cream-text' 
                    : 'border-cream-text/10 text-cream-text/40 placeholder:text-cream-text/30'
                }`}
              />
            </div>
            <div className="flex justify-center">
              <input
                type="time"
                value={preferredStartTime}
                onChange={e => setPreferredStartTime(e.target.value)}
                className={`bg-cream-text/20 border-2 rounded-full px-4 py-2 text-center font-display text-sm focus:outline-none transition-all ${
                  preferredStartTime 
                    ? 'border-cream-text/30 text-cream-text' 
                    : 'border-cream-text/10 text-cream-text/40'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div className="mb-8">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-3">
            Stress Level
          </label>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setStressLevel(level)}
                className={`w-11 h-11 rounded-full font-display text-sm flex items-center justify-center transition-all ${
                  stressLevel === level
                    ? 'bg-cream-text/30 text-white border-2 border-cream-text'
                    : 'bg-cream-text/10 text-cream-text/70 border-2 border-cream-text/20 hover:border-cream-text/40'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex justify-between max-w-[260px] mx-auto mt-1">
            <span className="font-display text-cream-text/60 text-[10px]">CHILL</span>
            <span className="font-display text-cream-text/60 text-[10px]">STRESSFUL</span>
          </div>
        </div>

        {/* Importance */}
        <div className="mb-8">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-3">
            Importance
          </label>
          <div className="flex justify-center gap-3">
            {(['low', 'medium', 'high'] as Importance[]).map(level => (
              <button
                key={level}
                onClick={() => setImportance(level)}
                className={`px-5 py-2 rounded-full font-display text-sm tracking-wide transition-all ${
                  importance === level
                    ? 'bg-cream-text/30 text-white border-2 border-cream-text'
                    : 'bg-cream-text/10 text-cream-text/70 border-2 border-cream-text/20 hover:border-cream-text/40'
                }`}
              >
                {level === 'medium' ? 'MID' : level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="mb-6">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-3">
            Time
          </label>
          <div className="flex flex-wrap justify-center gap-2">
            {TIME_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => setEstimatedHours(option.value)}
                className={`px-3 py-1.5 rounded-full font-display text-[10px] md:text-xs tracking-wide transition-all ${
                  estimatedHours === option.value
                    ? 'bg-cream-text/30 text-white border-2 border-cream-text'
                    : 'bg-cream-text/10 text-cream-text/70 border-2 border-cream-text/20 hover:border-cream-text/40'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!title || !selectedDate}
          className="w-full bg-cream-text/20 hover:bg-cream-text/30 disabled:opacity-30 rounded-full py-3 font-display text-cream-text tracking-wide transition-all"
        >
          Add Assignment
        </button>
      </div>
    </div>
  );
};
