'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, BookOpen, FileText, MessageSquare, TrendingUp, TrendingDown, 
  Activity, Server, Database, Clock, AlertTriangle, CheckCircle 
} from 'lucide-react';

// Mock data for analytics
const userGrowthData = [
  { month: 'Jan', students: 120, teachers: 15, total: 135 },
  { month: 'Fév', students: 145, teachers: 18, total: 163 },
  { month: 'Mar', students: 168, teachers: 22, total: 190 },
  { month: 'Avr', students: 192, teachers: 25, total: 217 },
  { month: 'Mai', students: 215, teachers: 28, total: 243 },
  { month: 'Jun', students: 238, teachers: 30, total: 268 }
];

const activityData = [
  { day: 'Lun', logins: 180, submissions: 45, messages: 120 },
  { day: 'Mar', logins: 220, submissions: 62, messages: 145 },
  { day: 'Mer', logins: 195, submissions: 38, messages: 98 },
  { day: 'Jeu', logins: 240, submissions: 71, messages: 167 },
  { day: 'Ven', logins: 210, submissions: 55, messages: 134 },
  { day: 'Sam', logins: 85, submissions: 12, messages: 45 },
  { day: 'Dim', logins: 65, submissions: 8, messages: 32 }
];

const coursePopularity = [
  { name: 'Architecture', students: 45, color: '#3b82f6' },
  { name: 'IA', students: 38, color: '#10b981' },
  { name: 'Sécurité', students: 42, color: '#f59e0b' },
  { name: 'Data Science', students: 35, color: '#ef4444' },
  { name: 'Projet', students: 40, color: '#8b5cf6' }
];

const systemMetrics = [
  { metric: 'CPU Usage', value: 65, status: 'normal' },
  { metric: 'Memory Usage', value: 78, status: 'warning' },
  { metric: 'Disk Usage', value: 45, status: 'normal' },
  { metric: 'Network I/O', value: 32, status: 'normal' }
];

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  const stats = [
    {
      title: 'Utilisateurs actifs',
      value: '268',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Cours créés',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Devoirs soumis',
      value: '1,247',
      change: '+8%',
      trend: 'up',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Messages échangés',
      value: '3,892',
      change: '+15%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal': return <Badge variant="outline" className="text-green-600 border-green-600">Normal</Badge>;
      case 'warning': return <Badge variant="outline" className="text-orange-600 border-orange-600">Attention</Badge>;
      case 'critical': return <Badge variant="destructive">Critique</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytiques</h1>
            <p className="text-gray-600">Statistiques et métriques de la plateforme</p>
          </div>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <div className="flex items-center">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="courses">Cours</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
          </TabsList>

          {/* Users Analytics */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Croissance des utilisateurs</CardTitle>
                  <CardDescription>Évolution du nombre d'utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="students" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        name="Étudiants"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="teachers" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Enseignants"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Répartition des utilisateurs</CardTitle>
                  <CardDescription>Distribution par rôle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="font-medium">Étudiants</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">238</span>
                        <Badge variant="outline">89%</Badge>
                      </div>
                    </div>
                    <Progress value={89} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="font-medium">Enseignants</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">30</span>
                        <Badge variant="outline">11%</Badge>
                      </div>
                    </div>
                    <Progress value={11} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="font-medium">Administrateurs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">3</span>
                        <Badge variant="outline">1%</Badge>
                      </div>
                    </div>
                    <Progress value={1} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Analytics */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Activité hebdomadaire</CardTitle>
                <CardDescription>Connexions, soumissions et messages par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="logins" fill="#3b82f6" name="Connexions" />
                    <Bar dataKey="submissions" fill="#10b981" name="Soumissions" />
                    <Bar dataKey="messages" fill="#f59e0b" name="Messages" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Analytics */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Popularité des cours</CardTitle>
                  <CardDescription>Nombre d'étudiants par cours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={coursePopularity}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="students"
                      >
                        {coursePopularity.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Statistiques des cours</CardTitle>
                  <CardDescription>Métriques détaillées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {coursePopularity.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: course.color }}
                          ></div>
                          <span className="font-medium">{course.name}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>{course.students} étudiants</span>
                          <Badge variant="outline">
                            {Math.round((course.students / 200) * 100)}% capacité
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Analytics */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Métriques système</CardTitle>
                  <CardDescription>Performance en temps réel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{metric.metric}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${getStatusColor(metric.status)}`}>
                              {metric.value}%
                            </span>
                            {getStatusBadge(metric.status)}
                          </div>
                        </div>
                        <Progress 
                          value={metric.value} 
                          className={`h-2 ${
                            metric.status === 'warning' ? '[&>div]:bg-orange-500' :
                            metric.status === 'critical' ? '[&>div]:bg-red-500' : ''
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>État des services</CardTitle>
                  <CardDescription>Statut des composants système</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Base de données</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Opérationnel
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Serveur web</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Opérationnel
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Service de fichiers</span>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Dégradé
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Notifications</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Opérationnel
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}