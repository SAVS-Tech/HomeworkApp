import { useAssignments } from '../hooks/useAssignments';
import { AssignmentItem } from './AssignmentItem';
import { Plus, Calendar, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { StudyFlowLogo } from './StudyFlowLogo';

interface DashboardProps {
  onAddTask: () => void;
}

export const Dashboard = ({ onAddTask }: DashboardProps) => {
  const { assignments } = useAssignments();

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueToday = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }).length;

  const upcoming = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() > today.getTime();
  }).length;

  const completed = assignments.filter(a => a.completed).length;
  const total = assignments.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Get greeting based on time of day
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="pb-24 space-y-6">
      {/* App Header */}
      <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-6 shadow-2xl border border-navy-light/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <StudyFlowLogo size={56} />
            <div>
              <h1 className="font-display text-cream-text text-3xl font-bold tracking-wide">
                StudyFlow
              </h1>
              <p className="text-cream-text/60 text-xs tracking-wider">YOUR STUDY COMPANION</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-navy-light/50 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-cream-text" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-cream-text/10">
          <p className="text-cream-text/80 text-lg font-display">
            {getGreeting()} 🎯
          </p>
          <p className="text-cream-text/50 text-sm mt-1">Let's crush your assignments today!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-navy/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{dueToday}</p>
              <p className="text-xs text-navy/60">Due Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md border border-navy/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{upcoming}</p>
              <p className="text-xs text-navy/60">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md border border-navy/10 col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{progress}%</p>
                <p className="text-xs text-navy/60">Completed ({completed}/{total})</p>
              </div>
            </div>
            <div className="w-24 h-2 bg-navy/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={onAddTask}
          className="flex-1 bg-navy hover:bg-navy-light text-cream-text py-4 px-6 rounded-2xl font-display text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Recent Assignments */}
      <div>
        <h2 className="font-display text-navy text-xl mb-4">Recent Tasks</h2>
        {assignments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md border border-navy/10">
            <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-navy/40" />
            </div>
            <p className="font-display text-navy/60 text-xl">No tasks yet</p>
            <p className="text-navy/40 mt-2 text-sm">Tap "Add Task" to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.slice(0, 5).map(assignment => (
              <AssignmentItem key={assignment.id} assignment={assignment} />
            ))}
            {assignments.length > 5 && (
              <p className="text-center text-navy/50 text-sm py-2">
                +{assignments.length - 5} more tasks
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
