import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  
  // Real-time simulation
  simulateRealTimeNotifications: () => void;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '3',
    type: 'grade',
    title: 'Nouvelle note disponible',
    message: 'Votre devoir "Projet React" a été noté : 18/20',
    isRead: false,
    createdAt: '2024-01-24T10:30:00Z',
    actionUrl: '/grades'
  },
  {
    id: '2',
    userId: '3',
    type: 'assignment',
    title: 'Nouveau devoir à rendre',
    message: 'Un nouveau devoir "API REST avec Express" a été publié. Date limite : 28 février 2024',
    isRead: false,
    createdAt: '2024-01-24T09:15:00Z',
    actionUrl: '/assignments'
  },
  {
    id: '3',
    userId: '3',
    type: 'message',
    title: 'Nouveau message',
    message: 'Prof. Jean Martin vous a envoyé un message concernant votre projet',
    isRead: true,
    createdAt: '2024-01-23T16:45:00Z',
    actionUrl: '/messages'
  },
  {
    id: '4',
    userId: '3',
    type: 'announcement',
    title: 'Annonce importante',
    message: 'Nouvelle fonctionnalité de collaboration en temps réel disponible sur la plateforme',
    isRead: true,
    createdAt: '2024-01-23T14:20:00Z'
  }
];

// Notification templates for simulation
const notificationTemplates = [
  {
    type: 'assignment' as const,
    title: 'Rappel : Devoir à rendre bientôt',
    message: 'N\'oubliez pas de rendre votre devoir "Base de données" avant demain 23h59'
  },
  {
    type: 'grade' as const,
    title: 'Note mise à jour',
    message: 'Votre note pour le devoir "Node.js Backend" a été mise à jour'
  },
  {
    type: 'message' as const,
    title: 'Nouveau message de groupe',
    message: 'Un nouveau message a été posté dans le groupe "React Avancé"'
  },
  {
    type: 'announcement' as const,
    title: 'Maintenance programmée',
    message: 'La plateforme sera en maintenance dimanche de 2h à 4h du matin'
  }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.isRead).length,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ 
        notifications: mockNotifications,
        unreadCount: mockNotifications.filter(n => !n.isRead).length,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  markAsRead: (id: string) => {
    set(state => {
      const updatedNotifications = state.notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.isRead).length
      };
    });
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
  },

  simulateRealTimeNotifications: () => {
    // Simulate receiving notifications every 30 seconds
    setInterval(() => {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      
      get().addNotification({
        userId: '3', // Current user
        type: template.type,
        title: template.title,
        message: template.message,
        isRead: false
      });
    }, 30000); // 30 seconds
  }
}));

// Auto-start real-time simulation
if (typeof window !== 'undefined') {
  // Only run in browser
  setTimeout(() => {
    useNotificationStore.getState().simulateRealTimeNotifications();
  }, 5000); // Start after 5 seconds
}