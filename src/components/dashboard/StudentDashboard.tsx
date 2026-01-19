'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Calendar, Award } from 'lucide-react';
import { GradeEvolutionChart, ActivityChart, CourseDistributionChart, StatsCards } from '@/components/dashboard/Charts';

export function StudentDashboard() {
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

  const upcomingEvents = [
    {
      id: '1',
      title: 'Examen Architecture Distribués',
      type: 'exam',
      date: '2024-01-25T09:00:00',
      location: 'Amphi A'
    },
    {
      id: '2',
      title: 'Soutenance Projet IA',
      type: 'presentation',
      date: '2024-01-28T14:00:00',
      location: 'Salle B203'
    },
    {
      id: '3',
      title: 'Conférence Cybersécurité',
      type: 'conference',
      date: '2024-01-30T10:00:00',
      location: 'Amphi C'
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

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'presentation':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'conference':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <GradeEvolutionChart />
        <ActivityChart />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <CourseDistributionChart />
        
        {/* Upcoming Events */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-academic-600" />
              Événements à venir
            </CardTitle>
            <CardDescription>
              Examens, soutenances et conférences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type === 'exam' && 'Examen'}
                    {event.type === 'presentation' && 'Soutenance'}
                    {event.type === 'conference' && 'Conférence'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir le calendrier complet
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

      {/* Academic Performance */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-academic-600" />
            Performance académique
          </CardTitle>
          <CardDescription>
            Résumé de vos résultats ce semestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">16.2</div>
              <div className="text-sm text-green-700">Moyenne générale</div>
              <div className="text-xs text-green-600 mt-1">+0.4 ce mois</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">3ème</div>
              <div className="text-sm text-blue-700">Rang de classe</div>
              <div className="text-xs text-blue-600 mt-1">sur 45 étudiants</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">87%</div>
              <div className="text-sm text-purple-700">Assiduité</div>
              <div className="text-xs text-purple-600 mt-1">Excellent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}