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
  
 // Research & Development (As per SJCIT CPS)

 { id: 'rd_project_20L', category: 'research', name: 'Externally Sponsored R&D Project (≥ ₹20 Lakhs)', credits: 10 },
 { id: 'rd_project_10_20L', category: 'research', name: 'Externally Sponsored R&D Project (₹10<20 Lakhs)', credits: 8 },
 { id: 'rd_project_5_10L', category: 'research', name: 'Externally Sponsored R&D Project (₹5<10 Lakhs)', credits: 6 },
 { id: 'rd_project_2_5L', category: 'research', name: 'Externally Sponsored R&D Project (₹2<5 Lakhs)', credits: 4 },
 { id: 'rd_project_1_2L', category: 'research', name: 'Externally Sponsored R&D Project (₹1<2 Lakhs)', credits: 2 },
 { id: 'rd_project_25k_1L', category: 'research', name: 'Externally Sponsored R&D Project (₹25K<1 Lakh)', credits: 1 },

 { id: 'consultancy_project_research', category: 'research', name: 'Consultancy Project (per ₹1 Lakh)', credits: 1 }, // max 10

 { id: 'patent_granted', category: 'research', name: 'Patent Granted', credits: 10 },
 { id: 'patent_published', category: 'research', name: 'Patent Published', credits: 5 },

 { id: 'phd_awarded', category: 'research', name: 'PhD Guidance   Awarded / Thesis Submitted', credits: 10 },
 { id: 'phd_pursuing', category: 'research', name: 'PhD Guidance  Ongoing', credits: 2 }, // max 10

 { id: 'journal_scopus_sci', category: 'research', name: 'Journal / Book Chapter (SCI / Scopus)', credits: 4 }, // max 10

 { id: 'conf_indexed', category: 'research', name: 'Conference Paper (SCI / Scopus / WoS / Intl.)', credits: 1 }, // max 10


  // Academics & Teaching
  { id: 'fdp_organized', category: 'academics', name: 'Workshop / FDP / STC Organised or Resource Person (≥5 Days)', credits: 0.5 },
  { id: 'fdp_attended', category: 'academics', name: 'Workshop / FDP / STC Attended (≥5 Days, Offline)', credits: 0.5 },
  { id: 'certification_course', category: 'academics', name: 'Certification Course (NPTEL / Coursera / Microsoft / IBM / Cisco)', credits: 0.5 },
  { id: 'new_lab_established', category: 'academics', name: 'Establishment of New Laboratory', credits: 4 },
  { id: 'pg_dissertation_guided', category: 'academics', name: 'PG Dissertation Guided', credits: 0.5 },
  { id: 'ug_project_guided', category: 'academics', name: 'UG Project Guided', credits: 0.25 },
  { id: 'intl_book_published', category: 'academics', name: 'Text / Reference Book (International Publisher, ISBN)', credits: 3 },
  { id: 'national_book_published', category: 'academics', name: 'Text / Reference Book (National Publisher, ISBN)', credits: 2 },
  { id: 'student_appraisal_above_90', category: 'academics', name: 'Faculty Appraisal by Students (>90%)', credits: 0.25 },
  { id: 'student_appraisal_80_89', category: 'academics', name: 'Faculty Appraisal by Students (80–89%)', credits: 0.2 },
  { id: 'student_appraisal_65_79', category: 'academics', name: 'Faculty Appraisal by Students (65–79%)', credits: 0.15 },
  { id: 'student_appraisal_below_65', category: 'academics', name: 'Faculty Appraisal by Students (<65%)', credits: 0 },
  { id: 'pass_percentage_above_90', category: 'academics', name: 'Subject Pass Percentage (>90%)', credits: 0.25 },
  { id: 'pass_percentage_80_89', category: 'academics', name: 'Subject Pass Percentage (80–89%)', credits: 0.2 },
  { id: 'pass_percentage_65_79', category: 'academics', name: 'Subject Pass Percentage (65–79%)', credits: 0.15 },
  { id: 'pass_percentage_below_65', category: 'academics', name: 'Subject Pass Percentage (<65%)', credits: 0 },

  // Industry-Institute Interaction
  { id: 'industry_attachment_4w', category: 'industry', name: 'Industry Attachment (4 Weeks)', credits: 1 },
  { id: 'industry_attachment_8w', category: 'industry', name: 'Industry Attachment (8 Weeks)', credits: 2 },
  { id: 'industry_project_completed', category: 'industry', name: 'Successful Completion of Industry Project', credits: 1 },

  // Placement Activities
  { id: 'placement_above_85', category: 'placement', name: 'Placement Percentage Above 85%', credits: 4 },

  { id: 'placement_75_85', category: 'placement', name: 'Placement Percentage (75%–<85%)', credits: 2 },

  { id: 'placement_65_75', category: 'placement', name: 'Placement Percentage (65%–<75%)', credits: 1 },

  { id: 'placement_50_65', category: 'placement', name: 'Placement Percentage (50%–<65%)', credits: 0.5 },

  { id: 'placement_below_50', category: 'placement', name: 'Placement Percentage Below 50%', credits: 0 },

  { id: 'placement_assisting_faculty', category: 'placement', name: 'Faculty Assisting Placements (per Student)', credits: 0.25 },

  { id: 'startup_mentoring', category: 'placement', name: 'Mentoring Students for Startup Establishment', credits: 5 },
]
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
