import { Importance } from '../types/assignment';

interface PriorityGaugeProps {
  importance: Importance;
  size?: number;
}

export const PriorityGauge = ({ importance, size = 36 }: PriorityGaugeProps) => {
  const getNeedleAngle = () => {
    switch (importance) {
      case 'low': return -45;
      case 'medium': return 0;
      case 'high': return 45;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 40 28" fill="none">
      {/* Gauge arc background */}
      <path
        d="M 4 24 A 16 16 0 0 1 36 24"
        stroke="#4ade80"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="0 100"
      />
      {/* Green segment */}
      <path
        d="M 4 24 A 16 16 0 0 1 12 10"
        stroke="#4ade80"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Yellow segment */}
      <path
        d="M 12 10 A 16 16 0 0 1 28 10"
        stroke="#facc15"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Red segment */}
      <path
        d="M 28 10 A 16 16 0 0 1 36 24"
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Needle */}
      <line
        x1="20"
        y1="24"
        x2={20 + 10 * Math.cos(((getNeedleAngle() - 90) * Math.PI) / 180)}
        y2={24 + 10 * Math.sin(((getNeedleAngle() - 90) * Math.PI) / 180)}
        stroke="#1e3a5f"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="20" cy="24" r="2.5" fill="#1e3a5f" />
    </svg>
  );
};
