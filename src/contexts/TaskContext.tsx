import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminTaskAssignment, TaskApprovalStatus } from '@/types/tasks';

interface TaskContextType {
  assignments: AdminTaskAssignment[];
  addAssignment: (assignment: Omit<AdminTaskAssignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<AdminTaskAssignment>) => void;
  deleteAssignment: (id: string) => void;
  getAssignmentsByUser: (userId: string) => AdminTaskAssignment[];
  getAssignmentsByDepartment: (department: string) => AdminTaskAssignment[];
  getPendingHODApprovals: (department: string) => AdminTaskAssignment[];
  getPendingPrincipalApprovals: () => AdminTaskAssignment[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'admin_task_assignments';

const DEMO_ASSIGNMENTS: AdminTaskAssignment[] = [
  {
    id: 'ta1',
    taskTypeId: 'admin_task_9',
    userId: '1',
    userName: 'Dr. Rajesh Kumar',
    department: 'CSE',
    status: 'pending_hod',
    assignedAt: '2024-01-10T10:00:00Z',
    accumulatedCredits: 0,
    startYear: 2024,
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<AdminTaskAssignment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAssignments(JSON.parse(stored));
      } catch {
        setAssignments(DEMO_ASSIGNMENTS);
      }
    } else {
      setAssignments(DEMO_ASSIGNMENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ASSIGNMENTS));
    }
  }, []);

  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
  }, [assignments]);

  const addAssignment = (assignment: Omit<AdminTaskAssignment, 'id'>) => {
    const newAssignment: AdminTaskAssignment = {
      ...assignment,
      id: Date.now().toString(),
    };
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const updateAssignment = (id: string, updates: Partial<AdminTaskAssignment>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const getAssignmentsByUser = (userId: string) =>
    assignments.filter((a) => a.userId === userId);

  const getAssignmentsByDepartment = (department: string) =>
    assignments.filter((a) => a.department === department);

  const getPendingHODApprovals = (department: string) =>
    assignments.filter((a) => a.department === department && a.status === 'pending_hod');

  const getPendingPrincipalApprovals = () =>
    assignments.filter((a) => a.status === 'pending_principal');

  return (
    <TaskContext.Provider
      value={{
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        getAssignmentsByUser,
        getAssignmentsByDepartment,
        getPendingHODApprovals,
        getPendingPrincipalApprovals,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
