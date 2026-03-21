import { Assignment } from '../types/assignment';

export const saveAssignments = (assignments: Assignment[]): void => {
  localStorage.setItem('assignments', JSON.stringify(assignments));
};

export const loadAssignments = (): Assignment[] => {
  const saved = localStorage.getItem('assignments');
  if (!saved) return [];
  const parsed = JSON.parse(saved) as Assignment[];
  return parsed.map(a => ({
    ...a,
    stressLevel: a.stressLevel ?? 3,
  }));
};