import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LeaveEntry, LeaveStatus } from '@/types/leave';

interface LeaveContextType {
  entries: LeaveEntry[];
  addLeave: (entry: Omit<LeaveEntry, 'id'>) => void;
  updateLeave: (id: string, updates: Partial<LeaveEntry>) => void;
  getLeavesByApplicant: (applicantId: string) => LeaveEntry[];
  getPendingHODLeaves: (department: string) => LeaveEntry[];
  getPendingPrincipalLeaves: () => LeaveEntry[];
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

const STORAGE_KEY = 'leave_entries';

// Demo leaves for testing
const DEMO_LEAVES: LeaveEntry[] = [
  {
    id: '1',
    applicantId: '1',
    applicantName: 'Dr. Rajesh Kumar',
    department: 'CSE',
    leaveType: 'sick',
    startDate: '2024-03-01',
    endDate: '2024-03-02',
    reason: 'Medical appointment',
    status: 'pending_hod',
    appliedAt: '2024-02-28T10:00:00Z',
  },
  {
    id: '2',
    applicantId: '2',
    applicantName: 'Dr. Priya Sharma',
    department: 'CSE',
    leaveType: 'casual',
    startDate: '2024-03-10',
    endDate: '2024-03-11',
    reason: 'Personal work',
    status: 'pending_principal',
    appliedAt: '2024-03-05T09:00:00Z',
  },
];

export function LeaveProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LeaveEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse leave entries:', e);
        setEntries(DEMO_LEAVES);
      }
    } else {
      setEntries(DEMO_LEAVES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_LEAVES));
    }
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const addLeave = (entry: Omit<LeaveEntry, 'id'>) => {
    const newEntry: LeaveEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const updateLeave = (id: string, updates: Partial<LeaveEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const getLeavesByApplicant = (applicantId: string): LeaveEntry[] => {
    return entries.filter((e) => e.applicantId === applicantId);
  };

  const getPendingHODLeaves = (department: string): LeaveEntry[] => {
    return entries.filter(
      (e) => e.department === department && e.status === 'pending_hod'
    );
  };

  const getPendingPrincipalLeaves = (): LeaveEntry[] => {
    return entries.filter((e) => e.status === 'pending_principal');
  };

  return (
    <LeaveContext.Provider
      value={{
        entries,
        addLeave,
        updateLeave,
        getLeavesByApplicant,
        getPendingHODLeaves,
        getPendingPrincipalLeaves,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeave() {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
}
