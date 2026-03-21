import { Assignment } from './assignment';

export interface ScheduleBlock {
  id: string;
  assignmentId: string;
  date: string; // ISO string
  hour: number; // 12–17 (12 PM–5 PM)
  title: string;
  importance: Assignment['importance'];
  dueDate: string;
}
