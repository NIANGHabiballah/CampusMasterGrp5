'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { GradeEvolutionChart, ActivityChart, CourseDistributionChart, StatsCards } from '@/components/dashboard/Charts';
import { BookOpen, FileText, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useNotifications } from '@/contexts/NotificationContext';
import { ROUTES } from '@/lib/constants';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { notifications, unreadCount } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const recentAssignments = [
    {
      id: '1',
      title: 'Projet Architecture Logicielle',
      course: 'Génie Logiciel',
      dueDate: '2024-01-15',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Analyse de données',
      course: 'Data Science',
      dueDate: '2024-01-18',
      status: 'submitted',
      priority: 'medium'
    }
  ];

  const recentCourses = [
    {
      id: '1',
      title: 'Architecture des Systèmes Distribués',
      teacher: 'Prof. Martin',
      nextClass: '2024-01-12 14:00',
      progress: 75
    },
    {
      id: '2',
      title: 'Intelligence Artificielle',
      teacher: 'Dr. Dubois',
      nextClass: '2024-01-13 10:00',
      progress: 60
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800">Rendu</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">En cours</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
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
            Voici un aperçu de votre activité académique
          </p>
          {unreadCount > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                🔔 Vous avez {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 my-8">
          <GradeEvolutionChart />
          <ActivityChart />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <CourseDistributionChart />
          
          {/* Recent Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-academic-600" />
                Notifications récentes
              </CardTitle>
              <CardDescription>
                Vos dernières alertes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className={`p-4 rounded-lg ${
                    !notification.isRead ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Assignments */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-academic-600" />
                Devoirs récents
              </CardTitle>
              <CardDescription>
                Vos prochaines échéances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getPriorityIcon(assignment.priority)}
                      <div>
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-600">{assignment.course}</p>
                        <p className="text-xs text-gray-500">
                          Échéance: {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(assignment.status)}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir tous les devoirs
              </Button>
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-academic-600" />
                Cours en cours
              </CardTitle>
              <CardDescription>
                Vos prochains cours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <Badge variant="outline">{course.progress}%</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.teacher}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      Prochain cours: {new Date(course.nextClass).toLocaleString('fr-FR')}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-academic-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir tous les cours
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm mt-8">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push(ROUTES.COURSES)}>
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Mes cours</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push(ROUTES.ASSIGNMENTS)}>
                <FileText className="h-6 w-6" />
                <span className="text-sm">Devoirs</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push(ROUTES.MESSAGES)}>
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Messages</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push(ROUTES.PROFILE)}>
                <Users className="h-6 w-6" />
                <span className="text-sm">Profil</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}