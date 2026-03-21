import { useAssignments } from '../hooks/useAssignments';
import { AssignmentItem } from './AssignmentItem';
import { Plus } from 'lucide-react';

interface DashboardProps {
  onAddTask: () => void;
}

export const Dashboard = ({ onAddTask }: DashboardProps) => {
  const { assignments } = useAssignments();

  return (
    <div className="pb-20">
      {assignments.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-display text-navy/40 text-xl">No assignments yet</p>
          <p className="text-navy/30 mt-2">Tap + to add your first task!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(assignment => (
            <AssignmentItem key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}

      {/* Floating add button */}
      <div className="fixed bottom-24 right-6 flex flex-col items-center">
        <span className="text-navy/60 text-sm italic mb-1" style={{ fontFamily: 'cursive' }}>
          Add task
        </span>
        <button
          onClick={onAddTask}
          className="w-16 h-16 bg-navy rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        >
          <Plus className="w-8 h-8 text-white" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
