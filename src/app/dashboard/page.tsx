'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { useAuthStore } from '@/store/auth';
import { useNotifications } from '@/contexts/NotificationContext';
import { ROUTES, USER_ROLES } from '@/lib/constants';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case USER_ROLES.TEACHER:
        return <TeacherDashboard />;
      case USER_ROLES.ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.STUDENT:
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour, {user?.firstName} ! 👋
          </h1>
          <p className="text-gray-600">
            {user?.role === USER_ROLES.STUDENT && 'Voici un aperçu de votre activité académique'}
            {user?.role === USER_ROLES.TEACHER && 'Voici un aperçu de vos cours et étudiants'}
            {user?.role === USER_ROLES.ADMIN && 'Voici un aperçu de la plateforme et des statistiques'}
          </p>
          {unreadCount > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                🔔 Vous avez {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Role-specific Dashboard */}
        {renderDashboard()}
      </main>
    </div>
  );
}