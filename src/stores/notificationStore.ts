import { create } from 'zustand';

export interface AppNotification {
  id: string;
  type: 'xp' | 'mission' | 'streak' | 'level' | 'system' | 'challenge' | 'ranking' | 'social';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;

  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notif) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      read: false,
    };
    set((s) => {
      const updated = [newNotif, ...s.notifications].slice(0, 50);
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    });
    get().saveToStorage();
  },

  markRead: (id) => {
    set((s) => {
      const updated = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    });
    get().saveToStorage();
  },

  markAllRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    get().saveToStorage();
  },

  remove: (id) => {
    set((s) => {
      const updated = s.notifications.filter((n) => n.id !== id);
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
    });
    get().saveToStorage();
  },

  clear: () => {
    set({ notifications: [], unreadCount: 0 });
    get().saveToStorage();
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('gtmed_notifications_v2');
      if (raw) {
        const notifications = JSON.parse(raw) as AppNotification[];
        set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
      }
    } catch {}
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('gtmed_notifications_v2', JSON.stringify(get().notifications));
    } catch {}
  },
}));
