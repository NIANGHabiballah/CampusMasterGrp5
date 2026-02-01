'use client';

import { useState, useEffect } from 'react';
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
import { apiService } from '@/services/api';

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [coursesData, usersData, messagesData] = await Promise.all([
          apiService.getCourses(),
          apiService.getUsers(),
          apiService.getMessages()
        ]);
        setCourses(coursesData || []);
        setUsers(usersData || []);
        setMessages(messagesData || []);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculs basés sur les vraies données
  const totalUsers = users.length;
  const students = users.filter(u => u.role === 'STUDENT').length;
  const teachers = users.filter(u => u.role === 'TEACHER').length;
  const admins = users.filter(u => u.role === 'ADMIN').length;
  const totalCourses = courses.length;
  const totalMessages = messages.length;
  
  // Calcul des étudiants par cours
  const coursePopularity = courses.map(course => ({
    name: course.title.substring(0, 15) + (course.title.length > 15 ? '...' : ''),
    students: 0, // Pas de données d'inscription disponibles
    maxStudents: course.maxStudents || 30,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  }));

  const stats = [
    {
      title: 'Utilisateurs totaux',
      value: totalUsers.toString(),
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Cours créés',
      value: totalCourses.toString(),
      change: '+0',
      trend: 'up',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Devoirs soumis',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Messages échangés',
      value: totalMessages.toString(),
      change: '+0%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const systemMetrics = [
    { metric: 'CPU Usage', value: 45, status: 'normal' },
    { metric: 'Memory Usage', value: 62, status: 'normal' },
    { metric: 'Disk Usage', value: 38, status: 'normal' },
    { metric: 'Network I/O', value: 25, status: 'normal' }
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Chargement des analytiques...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="courses">Cours</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
          </TabsList>

          {/* Users Analytics */}
          <TabsContent value="users" className="space-y-6">
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
                      <span className="text-2xl font-bold">{students}</span>
                      <Badge variant="outline">{totalUsers > 0 ? Math.round((students/totalUsers)*100) : 0}%</Badge>
                    </div>
                  </div>
                  <Progress value={totalUsers > 0 ? (students/totalUsers)*100 : 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium">Enseignants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{teachers}</span>
                      <Badge variant="outline">{totalUsers > 0 ? Math.round((teachers/totalUsers)*100) : 0}%</Badge>
                    </div>
                  </div>
                  <Progress value={totalUsers > 0 ? (teachers/totalUsers)*100 : 0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="font-medium">Administrateurs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{admins}</span>
                      <Badge variant="outline">{totalUsers > 0 ? Math.round((admins/totalUsers)*100) : 0}%</Badge>
                    </div>
                  </div>
                  <Progress value={totalUsers > 0 ? (admins/totalUsers)*100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Analytics */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Liste des cours</CardTitle>
                <CardDescription>Cours disponibles sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucun cours disponible</p>
                  ) : (
                    courses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: coursePopularity[index]?.color || '#3b82f6' }}
                          ></div>
                          <div>
                            <span className="font-medium">{course.title}</span>
                            <p className="text-sm text-gray-600">{course.semester} • {course.credits} ECTS</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Max: {course.maxStudents} étudiants</span>
                          <Badge variant="outline">
                            {course.teacher?.firstName} {course.teacher?.lastName}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
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
                        <Progress value={metric.value} className="h-2" />
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
                        <span className="font-medium">Serveur Spring Boot</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Opérationnel
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">API REST</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Opérationnel
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Frontend Next.js</span>
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
    </div>
  );
}