export type ApprovalStatus = 'draft' | 'pending_hod' | 'pending_principal' | 'approved' | 'rejected';

export interface CPSEntry {
  id: string;
  facultyId: string;
  facultyName: string;
  department: string;
  category: CPSCategory;
  activityType: string;
  description: string;
  date: string;
  credits: number;
  status: ApprovalStatus;
  evidence?: string;
  hodRemarks?: string;
  principalRemarks?: string;
  submittedAt?: string;
  hodApprovedAt?: string;
  principalApprovedAt?: string;
  rejectedAt?: string;
  rejectedBy?: string;
}

export type CPSCategory = 'research' | 'academics' | 'industry' | 'placement';

export interface CPSActivityType {
  id: string;
  category: CPSCategory;
  name: string;
  credits: number;
  description?: string;
}

// Fixed point values for each activity type
export const CPS_ACTIVITIES: CPSActivityType[] = [
  // Research & Development
  { id: 'journal_sci', category: 'research', name: 'SCI Journal Publication', credits: 15 },
  { id: 'journal_scopus', category: 'research', name: 'Scopus Journal Publication', credits: 12 },
  { id: 'journal_ugc', category: 'research', name: 'UGC Listed Journal Publication', credits: 8 },
  { id: 'conf_international', category: 'research', name: 'International Conference Paper', credits: 10 },
  { id: 'conf_national', category: 'research', name: 'National Conference Paper', credits: 6 },
  { id: 'patent_granted', category: 'research', name: 'Patent Granted', credits: 25 },
  { id: 'patent_filed', category: 'research', name: 'Patent Filed', credits: 10 },
  { id: 'research_project', category: 'research', name: 'Research Project/Grant', credits: 20 },
  { id: 'phd_guidance_completed', category: 'research', name: 'PhD Guidance Completed', credits: 30 },
  { id: 'phd_guidance_ongoing', category: 'research', name: 'PhD Guidance Ongoing', credits: 10 },

  // Academics & Teaching
  { id: 'course_development', category: 'academics', name: 'New Course Development', credits: 15 },
  { id: 'workshop_conducted', category: 'academics', name: 'Workshop/FDP Conducted', credits: 10 },
  { id: 'workshop_attended', category: 'academics', name: 'Workshop/FDP Attended', credits: 5 },
  { id: 'guest_lecture_delivered', category: 'academics', name: 'Guest Lecture Delivered', credits: 5 },
  { id: 'mentoring', category: 'academics', name: 'Student Mentoring (per semester)', credits: 3 },
  { id: 'curriculum_revision', category: 'academics', name: 'Curriculum Revision', credits: 8 },
  { id: 'lab_development', category: 'academics', name: 'Laboratory Development', credits: 12 },
  { id: 'mooc_certification', category: 'academics', name: 'MOOC Certification', credits: 4 },

  // Industry-Institute Interaction
  { id: 'mou_signed', category: 'industry', name: 'MoU Signed with Industry', credits: 15 },
  { id: 'consultancy_project', category: 'industry', name: 'Consultancy Project', credits: 20 },
  { id: 'industry_lecture', category: 'industry', name: 'Industry Expert Lecture Organized', credits: 5 },
  { id: 'industrial_visit', category: 'industry', name: 'Industrial Visit Coordinated', credits: 4 },
  { id: 'industry_collaboration', category: 'industry', name: 'Industry Collaboration Project', credits: 18 },
  { id: 'sponsored_project', category: 'industry', name: 'Industry Sponsored Project', credits: 22 },

  // Placement Activities
  { id: 'student_placed', category: 'placement', name: 'Student Placement Facilitated', credits: 2 },
  { id: 'training_program', category: 'placement', name: 'Training Program Conducted', credits: 8 },
  { id: 'corporate_connect', category: 'placement', name: 'Corporate Relationship Established', credits: 10 },
  { id: 'internship_facilitated', category: 'placement', name: 'Internship Facilitated', credits: 3 },
  { id: 'placement_drive', category: 'placement', name: 'Placement Drive Organized', credits: 12 },
  { id: 'career_counseling', category: 'placement', name: 'Career Counseling Session', credits: 4 },
];

export const CPS_CATEGORY_LABELS: Record<CPSCategory, string> = {
  research: 'Research & Development',
  academics: 'Academics & Teaching',
  industry: 'Industry-Institute Interaction',
  placement: 'Placement Activities',
};

export const CPS_CATEGORY_COLORS: Record<CPSCategory, string> = {
  research: 'cps-research',
  academics: 'cps-academics',
  industry: 'cps-industry',
  placement: 'cps-placement',
};

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  draft: 'Draft',
  pending_hod: 'Pending HOD Approval',
  pending_principal: 'Pending Principal Approval',
  approved: 'Approved',
  rejected: 'Rejected',
};
