import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'cps' | 'leave' | 'circular';
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'cps_notifications';

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'CPS Entry Approved',
    message: 'Your research paper entry has been approved by the HOD.',
    type: 'cps',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: '/cps/records',
  },
  {
    id: '2',
    title: 'New Circular Published',
    message: 'Principal has published a new circular regarding semester exams.',
    type: 'circular',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: '/circulars',
  },
  {
    id: '3',
    title: 'Leave Request Update',
    message: 'Your leave request for March 20-22 has been approved.',
    type: 'leave',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    link: '/leave',
  },
  {
    id: '4',
    title: 'CPS Deadline Reminder',
    message: 'CPS entries for the current semester are due in 7 days.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '5',
    title: 'Welcome to CPS',
    message: 'Start by adding your first CPS entry to track your academic contributions.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    link: '/cps/new',
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const key = `${STORAGE_KEY}_${user.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      setNotifications(SEED_NOTIFICATIONS);
      localStorage.setItem(key, JSON.stringify(SEED_NOTIFICATIONS));
    }
  }, [user]);

  const persist = (updated: Notification[]) => {
    if (user) {
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(updated));
    }
    setNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    persist(notifications.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: Notification = {
      ...data,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    persist([newNotif, ...notifications]);
  };

  const clearAll = () => persist([]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
