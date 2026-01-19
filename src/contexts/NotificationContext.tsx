'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { Bell, CheckCircle, AlertCircle, MessageSquare, BookOpen, FileText } from 'lucide-react';
import { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock initial notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: '1',
        type: 'grade',
        title: 'Nouvelle note disponible',
        message: 'Votre projet Architecture a été noté : 16/20',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        actionUrl: '/assignments/1'
      },
      {
        id: '2',
        userId: '1',
        type: 'assignment',
        title: 'Nouveau devoir publié',
        message: 'Analyse de données - Machine Learning est maintenant disponible',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        actionUrl: '/assignments/2'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    const icon = getNotificationIcon(notification.type);
    toast(notification.title, {
      description: notification.message,
      icon
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'grade':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'assignment':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'message':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'announcement':
      return <Bell className="h-4 w-4 text-orange-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
}