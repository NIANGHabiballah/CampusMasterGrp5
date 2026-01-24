'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, FileText, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    totalCourses: 0,
    totalAssignments: 0,
    submissionRate: 0,
    averageGrade: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with real API calls
      setStats({
        totalUsers: 156,
        activeStudents: 142,
        totalCourses: 24,
        totalAssignments: 89,
        submissionRate: 87.5,
        averageGrade: 14.8
      });

      setRecentActivity([
        { id: 1, type: 'user', action: 'Nouvel utilisateur inscrit', user: 'Marie Dupont', time: '2h', status: 'success' },
        { id: 2, type: 'course', action: 'Cours créé', user: 'Prof. Martin', time: '4h', status: 'info' },
        { id: 3, type: 'assignment', action: 'Devoir soumis en retard', user: 'Pierre Durand', time: '6h', status: 'warning' },
        { id: 4, type: 'system', action: 'Maintenance programmée', user: 'Système', time: '1j', status: 'info' }
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'assignment': return <FileText className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% ce mois
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants Actifs</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeStudents}</div>
            <div className="text-xs text-gray-600">
              {Math.round((stats.activeStudents / stats.totalUsers) * 100)}% du total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Soumission</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.submissionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3% cette semaine
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageGrade}/20</div>
            <div className="text-xs text-gray-600">Toutes matières</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>État du Système</CardTitle>
                <CardDescription>Surveillance en temps réel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Serveur API</span>
                    <Badge variant="default" className="bg-green-500">En ligne</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Base de données</span>
                    <Badge variant="default" className="bg-green-500">Opérationnelle</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Stockage fichiers</span>
                    <Badge variant="default" className="bg-green-500">Disponible</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">Maintenance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Rapides</CardTitle>
                <CardDescription>Aperçu des métriques clés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connexions aujourd'hui</span>
                    <span className="font-bold">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fichiers téléchargés</span>
                    <span className="font-bold">234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Messages envoyés</span>
                    <span className="font-bold">67</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Devoirs soumis</span>
                    <span className="font-bold">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Matière</CardTitle>
                <CardDescription>Moyennes et taux de réussite</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: 'React Avancé', average: 16.2, success: 92 },
                    { subject: 'Node.js Backend', average: 14.8, success: 87 },
                    { subject: 'Base de Données', average: 13.5, success: 78 },
                    { subject: 'DevOps', average: 15.1, success: 89 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{item.subject}</h4>
                        <p className="text-sm text-gray-600">Moyenne: {item.average}/20</p>
                      </div>
                      <Badge variant={item.success > 85 ? 'default' : 'secondary'}>
                        {item.success}% réussite
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes et Notifications</CardTitle>
                <CardDescription>Points d'attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Retards fréquents</h4>
                      <p className="text-sm text-orange-700">15 étudiants ont des retards répétés</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Pic d'activité</h4>
                      <p className="text-sm text-blue-700">Trafic élevé détecté entre 14h-16h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getActivityIcon(activity.type)}
                        <span className="font-medium">{activity.action}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.user} • Il y a {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}