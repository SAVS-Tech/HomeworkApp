import { Assignment } from '../types/assignment';
import { ScheduleBlock } from '../types/schedule';
import { addDays, isBefore, startOfWeek, format } from 'date-fns';

export const generateSchedule = (assignments: Assignment[]): ScheduleBlock[] => {
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

    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    let currentDay = new Date(Math.max(weekStart.getTime(), today.getTime()));

    while (remainingHours > 0 && isBefore(currentDay, addDays(dueDate, 1))) {
      const dateStr = format(currentDay, 'yyyy-MM-dd');
      const currentDayHours = scheduledHours[dateStr] || 0;

      if (currentDayHours < 6) {
        const hour = 12 + currentDayHours;
        blocks.push({
          id: `${assignment.id}-${dateStr}-${hour}`,
          assignmentId: assignment.id,
          date: dateStr,
          hour,
          title: assignment.title,
          importance: assignment.importance,
          dueDate: assignment.dueDate,
        });
        scheduledHours[dateStr] = currentDayHours + 1;
        remainingHours--;
      }

      currentDay = addDays(currentDay, 1);
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
