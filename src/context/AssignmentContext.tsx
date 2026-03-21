import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Assignment } from '../types/assignment';
import { saveAssignments, loadAssignments } from '../utils/storage';

interface AssignmentContextType {
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'completed'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleComplete: (id: string) => void;
}

const AssignmentContext = createContext<AssignmentContextType | null>(null);

export const AssignmentProvider = ({ children }: { children: ReactNode }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(loadAssignments());

  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

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
