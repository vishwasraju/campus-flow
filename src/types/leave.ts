export type LeaveStatus =
  | 'pending_hod'      // Faculty leave: awaiting HOD
  | 'pending_principal' // HOD leave: awaiting Principal
  | 'approved'
  | 'rejected';

export type LeaveType =
  | 'casual'
  | 'special_casual'
  | 'earned'
  | 'maternity'
  | 'paternity'
  | 'extra_ordinary'
  | 'fixed_term_contract'
  | 'temporary'
  | 'post_retirement'
  | 'restricted_holiday'
  | 'ood'
  | 'eol_medical';

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
  /** Set when Principal gives final approval (for both faculty and HOD leaves). */
  approvedAt?: string;
  approvedBy?: 'hod' | 'principal';
  rejectedAt?: string;
  rejectedBy?: 'hod' | 'principal';
  remarks?: string;
}

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  casual: 'Casual Leave',
  special_casual: 'Special Casual Leave',
  earned: 'Earned Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  extra_ordinary: 'Extra-ordinary Leave (Leave Without Pay)',
  fixed_term_contract: 'Leave for Employees on FTC',
  temporary: 'Leave for Temporary Employees',
  post_retirement: 'Leave for Post Retirement Engagement',
  restricted_holiday: 'Restricted Holiday',
  ood: 'OOD (On Other Duty)',
  eol_medical: 'EOL (Medical Emergency)',
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  pending_hod: 'Pending HOD Approval',
  pending_principal: 'Pending Principal Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};
