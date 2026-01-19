'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, FileText, MessageSquare, Plus, Edit, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export function TeacherDashboard() {
  const teacherStats = [
    {
      title: 'Cours enseignés',
      value: '4',
      description: 'Ce semestre',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Étudiants',
      value: '156',
      description: 'Tous cours confondus',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Devoirs à corriger',
      value: '23',
      description: 'En attente',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Messages',
      value: '8',
      description: 'Non lus',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentSubmissions = [
    {
      id: '1',
      student: 'Marie Dupont',
      assignment: 'Projet Architecture',
      course: 'Systèmes Distribués',
      submittedAt: '2024-01-20T14:30:00',
      status: 'pending'
    },
    {
      id: '2',
      student: 'Jean Martin',
      assignment: 'TP Sécurité',
      course: 'Sécurité Informatique',
      submittedAt: '2024-01-20T10:15:00',
      status: 'pending'
    },
    {
      id: '3',
      student: 'Sophie Leroy',
      assignment: 'Analyse de données',
      course: 'Data Science',
      submittedAt: '2024-01-19T16:45:00',
      status: 'graded'
    }
  ];

  const myCourses = [
    {
      id: '1',
      title: 'Architecture des Systèmes Distribués',
      students: 45,
      assignments: 3,
      nextClass: '2024-01-22T14:00:00'
    },
    {
      id: '2',
      title: 'Sécurité Informatique',
      students: 38,
      assignments: 2,
      nextClass: '2024-01-23T10:00:00'
    },
    {
      id: '3',
      title: 'Gestion de Projet Agile',
      students: 42,
      assignments: 4,
      nextClass: '2024-01-24T16:00:00'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">À corriger</Badge>;
      case 'graded':
        return <Badge className="bg-green-100 text-green-800">Corrigé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat, index) => (
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
        {/* Recent Submissions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-academic-600" />
                  Devoirs récents
                </CardTitle>
                <CardDescription>
                  Dernières soumissions à corriger
                </CardDescription>
              </div>
              <Button size="sm" className="bg-academic-600 hover:bg-academic-700">
                <Plus className="h-4 w-4 mr-1" />
                Nouveau devoir
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{submission.student}</h4>
                    <p className="text-sm text-gray-600">{submission.assignment}</p>
                    <p className="text-xs text-gray-500">{submission.course}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(submission.submittedAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(submission.status)}
                    {submission.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir toutes les soumissions
            </Button>
          </CardContent>
        </Card>

        {/* My Courses */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-academic-600" />
                  Mes cours
                </CardTitle>
                <CardDescription>
                  Cours que vous enseignez
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Nouveau cours
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCourses.map((course) => (
                <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students} étudiants
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {course.assignments} devoirs
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    Prochain cours: {new Date(course.nextClass).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Gérer tous les cours
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès direct aux fonctionnalités enseignant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Créer un cours</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Nouveau devoir</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm">Corriger</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Annonces</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}