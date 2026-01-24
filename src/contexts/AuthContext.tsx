import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState, Department } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  register: (userData: RegisterData) => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  collegeId: string;
  department: Department;
  roles: UserRole[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: '1',
    collegeId: 'FAC001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@college.edu',
    password: 'password123',
    department: 'CSE',
    roles: ['faculty'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    collegeId: 'HOD001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@college.edu',
    password: 'password123',
    department: 'CSE',
    roles: ['faculty', 'hod'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    collegeId: 'PRIN001',
    name: 'Dr. Suresh Reddy',
    email: 'suresh.reddy@college.edu',
    password: 'password123',
    department: 'CSE',
    roles: ['principal'],
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'cps_auth';
const USERS_STORAGE_KEY = 'cps_users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    currentRole: null,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthState(parsed);
      } catch (e) {
        console.error('Failed to parse auth state:', e);
      }
    }

    // Initialize demo users if not present
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!storedUsers) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
    }
  }, []);

  // Persist auth state to localStorage
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [authState]);

  const getUsers = (): (User & { password: string })[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEMO_USERS;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        currentRole: user.roles[0],
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      currentRole: null,
    });
  };

  const switchRole = (role: UserRole) => {
    if (authState.user?.roles.includes(role)) {
      setAuthState((prev) => ({
        ...prev,
        currentRole: role,
      }));
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    const users = getUsers();
    
    // Check if email or college ID already exists
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return false;
    }
    if (users.some((u) => u.collegeId === userData.collegeId)) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      currentRole: userData.roles[0],
    });

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        switchRole,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
