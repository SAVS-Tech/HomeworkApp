import { useState, useEffect } from 'react';
import { ScheduleBlock } from '../types/schedule';
import { generateSchedule } from '../utils/scheduleAlgorithm';
import { useAssignments } from './useAssignments';
import { useSettings } from './useSettings';

export const useSchedule = () => {
  const { assignments } = useAssignments();
  const { settings } = useSettings();
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);

  useEffect(() => {
    setSchedule(generateSchedule(assignments, settings.defaultStartTime, settings.defaultEndTime));
  }, [assignments, settings]);

  return { schedule };
};