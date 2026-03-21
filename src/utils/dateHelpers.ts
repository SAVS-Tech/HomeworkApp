import { format, isSameDay, isBefore, addDays } from 'date-fns';

export const formatDate = (date: string): string => format(new Date(date), 'MMM d, yyyy');

export const isDueToday = (dueDate: string, today: string): boolean => 
  isSameDay(new Date(dueDate), new Date(today));

export const isOverdue = (dueDate: string): boolean => 
  isBefore(new Date(dueDate), new Date());

export const addDaysToDate = (date: Date, amount: number): Date => 
  addDays(date, amount);