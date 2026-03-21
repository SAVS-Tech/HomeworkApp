import { useAssignments } from '../hooks/useAssignments';
import { AssignmentItem } from './AssignmentItem';
import { Card } from './ui/card';
import { Calendar } from 'lucide-react';

export const AssignmentList = () => {
  const { assignments } = useAssignments();
  const pendingAssignments = assignments.filter(a => !a.completed);
  const completedAssignments = assignments.filter(a => a.completed);

  return (
    <div className="space-y-6">
      {pendingAssignments.length === 0 && completedAssignments.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No assignments yet</h3>
          <p className="text-slate-500">Add your first assignment to get started!</p>
        </Card>
      ) : (
        <>
          {pendingAssignments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Pending ({pendingAssignments.length})
              </h2>
              {pendingAssignments.map(assignment => (
                <AssignmentItem key={assignment.id} assignment={assignment} />
              ))}
            </div>
          )}
          {completedAssignments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Completed ({completedAssignments.length})
              </h2>
              {completedAssignments.map(assignment => (
                <AssignmentItem key={assignment.id} assignment={assignment} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};