import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Assignment } from '../types/assignment';
import { saveAssignments, loadAssignments } from '../utils/storage';
import { useSettings } from '../hooks/useSettings';
import { isBefore, startOfDay, addDays } from 'date-fns';

interface AssignmentContextType {
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'completed'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const AssignmentContext = createContext<AssignmentContextType | null>(null);

export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();
  const [assignments, setAssignments] = useState<Assignment[]>(loadAssignments());

  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  // Auto-cleanup effect
  useEffect(() => {
    const cleanupAssignments = () => {
      const today = startOfDay(new Date());
      
      setAssignments(prev => prev.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const isPastDue = isBefore(dueDate, today);
        
        // Auto-delete completed assignments if setting is enabled
        if (settings?.autoDeleteCompleted && assignment.completed) {
          return false;
        }
        
        // Auto-delete past due assignments if setting is enabled
        if (settings?.autoDeleteAfterDue && isPastDue) {
          return false;
        }
        
        return true;
      }));
    };

    // Run cleanup every hour and on mount
    cleanupAssignments();
    const interval = setInterval(cleanupAssignments, 60 * 60 * 1000); // Every hour
    
    return () => clearInterval(interval);
  }, [settings?.autoDeleteCompleted, settings?.autoDeleteAfterDue]);

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'completed'>) => {
    setAssignments(prev => [
      ...prev,
      { ...assignment, id: crypto.randomUUID(), completed: false },
    ]);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const toggleComplete = (id: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <AssignmentContext.Provider
      value={{ assignments: sortedAssignments, addAssignment, updateAssignment, deleteAssignment, toggleComplete }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignmentContext = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignmentContext must be used within an AssignmentProvider');
  }
  return context;
};
