import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Clock, Trash2, Save } from 'lucide-react';
import { StudyFlowLogo } from './StudyFlowLogo';

export const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [startTime, setStartTime] = useState(settings.defaultStartTime);
  const [endTime, setEndTime] = useState(settings.defaultEndTime);

  const handleSave = () => {
    updateSettings({
      defaultStartTime: startTime,
      defaultEndTime: endTime,
    });
    alert('Settings saved!');
  };

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM
  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="pb-8">
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-8 border-2 border-navy-light shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <StudyFlowLogo size={48} />
          <div>
            <p className="text-cream-text/40 text-[10px] tracking-widest">STUDYFLOW</p>
            <h2 className="font-display text-cream-text text-2xl">Settings</h2>
          </div>
        </div>
        
        {/* Time Range */}
        <div className="mb-8">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-3">
            Default Schedule Hours
          </label>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cream-text/60" />
              <select
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="bg-cream-text/20 border-2 border-cream-text/30 rounded-lg px-3 py-2 text-cream-text font-display text-sm focus:outline-none focus:border-cream-text/60"
              >
                {hours.map(hour => (
                  <option key={hour} value={hour}>
                    {formatHour(hour)}
                  </option>
                ))}
              </select>
            </div>
            
            <span className="font-display text-cream-text/60 self-center">to</span>
            
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cream-text/60" />
              <select
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="bg-cream-text/20 border-2 border-cream-text/30 rounded-lg px-3 py-2 text-cream-text font-display text-sm focus:outline-none focus:border-cream-text/60"
              >
                {hours.map(hour => (
                  <option key={hour} value={hour}>
                    {formatHour(hour)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Auto Delete Settings */}
        <div className="mb-8">
          <label className="font-display text-cream-text text-sm md:text-base tracking-wide block mb-3">
            Auto Cleanup
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoDeleteCompleted}
                onChange={(e) => updateSettings({ autoDeleteCompleted: e.target.checked })}
                className="w-4 h-4 rounded border-2 border-cream-text/30 bg-cream-text/20 focus:outline-none focus:border-cream-text/60"
              />
              <span className="font-display text-cream-text text-sm">
                Auto-delete completed assignments
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoDeleteAfterDue}
                onChange={(e) => updateSettings({ autoDeleteAfterDue: e.target.checked })}
                className="w-4 h-4 rounded border-2 border-cream-text/30 bg-cream-text/20 focus:outline-none focus:border-cream-text/60"
              />
              <span className="font-display text-cream-text text-sm">
                Auto-delete assignments after due date
              </span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-cream-text/20 hover:bg-cream-text/30 rounded-full py-3 font-display text-cream-text tracking-wide transition-all flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
};
