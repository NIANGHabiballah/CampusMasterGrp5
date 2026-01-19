'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Shield, BarChart3, Settings, UserCheck, AlertTriangle, TrendingUp, Database, Activity } from 'lucide-react';

export function AdminDashboard() {
  const adminStats = [
    {
      title: 'Utilisateurs totaux',
      value: '1,247',
      description: '+12% ce mois',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Cours actifs',
      value: '89',
      description: 'Tous semestres',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Taux de réussite',
      value: '87%',
      description: '+3% vs dernier semestre',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Alertes système',
      value: '3',
      description: 'Nécessitent attention',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const recentUsers = [
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'marie.dubois@campus.fr',
      role: 'STUDENT',
      status: 'pending',
      registeredAt: '2024-01-20T09:30:00'
    },
    {
      id: '2',
      name: 'Prof. Jean Martin',
      email: 'jean.martin@campus.fr',
      role: 'TEACHER',
      status: 'active',
      registeredAt: '2024-01-19T14:15:00'
    },
    {
      id: '3',
      name: 'Sophie Leroy',
      email: 'sophie.leroy@campus.fr',
      role: 'STUDENT',
      status: 'active',
      registeredAt: '2024-01-18T11:20:00'
    }
  ];

  const systemAlerts = [
    {
      id: '1',
      type: 'security',
      title: 'Tentatives de connexion suspectes',
      description: '5 tentatives échouées depuis l\'IP 192.168.1.100',
      severity: 'high',
      timestamp: '2024-01-20T15:30:00'
    },
    {
      id: '2',
      type: 'performance',
      title: 'Utilisation élevée du serveur',
      description: 'CPU à 85% pendant les 2 dernières heures',
      severity: 'medium',
      timestamp: '2024-01-20T13:45:00'
    },
    {
      id: '3',
      type: 'storage',
      title: 'Espace de stockage faible',
      description: 'Seulement 15% d\'espace libre restant',
      severity: 'low',
      timestamp: '2024-01-20T10:20:00'
    }
  ];

  const departmentStats = [
    { name: 'Informatique', students: 456, courses: 34, completion: 89 },
    { name: 'Mathématiques', students: 234, courses: 28, completion: 92 },
    { name: 'Physique', students: 189, courses: 22, completion: 85 },
    { name: 'Chimie', students: 167, courses: 19, completion: 88 }
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'Étudiant';
      case 'TEACHER': return 'Enseignant';
      case 'ADMIN': return 'Administrateur';
      default: return role;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Moyen</Badge>;
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Faible</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-academic-600" />
              Utilisateurs récents
            </CardTitle>
            <CardDescription>
              Dernières inscriptions à valider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getRoleLabel(user.role)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(user.registeredAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(user.status)}
                    {user.status === 'pending' && (
                      <Button size="sm" className="bg-academic-600 hover:bg-academic-700">
                        Valider
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Gérer tous les utilisateurs
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-academic-600" />
              Alertes système
            </CardTitle>
            <CardDescription>
              Surveillance et sécurité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir toutes les alertes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Department Statistics */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-academic-600" />
            Statistiques par département
          </CardTitle>
          <CardDescription>
            Performance et indicateurs clés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">{dept.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Étudiants:</span>
                    <span className="font-medium">{dept.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cours:</span>
                    <span className="font-medium">{dept.courses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Réussite:</span>
                    <span className="font-medium text-green-600">{dept.completion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Administration</CardTitle>
          <CardDescription>
            Outils de gestion et configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Utilisateurs</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Cours</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span className="text-sm">Configuration</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">Base de données</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}