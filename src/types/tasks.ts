export type TaskApprovalStatus = 'pending_hod' | 'pending_principal' | 'approved' | 'rejected';

export interface AdminTaskType {
  id: string;
  slNo: number;
  title: string;
  description: string;
  creditsPerPeriod: number;
  period: 'year' | 'semester';
  maxCredits: number;
}

export interface AdminTaskAssignment {
  id: string;
  taskTypeId: string;
  userId: string;
  userName: string;
  department: string;
  status: TaskApprovalStatus;
  assignedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  remarks?: string;
  accumulatedCredits: number;
  startYear: number; // year from which credits start accumulating
}

export const ADMIN_TASK_TYPES: AdminTaskType[] = [
  {
    id: 'admin_task_7',
    slNo: 7,
    title: 'HOD, Dean, COE, Chief Warden, Director',
    description: 'HOD, Dean, COE, Chief Warden, Director, Associate Director (Research), IQAC Coordinator.',
    creditsPerPeriod: 1,
    period: 'year',
    maxCredits: 6,
  },
  {
    id: 'admin_task_8',
    slNo: 8,
    title: 'Chairman of Functional Committees',
    description: 'Chairman of all functional committees, PG Coordinators, Deputy Wardens, NSS Coordinators, NCC Coordinators, Cultural / Sports Coordinators, Associate COE, NAAC / NBA / NIRF Chief coordinators, IIC president, ERP / Timetable coordinator at the institute level.',
    creditsPerPeriod: 0.75,
    period: 'year',
    maxCredits: 5,
  },
  {
    id: 'admin_task_9',
    slNo: 9,
    title: 'Conveners / Members of Committees',
    description: 'Conveners / Members of all functional committees, Ranking Improvement committee, Strategic Planning & Monitoring committee, Members of Cultural / Sports at the institute level.',
    creditsPerPeriod: 0.5,
    period: 'year',
    maxCredits: 5,
  },
  {
    id: 'admin_task_10',
    slNo: 10,
    title: 'Departmental Activities by HOD',
    description: 'Departmental activities identified by HOD like lab in charges, or departmental level committees for a min. Period of one year.',
    creditsPerPeriod: 0.25,
    period: 'semester',
    maxCredits: 5,
  },
];

export const TASK_STATUS_LABELS: Record<TaskApprovalStatus, string> = {
  pending_hod: 'Pending HOD Approval',
  pending_principal: 'Pending Principal Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};
