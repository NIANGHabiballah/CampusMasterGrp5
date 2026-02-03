import { create } from 'zustand';
import { Notification } from '@/types';
import { apiService } from '@/services/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  fetchNotifications: (userId?: number) => Promise<void>;
  fetchUnreadCount: (userId: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId?: number) => {
    if (!userId) return; // Ne rien faire si pas d'userId
    
    set({ isLoading: true });
    try {
      const data = await apiService.getNotifications(userId);
      const unreadCount = data.filter(n => !n.isRead).length;
      set({ 
        notifications: data,
        unreadCount: unreadCount,
        isLoading: false 
      });
    } catch (error) {
      // Ignorer silencieusement les erreurs de chargement
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async (userId: number) => {
    try {
      const data = await apiService.getUnreadCount(userId);
      set({ unreadCount: data.count });
    } catch (error: any) {
      // Si l'API n'existe pas encore (404), utiliser 0
      if (error.message?.includes('404')) {
        set({ unreadCount: 0 });
      } else {
        console.error('Erreur lors du chargement du compteur:', error);
      }
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiService.markNotificationAsRead(parseInt(id));
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error: any) {
      console.error('Erreur lors du marquage comme lu:', error);
      // Mettre à jour localement même en cas d'erreur
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    }
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0
    }));
  },

  deleteNotification: (id: string) => {
    set(state => {
      const updatedNotifications = state.notifications.filter(n => n.id !== id);
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.isRead).length
      };
    });
  },

  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  }
}));