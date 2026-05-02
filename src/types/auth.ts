export type UserRole = 'faculty' | 'hod' | 'principal' | 'admin' | 'non_teaching';

export type Department =
  | 'AIML'
  | 'CSE'
  | 'AIDS'
  | 'ECE'
  | 'EEE'
  | 'MECH';

export type Designation =
  | 'Assistant Professor'
  | 'Associate Professor'
  | 'Professor'
  | 'Head of Department'
  | 'Principal'
  | 'None';

export type Post = 'Faculty' | 'Head of Department' | 'Principal' | 'Non-Teaching Staff';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface User {
  id: string;
  collegeId: string;
  name: string;
  email: string;
  department: Department;
  roles: UserRole[];
  designation: Designation;
  usn: string;
  createdAt: string;
  avatarUrl?: string;
  achievements?: Achievement[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  currentRole: UserRole | null;
}

export const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: 'AIML', label: 'Artificial Intelligence & Machine Learning' },
  { value: 'CSE', label: 'Computer Science & Engineering' },
  { value: 'AIDS', label: 'AI & Data Science' },
  { value: 'ECE', label: 'Electronics & Communication Engineering' },
  { value: 'EEE', label: 'Electrical & Electronics Engineering' },
  { value: 'MECH', label: 'Mechanical Engineering' },
];

export const DESIGNATIONS: { value: Designation; label: string }[] = [
  { value: 'Assistant Professor', label: 'Assistant Professor' },
  { value: 'Associate Professor', label: 'Associate Professor' },
  { value: 'Professor', label: 'Professor' },
  { value: 'Head of Department', label: 'Head of Department' },
  { value: 'Principal', label: 'Principal' },
  { value: 'None', label: 'None' },
];

export const POSTS: { value: Post; label: string }[] = [
  { value: 'Faculty', label: 'Faculty' },
  { value: 'Head of Department', label: 'Head of Department' },
  { value: 'Principal', label: 'Principal' },
  { value: 'Non-Teaching Staff', label: 'Non-Teaching Staff' },
];

/** Academic designations only – used with Post in signup (1 post + 1 designation). */
export const DESIGNATIONS_ACADEMIC: { value: Designation; label: string }[] = [
  { value: 'Assistant Professor', label: 'Assistant Professor' },
  { value: 'Associate Professor', label: 'Associate Professor' },
  { value: 'Professor', label: 'Professor' },
  { value: 'None', label: 'None' },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  faculty: 'Faculty',
  hod: 'Head of Department',
  principal: 'Principal',
  admin: 'Administrator',
  non_teaching: 'Non-Teaching Staff',
};
