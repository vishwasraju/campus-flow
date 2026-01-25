export type LeaveStatus =
  | 'pending_hod'      // Faculty leave: awaiting HOD
  | 'pending_principal' // HOD leave: awaiting Principal
  | 'approved'
  | 'rejected';

export type LeaveType =
  | 'casual'
  | 'sick'
  | 'earned'
  | 'maternity'
  | 'paternity'
  | 'compensatory'
  | 'leave_without_pay'
  | 'other';

export interface LeaveEntry {
  id: string;
  applicantId: string;
  applicantName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  /** Set when HOD approves (faculty) or Principal approves (HOD leave). */
  approvedAt?: string;
  approvedBy?: 'hod' | 'principal';
  rejectedAt?: string;
  rejectedBy?: 'hod' | 'principal';
  remarks?: string;
}

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  casual: 'Casual Leave',
  sick: 'Sick Leave',
  earned: 'Earned Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  compensatory: 'Compensatory Leave',
  leave_without_pay: 'Leave Without Pay',
  other: 'Other',
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  pending_hod: 'Pending HOD Approval',
  pending_principal: 'Pending Principal Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};
