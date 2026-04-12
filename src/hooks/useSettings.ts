import { useState, useEffect } from 'react';
import { ScheduleSettings, DEFAULT_SETTINGS } from '../types/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<ScheduleSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('scheduleSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<ScheduleSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('scheduleSettings', JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
};
