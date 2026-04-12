import { Assignment } from '../types/assignment';
import { useAssignments } from '../hooks/useAssignments';
import { PriorityGauge } from './PriorityGauge';
import { format, isBefore, startOfDay } from 'date-fns';
import { Check, Trash2 } from 'lucide-react';

interface AssignmentItemProps {
  assignment: Assignment;
}

export const AssignmentItem = ({ assignment }: AssignmentItemProps) => {
  const { toggleComplete, deleteAssignment } = useAssignments();

  const getImportanceLabel = () => {
    switch (assignment.importance) {
      case 'high': return 'HIGH PRIORITY';
      case 'medium': return 'MID PRIORITY';
      case 'low': return 'LOW PRIORITY';
    }
  };

  const formatDueDate = () => {
    try {
      return format(new Date(assignment.dueDate + 'T12:00:00'), 'M/d/yyyy');
    } catch {
      return assignment.dueDate;
    }
  };

  const isOverdue = () => {
    return isBefore(new Date(assignment.dueDate), startOfDay(new Date()));
  };

  const handleDelete = () => {
    if (confirm(`Delete "${assignment.title}"?`)) {
      deleteAssignment(assignment.id);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Checkbox */}
      <button
        onClick={() => toggleComplete(assignment.id)}
        className={`w-8 h-8 rounded-full border-3 flex-shrink-0 flex items-center justify-center transition-all ${
          assignment.completed
            ? 'bg-navy-light border-navy-light'
            : 'border-navy/40 hover:border-navy'
        }`}
      >
        {assignment.completed && <Check className="w-5 h-5 text-cream-text" strokeWidth={3} />}
      </button>

      {/* Assignment pill */}
      <div
        className={`flex-1 flex items-center gap-3 bg-navy rounded-full px-4 py-3 transition-opacity ${
          assignment.completed ? 'opacity-60' : ''
        }`}
      >
        <PriorityGauge importance={assignment.importance} size={32} />

        <span className="font-display text-white text-sm md:text-base tracking-wide flex-1 truncate">
          {assignment.title}
        </span>

        <div className="text-right flex-shrink-0">
          <div className="font-display text-cream-text text-[10px] md:text-xs tracking-wide leading-tight">
            {getImportanceLabel()}
          </div>
          <div className="font-display text-cream-text text-[10px] md:text-xs tracking-wide leading-tight">
            DUE: {formatDueDate()}
          </div>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="w-8 h-8 rounded-full border-3 border-navy/40 hover:border-red-400 hover:bg-red-900/20 flex-shrink-0 flex items-center justify-center transition-all group"
        title="Delete assignment"
      >
        <Trash2 className="w-4 h-4 text-navy/60 group-hover:text-red-400" strokeWidth={2} />
      </button>
    </div>
  );
};
