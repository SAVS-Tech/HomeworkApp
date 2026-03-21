import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { useAssignments } from '../hooks/useAssignments';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export const CalendarView = () => {
  const { assignments } = useAssignments();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAssignmentsForDay = (date: Date) => {
    return assignments.filter(a => isSameDay(new Date(a.dueDate), date));
  };

  const getDayColor = (date: Date) => {
    const dayAssignments = getAssignmentsForDay(date);
    if (dayAssignments.length === 0) return '';
    const hasHigh = dayAssignments.some(a => a.importance === 'high' && !a.completed);
    const hasPending = dayAssignments.some(a => !a.completed);
    if (hasHigh) return 'bg-red-100 border-red-300';
    if (hasPending) return 'bg-amber-100 border-amber-300';
    return 'bg-emerald-100 border-emerald-300';
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button onClick={previousMonth} variant="outline" size="sm" className="border-slate-300">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button onClick={nextMonth} variant="outline" size="sm" className="border-slate-300">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const assignmentsForDay = getAssignmentsForDay(day);
          return (
            <div
              key={day.toISOString()}
              className={`min-h-24 p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                isToday(day) ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              } ${getDayColor(day)}`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-700' : 'text-slate-700'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {assignmentsForDay.slice(0, 2).map(assignment => (
                  <div
                    key={assignment.id}
                    className={`text-xs p-1 rounded truncate ${
                      assignment.completed ? 'bg-slate-200 text-slate-500' : 'bg-white text-slate-700'
                    }`}
                  >
                    {assignment.title}
                  </div>
                ))}
                {assignmentsForDay.length > 2 && (
                  <div className="text-xs text-slate-600">
                    +{assignmentsForDay.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};