'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, FileText, Clock, CheckCircle, AlertCircle, Download, Upload, Megaphone, Calendar } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
    averageGrade: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [coursesData, assignmentsData, announcementsData] = await Promise.all([
        apiService.getCourses(),
        apiService.getAssignments(),
        apiService.getAnnouncements()
      ]);
      
      setCourses(coursesData || []);
      setAssignments(assignmentsData || []);
      setAnnouncements(announcementsData || []);
      
      // Calculate stats
      const pending = assignmentsData?.filter(a => !a.submitted)?.length || 0;
      const completed = assignmentsData?.filter(a => a.submitted)?.length || 0;
      
      setStats({
        totalCourses: coursesData?.length || 0,
        pendingAssignments: pending,
        completedAssignments: completed,
        averageGrade: 15.2 // Mock data
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (assignmentId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await apiService.submitAssignment(assignmentId, formData);
      toast.success('Devoir soumis avec succès');
      loadDashboardData();
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Urgent';
      case 'MEDIUM': return 'Normal';
      case 'LOW': return 'Info';
      default: return priority;
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Announcements Section */}
      {announcements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-orange-500" />
              Annonces Récentes
            </CardTitle>
            <CardDescription>Dernières informations importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {getPriorityLabel(announcement.priority)}
                        </Badge>
                        {announcement.course && (
                          <Badge variant="outline">
                            {announcement.course.title}
                          </Badge>
                        )}
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{announcement.title}</h3>
                      <p className="text-sm text-gray-700 line-clamp-2">{announcement.content}</p>
                      {announcement.expiresAt && (
                        <div className="text-sm text-orange-600 mt-2">
                          Expire le {new Date(announcement.expiresAt).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs en Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingAssignments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs Rendus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedAssignments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Générale</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageGrade}/20</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Mes Cours Récents</CardTitle>
            <CardDescription>Accédez rapidement à vos cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.teacher}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Accéder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Devoirs à Rendre</CardTitle>
            <CardDescription>Prochaines échéances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.filter(a => !a.submitted).slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.course}</p>
                    </div>
                    <Badge variant={new Date(assignment.dueDate) < new Date() ? 'destructive' : 'secondary'}>
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      id={`file-${assignment.id}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(assignment.id, file);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-${assignment.id}`)?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Soumettre
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Progression Académique</CardTitle>
          <CardDescription>Votre évolution ce semestre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Devoirs Rendus</span>
                <span>{Math.round((stats.completedAssignments / (stats.completedAssignments + stats.pendingAssignments)) * 100)}%</span>
              </div>
              <Progress value={(stats.completedAssignments / (stats.completedAssignments + stats.pendingAssignments)) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Participation aux Cours</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}