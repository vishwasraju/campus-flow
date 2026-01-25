import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TimetableData, TimetableCell, Day, TimeSlot, SubjectDetail, FacultyApproval } from '@/types/timetable';

interface TimetableContextType {
  timetable: TimetableData;
  updateCell: (cellId: string, updates: Partial<TimetableCell>) => void;
  updateHeader: (updates: Partial<TimetableData['header']>) => void;
  addCell: (cell: Omit<TimetableCell, 'id'>) => void;
  deleteCell: (cellId: string) => void;
  mergeCells: (cellIds: string[]) => void;
  splitCell: (cellId: string) => void;
  updateSubjectDetail: (subjectCode: string, updates: Partial<SubjectDetail>) => void;
  resetTimetable: () => void;
  createNewTimetable: () => void;
  loadTimetable: (id: string) => void;
  submitForApproval: (createdBy: string, createdByName: string) => void;
  approveByFaculty: (facultyId: string, facultyName: string, remarks?: string) => void;
  approveByHOD: (hodId: string, remarks?: string) => void;
  getAllTimetables: () => TimetableData[];
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

const STORAGE_KEY = 'timetable_data';
const TIMETABLES_KEY = 'timetables_list';

// Default timetable structure
const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: 't1', start: '09:00', end: '10:00', label: '9:00-10:00' },
  { id: 't2', start: '10:00', end: '11:00', label: '10:00-11:00' },
  { id: 'break1', start: '11:00', end: '11:15', label: 'BREAK', isBreak: true },
  { id: 't3', start: '11:15', end: '12:15', label: '11:15-12:15' },
  { id: 't4', start: '12:15', end: '13:15', label: '12:15-13:15' },
  { id: 'lunch', start: '13:15', end: '14:00', label: 'LUNCH', isLunch: true },
  { id: 't5', start: '14:00', end: '15:00', label: '14:00-15:00' },
  { id: 't6', start: '15:00', end: '16:00', label: '15:00-16:00' },
  { id: 't7', start: '16:00', end: '17:00', label: '16:00-17:00' },
];

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_HEADER = {
  collegeName: 'St. Joseph\'s College of Engineering',
  accreditation: 'NAAC Accredited | NBA Accredited',
  department: 'Computer Science & Engineering',
  version: '1.0',
  academicYear: '2024-2025',
  semester: 'VI',
  section: 'A',
  roomNumber: 'CSE-301',
  wef: '01-01-2024',
};

const DEFAULT_TIMETABLE: TimetableData = {
  id: undefined,
  header: DEFAULT_HEADER,
  timeSlots: DEFAULT_TIME_SLOTS,
  cells: [],
  subjectDetails: [],
  status: 'draft',
  createdBy: '',
  createdByName: '',
  createdAt: '',
  facultyApprovals: [],
};

export function TimetableProvider({ children }: { children: ReactNode }) {
  const [timetable, setTimetable] = useState<TimetableData>(DEFAULT_TIMETABLE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all fields exist
        setTimetable({
          ...DEFAULT_TIMETABLE,
          ...parsed,
          facultyApprovals: parsed.facultyApprovals || [],
          header: { ...DEFAULT_HEADER, ...parsed.header },
          timeSlots: parsed.timeSlots || DEFAULT_TIME_SLOTS,
          cells: parsed.cells || [],
          subjectDetails: parsed.subjectDetails || [],
        });
      } catch (e) {
        console.error('Failed to parse timetable:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timetable));
  }, [timetable]);

  const updateCell = (cellId: string, updates: Partial<TimetableCell>) => {
    setTimetable((prev) => ({
      ...prev,
      cells: prev.cells.map((cell) =>
        cell.id === cellId ? { ...cell, ...updates } : cell
      ),
    }));
  };

  const updateHeader = (updates: Partial<TimetableData['header']>) => {
    setTimetable((prev) => ({
      ...prev,
      header: { ...prev.header, ...updates },
    }));
  };

  const addCell = (cell: Omit<TimetableCell, 'id'>) => {
    const newCell: TimetableCell = {
      ...cell,
      id: `cell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTimetable((prev) => ({
      ...prev,
      cells: [...prev.cells, newCell],
    }));
  };

  const deleteCell = (cellId: string) => {
    setTimetable((prev) => ({
      ...prev,
      cells: prev.cells.filter((cell) => cell.id !== cellId),
    }));
  };

  const mergeCells = (cellIds: string[]) => {
    if (cellIds.length < 2) return;
    
    setTimetable((prev) => {
      const cellsToMerge = prev.cells.filter((c) => cellIds.includes(c.id));
      if (cellsToMerge.length < 2) return prev;

      const firstCell = cellsToMerge[0];
      const mergedCell: TimetableCell = {
        ...firstCell,
        id: firstCell.id,
        colSpan: cellIds.length,
        isMerged: true,
        mergedFrom: cellIds,
      };

      return {
        ...prev,
        cells: [
          ...prev.cells.filter((c) => !cellIds.includes(c.id)),
          mergedCell,
        ],
      };
    });
  };

  const splitCell = (cellId: string) => {
    setTimetable((prev) => ({
      ...prev,
      cells: prev.cells.map((cell) =>
        cell.id === cellId
          ? { ...cell, colSpan: 1, rowSpan: 1, isMerged: false, mergedFrom: undefined }
          : cell
      ),
    }));
  };

  const updateSubjectDetail = (subjectCode: string, updates: Partial<SubjectDetail>) => {
    setTimetable((prev) => ({
      ...prev,
      subjectDetails: prev.subjectDetails.map((subj) =>
        subj.subjectCode === subjectCode ? { ...subj, ...updates } : subj
      ),
    }));
  };

  const resetTimetable = () => {
    setTimetable({
      ...DEFAULT_TIMETABLE,
      id: undefined,
      status: 'draft',
      createdBy: '',
      createdByName: '',
      createdAt: '',
      facultyApprovals: [],
    });
  };

  const createNewTimetable = () => {
    const newTimetable: TimetableData = {
      ...DEFAULT_TIMETABLE,
      id: `tt-${Date.now()}`,
      status: 'draft',
    };
    setTimetable(newTimetable);
    // Don't save to list yet - only save when submitted for approval
  };

  const loadTimetable = (id: string) => {
    const timetables = getAllTimetables();
    const found = timetables.find((tt) => tt.id === id);
    if (found) {
      setTimetable({
        ...DEFAULT_TIMETABLE,
        ...found,
        facultyApprovals: found.facultyApprovals || [],
        header: { ...DEFAULT_HEADER, ...found.header },
        timeSlots: found.timeSlots || DEFAULT_TIME_SLOTS,
        cells: found.cells || [],
        subjectDetails: found.subjectDetails || [],
      });
    }
  };

  const submitForApproval = (createdBy: string, createdByName: string) => {
    const newTimetable: TimetableData = {
      ...timetable,
      id: timetable.id || `tt-${Date.now()}`,
      status: 'pending_faculty',
      createdBy,
      createdByName,
      createdAt: new Date().toISOString(),
      facultyApprovals: [],
    };
    setTimetable(newTimetable);
    
    // Save to timetables list
    const timetables = getAllTimetables();
    const existingIndex = timetables.findIndex((tt) => tt.id === newTimetable.id);
    if (existingIndex >= 0) {
      timetables[existingIndex] = newTimetable;
    } else {
      timetables.push(newTimetable);
    }
    localStorage.setItem(TIMETABLES_KEY, JSON.stringify(timetables));
  };

  const approveByFaculty = (facultyId: string, facultyName: string, remarks?: string) => {
    setTimetable((prev) => {
      const existingApproval = prev.facultyApprovals.find((a) => a.facultyId === facultyId);
      const updatedApprovals = existingApproval
        ? prev.facultyApprovals.map((a) =>
            a.facultyId === facultyId
              ? { ...a, approved: true, approvedAt: new Date().toISOString(), remarks }
              : a
          )
        : [
            ...prev.facultyApprovals,
            {
              facultyId,
              facultyName,
              approved: true,
              approvedAt: new Date().toISOString(),
              remarks,
            },
          ];

      // Check if all faculty have approved (for demo, we'll move to HOD after 2 approvals)
      // In real scenario, you'd check against a list of required faculty
      const allApproved = updatedApprovals.length >= 2 && updatedApprovals.every((a) => a.approved);
      const newStatus: TimetableData['status'] = allApproved ? 'pending_hod' : 'pending_faculty';

      const updated = {
        ...prev,
        status: newStatus,
        facultyApprovals: updatedApprovals,
      };

      // Update in timetables list
      const timetables = getAllTimetables();
      const index = timetables.findIndex((tt) => tt.id === prev.id);
      if (index >= 0) {
        timetables[index] = updated;
        localStorage.setItem(TIMETABLES_KEY, JSON.stringify(timetables));
      }

      return updated;
    });
  };

  const approveByHOD = (hodId: string, remarks?: string) => {
    setTimetable((prev) => ({
      ...prev,
      status: 'approved',
      hodApprovedAt: new Date().toISOString(),
      hodApprovedBy: hodId,
      hodRemarks: remarks,
    }));

    // Update in timetables list
    const timetables = getAllTimetables();
    const index = timetables.findIndex((tt) => tt.id === timetable.id);
    if (index >= 0) {
      timetables[index] = { ...timetable, status: 'approved', hodApprovedAt: new Date().toISOString(), hodApprovedBy: hodId, hodRemarks: remarks };
      localStorage.setItem(TIMETABLES_KEY, JSON.stringify(timetables));
    }
  };

  const getAllTimetables = (): TimetableData[] => {
    const stored = localStorage.getItem(TIMETABLES_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  return (
    <TimetableContext.Provider
      value={{
        timetable,
        updateCell,
        updateHeader,
        addCell,
        deleteCell,
        mergeCells,
        splitCell,
        updateSubjectDetail,
        resetTimetable,
        createNewTimetable,
        loadTimetable,
        submitForApproval,
        approveByFaculty,
        approveByHOD,
        getAllTimetables,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}

export function useTimetable() {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
}
