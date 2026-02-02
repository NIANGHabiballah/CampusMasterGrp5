import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notifications';
import { useAuthStore } from '@/store/auth';

export function useNotifications() {
  const { user } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (user?.id) {
      // Charger les notifications au démarrage
      fetchNotifications(user.id);
      
      // Rafraîchir toutes les 30 secondes
      const interval = setInterval(() => {
        fetchNotifications(user.id);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user?.id, fetchNotifications]);
}