export type UserRole = 'faculty' | 'hod' | 'principal';

export type Department = 
  | 'AIML' 
  | 'CSE' 
  | 'AIDS' 
  | 'ECE' 
  | 'EEE' 
  | 'MECH';

export interface User {
  id: string;
  collegeId: string;
  name: string;
  email: string;
  department: Department;
  roles: UserRole[];
  createdAt: string;
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

export const ROLE_LABELS: Record<UserRole, string> = {
  faculty: 'Faculty',
  hod: 'Head of Department',
  principal: 'Principal',
};
