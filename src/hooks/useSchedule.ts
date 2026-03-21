import { useState, useEffect } from 'react';
import { ScheduleBlock } from '../types/schedule';
import { generateSchedule } from '../utils/scheduleAlgorithm';
import { useAssignments } from './useAssignments';

export const useSchedule = () => {
  const { assignments } = useAssignments();
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);

  useEffect(() => {
    setSchedule(generateSchedule(assignments));
  }, [assignments]);

  return { schedule };
};