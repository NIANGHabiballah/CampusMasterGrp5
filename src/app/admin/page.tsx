'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, FileText, MessageSquare, Settings, Shield, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const stats = [
    { title: 'Utilisateurs Total', value: '156', icon: Users, change: '+12%' },
    { title: 'Cours Actifs', value: '24', icon: BookOpen, change: '+3%' },
    { title: 'Devoirs Soumis', value: '342', icon: FileText, change: '+18%' },
    { title: 'Messages', value: '89', icon: MessageSquare, change: '+7%' }
  ];

  const quickActions = [
    { title: 'Gérer les Utilisateurs', description: 'Ajouter, modifier ou supprimer des utilisateurs', href: '/admin/users', icon: Users },
    { title: 'Gérer les Cours', description: 'Administrer les cours et programmes', href: '/admin/courses', icon: BookOpen },
    { title: 'Analytics', description: 'Voir les statistiques détaillées', href: '/admin/analytics', icon: BarChart3 },
    { title: 'Paramètres Système', description: 'Configuration de la plateforme', href: '/settings', icon: Settings }
  ];

  const recentActivity = [
    { action: 'Nouvel utilisateur inscrit', user: 'Marie Dupont', time: 'Il y a 2h', type: 'user' },
    { action: 'Cours créé', user: 'Prof. Martin', time: 'Il y a 4h', type: 'course' },
    { action: 'Devoir soumis', user: 'Pierre Durand', time: 'Il y a 6h', type: 'assignment' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-600 mt-2">Tableau de bord administrateur</p>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <Shield className="h-4 w-4 mr-1" />
            Administrateur
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Accès rapide aux fonctions d'administration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <action.icon className="h-8 w-8 text-academic-600 mr-4" />
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-500' :
                      activity.type === 'course' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}