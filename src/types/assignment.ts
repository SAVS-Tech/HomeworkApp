export type Importance = 'low' | 'medium' | 'high';

export interface Assignment {
  id: string;
  title: string;
  dueDate: string; // ISO string
  importance: Importance;
  estimatedHours: number;
  stressLevel: number; // 1-5
  completed: boolean;
  preferredStartDate?: string; // ISO string, optional
  allowSplit?: boolean; // Allow splitting across days, defaults to true
}
