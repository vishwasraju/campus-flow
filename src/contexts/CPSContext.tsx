import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CPSEntry, ApprovalStatus } from '@/types/cps';

interface CPSContextType {
  entries: CPSEntry[];
  addEntry: (entry: Omit<CPSEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<CPSEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByFaculty: (facultyId: string) => CPSEntry[];
  getEntriesByStatus: (status: ApprovalStatus) => CPSEntry[];
  getEntriesByDepartment: (department: string) => CPSEntry[];
  getPendingHODApprovals: (department: string) => CPSEntry[];
  getPendingPrincipalApprovals: () => CPSEntry[];
}

const CPSContext = createContext<CPSContextType | undefined>(undefined);

const STORAGE_KEY = 'cps_entries';

// Demo CPS entries
const DEMO_ENTRIES: CPSEntry[] = [
  {
    id: '1',
    facultyId: '1',
    facultyName: 'Dr. Rajesh Kumar',
    department: 'CSE',
    category: 'research',
    activityType: 'SCI Journal Publication',
    description: 'Published research paper on Machine Learning algorithms in IEEE Transactions',
    date: '2024-01-15',
    credits: 15,
    status: 'approved',
    evidence: 'https://doi.org/example',
    submittedAt: '2024-01-16T10:00:00Z',
    hodApprovedAt: '2024-01-17T14:30:00Z',
    principalApprovedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: '2',
    facultyId: '1',
    facultyName: 'Dr. Rajesh Kumar',
    department: 'CSE',
    category: 'academics',
    activityType: 'Workshop/FDP Conducted',
    description: 'Conducted 5-day FDP on Deep Learning and Neural Networks',
    date: '2024-02-10',
    credits: 10,
    status: 'pending_hod',
    submittedAt: '2024-02-11T10:00:00Z',
  },
  {
    id: '3',
    facultyId: '2',
    facultyName: 'Dr. Priya Sharma',
    department: 'CSE',
    category: 'industry',
    activityType: 'MoU Signed with Industry',
    description: 'Signed MoU with TCS for internship program',
    date: '2024-01-20',
    credits: 15,
    status: 'pending_principal',
    submittedAt: '2024-01-21T10:00:00Z',
    hodApprovedAt: '2024-01-22T11:00:00Z',
  },
];

export function CPSProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CPSEntry[]>([]);

  // Load entries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse CPS entries:', e);
        setEntries(DEMO_ENTRIES);
      }
    } else {
      setEntries(DEMO_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ENTRIES));
    }
  }, []);

  // Persist entries to localStorage
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const addEntry = (entry: Omit<CPSEntry, 'id'>) => {
    const newEntry: CPSEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const updateEntry = (id: string, updates: Partial<CPSEntry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const getEntriesByFaculty = (facultyId: string): CPSEntry[] => {
    return entries.filter((e) => e.facultyId === facultyId);
  };

  const getEntriesByStatus = (status: ApprovalStatus): CPSEntry[] => {
    return entries.filter((e) => e.status === status);
  };

  const getEntriesByDepartment = (department: string): CPSEntry[] => {
    return entries.filter((e) => e.department === department);
  };

  const getPendingHODApprovals = (department: string): CPSEntry[] => {
    return entries.filter(
      (e) => e.department === department && e.status === 'pending_hod'
    );
  };

  const getPendingPrincipalApprovals = (): CPSEntry[] => {
    return entries.filter((e) => e.status === 'pending_principal');
  };

  return (
    <CPSContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntriesByFaculty,
        getEntriesByStatus,
        getEntriesByDepartment,
        getPendingHODApprovals,
        getPendingPrincipalApprovals,
      }}
    >
      {children}
    </CPSContext.Provider>
  );
}

export function useCPS() {
  const context = useContext(CPSContext);
  if (context === undefined) {
    throw new Error('useCPS must be used within a CPSProvider');
  }
  return context;
}
