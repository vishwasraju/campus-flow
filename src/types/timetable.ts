export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimeSlot {
  id: string;
  start: string; // HH:mm format
  end: string;   // HH:mm format
  label: string; // e.g., "9:00-10:00"
  isBreak?: boolean;
  isLunch?: boolean;
}

export interface TimetableCell {
  id: string;
  day: Day;
  timeSlotId: string;
  subjectCode?: string;
  subjectName?: string;
  facultyName?: string;
  batch?: string;
  lab?: string;
  room?: string;
  colSpan?: number;
  rowSpan?: number;
  isMerged?: boolean;
  mergedFrom?: string[]; // IDs of cells merged into this
}

export interface SubjectDetail {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  labIncharge?: string;
  mentor?: string;
  classTeacher?: string;
}

export interface TimetableHeader {
  collegeName: string;
  accreditation?: string;
  department: string;
  version: string;
  academicYear: string;
  semester: string;
  section: string;
  roomNumber: string;
  wef: string; // With Effect From
}

export type TimetableStatus = 'draft' | 'pending_faculty' | 'pending_hod' | 'approved';

export interface FacultyApproval {
  facultyId: string;
  facultyName: string;
  approved: boolean;
  approvedAt?: string;
  remarks?: string;
}

export interface TimetableData {
  id?: string;
  header: TimetableHeader;
  timeSlots: TimeSlot[];
  cells: TimetableCell[];
  subjectDetails: SubjectDetail[];
  status: TimetableStatus;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  facultyApprovals: FacultyApproval[];
  hodApprovedAt?: string;
  hodApprovedBy?: string;
  hodRemarks?: string;
}
