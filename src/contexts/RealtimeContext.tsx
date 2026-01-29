'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RealtimeNotification {
  id: string;
  type: 'assignment' | 'grade' | 'message' | 'announcement';
  title: string;
  message: string;
  userId: string;
  actionUrl?: string;
  createdAt: string;
}

interface RealtimeContextType {
  isConnected: boolean;
  notifications: RealtimeNotification[];
  sendNotification: (notification: Omit<RealtimeNotification, 'id' | 'createdAt'>) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  // Simuler une connexion WebSocket
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      toast.success('Connexion temps réel établie');
    }, 2000);

    // Simuler des notifications périodiques
    const notificationInterval = setInterval(() => {
      const mockNotifications = [
        {
          type: 'assignment' as const,
          title: 'Nouveau devoir disponible',
          message: 'Un nouveau devoir a été publié en Architecture Logicielle',
          userId: 'all',
          actionUrl: '/assignments'
        },
        {
          type: 'grade' as const,
          title: 'Note publiée',
          message: 'Votre note pour le projet React est disponible',
          userId: 'student',
          actionUrl: '/grades'
        },
        {
          type: 'message' as const,
          title: 'Nouveau message',
          message: 'Vous avez reçu un message de Prof. Martin',
          userId: 'student',
          actionUrl: '/messages'
        },
        {
          type: 'announcement' as const,
          title: 'Annonce importante',
          message: 'Changement de salle pour le cours de demain',
          userId: 'all',
          actionUrl: '/announcements'
        }
      ];

      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      
      if (Math.random() > 0.7) { // 30% de chance
        sendNotification(randomNotification);
      }
    }, 30000); // Toutes les 30 secondes

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(notificationInterval);
    };
  }, []);

  const sendNotification = (notification: Omit<RealtimeNotification, 'id' | 'createdAt'>) => {
    const newNotification: RealtimeNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Garder seulement 50 notifications

    // Afficher une toast notification
    toast.info(notification.title, {
      description: notification.message,
      action: notification.actionUrl ? {
        label: 'Voir',
        onClick: () => window.location.href = notification.actionUrl!
      } : undefined
    });
  };

  return (
    <RealtimeContext.Provider value={{ isConnected, notifications, sendNotification }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}