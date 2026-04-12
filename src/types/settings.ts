export interface ScheduleSettings {
  defaultStartTime: number; // Hour in 24-hour format (9-20)
  defaultEndTime: number;   // Hour in 24-hour format (9-20)
  autoDeleteCompleted: boolean;
  autoDeleteAfterDue: boolean;
}

export const DEFAULT_SETTINGS: ScheduleSettings = {
  defaultStartTime: 9,
  defaultEndTime: 20,
  autoDeleteCompleted: false,
  autoDeleteAfterDue: false,
};
