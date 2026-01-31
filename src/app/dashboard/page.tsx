'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award, 
  Activity,
  Download,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useDashboardStore } from '@/store/dashboard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

import { apiService } from '@/services/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, totalAssignments: 0, submissionRate: 0 });
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [coursePerformance, setCoursePerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Charger les données selon le rôle
        if (user?.role === 'ADMIN') {
          const [users, courses, assignments] = await Promise.all([
            apiService.getUsers(),
            apiService.getCourses(),
            apiService.getAssignments()
          ]);
          
          setStats({
            totalStudents: users.filter(u => u.role === 'STUDENT').length,
            totalCourses: courses.length,
            totalAssignments: assignments.length,
            submissionRate: 85 // Mock pour l'instant
          });
          
          // Mock data pour les graphiques
          setGradeDistribution([
            { range: '0-5', count: 5, percentage: 8 },
            { range: '6-10', count: 15, percentage: 25 },
            { range: '11-15', count: 25, percentage: 42 },
            { range: '16-20', count: 15, percentage: 25 }
          ]);
          
          setCoursePerformance(courses.map(course => ({
            courseId: course.id,
            courseName: course.title,
            studentCount: Math.floor(Math.random() * 50) + 10,
            averageGrade: (Math.random() * 5 + 12).toFixed(1),
            submissionRate: Math.floor(Math.random() * 30) + 70
          })));
        }
        
        setActivityData([
          { date: '2024-01-20', logins: 45, submissions: 12, downloads: 23 },
          { date: '2024-01-21', logins: 52, submissions: 18, downloads: 31 },
          { date: '2024-01-22', logins: 38, submissions: 8, downloads: 19 },
          { date: '2024-01-23', logins: 61, submissions: 22, downloads: 28 },
          { date: '2024-01-24', logins: 49, submissions: 15, downloads: 25 }
        ]);
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadDashboardData();
    }
  }, [user, selectedPeriod]);

  const handlePeriodChange = (period: '7d' | '30d' | '90d') => {
    setSelectedPeriod(period);
    // Recharger les données d'activité pour la nouvelle période
  };

  // Student Dashboard
  const renderStudentDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours suivis</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Ce semestre</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs à rendre</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne générale</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2/20</div>
            <p className="text-xs text-muted-foreground">+0.5 ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Devoirs rendus</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des notes</CardTitle>
            <CardDescription>Vos performances au fil du temps</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { name: 'Jan', note: 14.5 },
                { name: 'Fév', note: 15.2 },
                { name: 'Mar', note: 14.8 },
                { name: 'Avr', note: 16.1 },
                { name: 'Mai', note: 15.7 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 20]} />
                <Tooltip />
                <Line type="monotone" dataKey="note" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Répartition par matière</CardTitle>
            <CardDescription>Vos notes par cours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'React', note: 16.5 },
                { name: 'Node.js', note: 14.2 },
                { name: 'BDD', note: 15.8 },
                { name: 'Architecture', note: 13.9 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 20]} />
                <Tooltip />
                <Bar dataKey="note" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Devoir "API REST" noté</p>
                <p className="text-xs text-gray-500">Il y a 2 heures • Note: 18/20</p>
              </div>
              <Badge variant="secondary">Nouveau</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau cours "Architecture Microservices"</p>
                <p className="text-xs text-gray-500">Hier • Prof. Martin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Rappel: Devoir "Base de données" à rendre</p>
                <p className="text-xs text-gray-500">Dans 2 jours</p>
              </div>
              <Badge variant="outline">Urgent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Teacher Dashboard
  const renderTeacherDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Ce semestre</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">Total inscrit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À corriger</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Devoirs en attente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne classe</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2/20</div>
            <p className="text-xs text-muted-foreground">Tous cours</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance par cours</CardTitle>
            <CardDescription>Moyenne des étudiants</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="courseName" />
                <YAxis domain={[0, 20]} />
                <Tooltip />
                <Bar dataKey="averageGrade" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Taux de soumission</CardTitle>
            <CardDescription>Pourcentage de devoirs rendus</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coursePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="courseName" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="submissionRate" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Admin Dashboard
  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">+12 ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours total</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Ce semestre</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs créés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">Total plateforme</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissionRate}%</div>
            <p className="text-xs text-muted-foreground">Soumissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <Tabs defaultValue="activity" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="grades">Notes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant={selectedPeriod === '7d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handlePeriodChange('7d')}
            >
              7j
            </Button>
            <Button 
              variant={selectedPeriod === '30d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handlePeriodChange('30d')}
            >
              30j
            </Button>
            <Button 
              variant={selectedPeriod === '90d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handlePeriodChange('90d')}
            >
              90j
            </Button>
          </div>
        </div>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité de la plateforme</CardTitle>
              <CardDescription>Connexions, soumissions et téléchargements</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="logins" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="submissions" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="downloads" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grades" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des notes</CardTitle>
                <CardDescription>Répartition des notes sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition en pourcentage</CardTitle>
                <CardDescription>Pourcentage par tranche de notes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance par cours</CardTitle>
              <CardDescription>Analyse détaillée des cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursePerformance.map((course, index) => (
                  <div key={course.courseId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{course.courseName}</h4>
                      <p className="text-sm text-gray-500">{course.studentCount} étudiants</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Moyenne:</span>
                        <Badge variant="secondary">{course.averageGrade}/20</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Soumissions:</span>
                        <Badge variant="outline">{course.submissionRate}%</Badge>
                      </div>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {user?.firstName} {user?.lastName} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'STUDENT' && 'Voici un aperçu de votre progression académique'}
          {user?.role === 'TEACHER' && 'Gérez vos cours et suivez vos étudiants'}
          {user?.role === 'ADMIN' && 'Tableau de bord administrateur de la plateforme'}
        </p>
      </div>

      {/* Role-based Dashboard */}
      {user?.role === 'STUDENT' && renderStudentDashboard()}
      {user?.role === 'TEACHER' && renderTeacherDashboard()}
      {user?.role === 'ADMIN' && renderAdminDashboard()}
    </div>
  );
}