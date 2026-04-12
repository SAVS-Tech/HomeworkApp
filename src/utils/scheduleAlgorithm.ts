import { Assignment } from '../types/assignment';
import { ScheduleBlock } from '../types/schedule';
import { addDays, isBefore, startOfWeek, format, parseISO } from 'date-fns';

export const generateSchedule = (assignments: Assignment[], defaultStartTime = 9, defaultEndTime = 20): ScheduleBlock[] => {
  const sortedAssignments = [...assignments]
    .filter(a => !a.completed)
    .sort((a, b) => {
      const priorityA = getPriorityScore(a);
      const priorityB = getPriorityScore(b);
      return priorityB - priorityA;
    });

  const blocks: ScheduleBlock[] = [];
  const scheduledHours: Record<string, number> = {};

  sortedAssignments.forEach(assignment => {
    let remainingHours = Math.ceil(assignment.estimatedHours);
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Use preferred start date if available, otherwise start from today or week start
    let currentDay: Date;
    if (assignment.preferredStartDate) {
      currentDay = parseISO(assignment.preferredStartDate);
      currentDay.setHours(0, 0, 0, 0);
    } else {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      currentDay = new Date(Math.max(weekStart.getTime(), today.getTime()));
    }

    // Allow scheduling on the due date itself
    while (remainingHours > 0 && !isBefore(addDays(dueDate, 1), currentDay)) {
      const dateStr = format(currentDay, 'yyyy-MM-dd');
      const currentDayHours = scheduledHours[dateStr] || 0;

      // Calculate max hours per day based on settings
      const maxHoursPerDay = defaultEndTime - defaultStartTime;
      const availableHours = maxHoursPerDay - currentDayHours;
      
      // Schedule as many consecutive hours as possible on this day
      let hoursToSchedule: number;
      
      if (assignment.allowSplit === false) {
        // If not allowed to split, only schedule if all remaining hours fit on this day
        hoursToSchedule = availableHours >= remainingHours ? remainingHours : 0;
      } else {
        // Otherwise, schedule as many as possible
        hoursToSchedule = Math.min(remainingHours, availableHours);
      }
      
      if (hoursToSchedule > 0) {
        // Use preferred start time on the preferred start date, otherwise use default start time
        let startHour = defaultStartTime;
        const isPreferredDay = assignment.preferredStartDate && 
          format(parseISO(assignment.preferredStartDate), 'yyyy-MM-dd') === dateStr;
        
        if (isPreferredDay && assignment.preferredStartDate) {
          const preferredDateTime = parseISO(assignment.preferredStartDate);
          const preferredHour = preferredDateTime.getHours();
          // Use the exact preferred hour if it's within bounds
          if (preferredHour >= defaultStartTime && preferredHour < defaultEndTime) {
            startHour = preferredHour;
          }
        }
        
        // Schedule consecutive hours
        for (let i = 0; i < hoursToSchedule; i++) {
          const hour = startHour + currentDayHours + i;
          if (hour < defaultEndTime) {
            blocks.push({
              id: `${assignment.id}-${dateStr}-${hour}`,
              assignmentId: assignment.id,
              date: dateStr,
              hour,
              title: assignment.title,
              importance: assignment.importance,
              dueDate: assignment.dueDate,
            });
          }
        }
        
        scheduledHours[dateStr] = currentDayHours + hoursToSchedule;
        remainingHours -= hoursToSchedule;
      }

      // Move to next day if there are remaining hours
      if (remainingHours > 0) {
        currentDay = addDays(currentDay, 1);
      }
    }
  });

  return blocks;
};

const getPriorityScore = (assignment: Assignment): number => {
  const importanceMap: Record<string, number> = { low: 1, medium: 2, high: 3 };
  const importanceScore = importanceMap[assignment.importance];
  const dueDate = new Date(assignment.dueDate);
  const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const urgencyScore = daysUntilDue < 0 ? 100 : Math.max(0, 10 - daysUntilDue);
  return importanceScore * 10 + urgencyScore;
};
