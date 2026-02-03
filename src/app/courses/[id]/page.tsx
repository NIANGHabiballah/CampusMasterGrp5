'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, Download, FileText, Video, Users, Calendar, 
  Clock, ArrowLeft, Play, MessageSquare, Star, Upload 
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { ROUTES } from '@/lib/constants';

export default function CourseDetailPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleDownload = async (material: any) => {
    try {
      // Simuler le téléchargement
      const response = await fetch(`/api/materials/${material.id}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.title + (material.type === 'pdf' ? '.pdf' : material.type === 'zip' ? '.zip' : '');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      // Fallback: ouvrir dans un nouvel onglet
      window.open(`/materials/${material.id}`, '_blank');
    }
  };

  const handleRead = (material: any) => {
    if (material.type === 'video') {
      // Ouvrir la vidéo dans un nouvel onglet ou modal
      window.open(`/video-player/${material.id}`, '_blank');
    } else {
      // Ouvrir le document dans un nouvel onglet
      window.open(`/reader/${material.id}`, '_blank');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const loadCourse = async () => {
      try {
        setLoading(true);
        // Récupérer les vraies données depuis l'API
        const response = await fetch(`http://localhost:8082/api/courses/${courseId}`);
        if (response.ok) {
          const courseData = await response.json();
          setCourse(courseData);
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [isAuthenticated, router, courseId]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'zip':
        return <Upload className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">À venir</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!isAuthenticated || loading) {
    return null;
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cours non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux cours
      </Button>

        {/* Course Header */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{course.semester}</Badge>
                  <Badge variant="outline">{course.credits} ECTS</Badge>
                </div>
                <CardTitle className="text-2xl text-academic-900 mb-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {course.description}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button className="bg-academic-600 hover:bg-academic-700">
                  <Star className="h-4 w-4 mr-2" />
                  Favoris
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discussion
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{course.teacherName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{course.schedule}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{course.enrolledStudents} étudiants</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{course.room}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content Tabs */}
        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="materials">Supports</TabsTrigger>
            <TabsTrigger value="assignments">Devoirs</TabsTrigger>
            <TabsTrigger value="announcements">Annonces</TabsTrigger>
            <TabsTrigger value="info">Informations</TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Supports de cours</CardTitle>
                <CardDescription>
                  Documents, vidéos et ressources pédagogiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.materials && course.materials.length > 0 ? course.materials.map((material: any) => (
                    <div key={material.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        {getFileIcon(material.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{material.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {material.size || `${material.duration}`}
                            </span>
                            <span>
                              Ajouté le {new Date(material.uploadedAt).toLocaleDateString('fr-FR')}
                            </span>
                            <span>
                              {material.downloadCount ? `${material.downloadCount} téléchargements` : `${material.viewCount} vues`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {material.type === 'video' ? (
                          <Button 
                            size="sm"
                            onClick={() => handleRead(material)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Lire
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleDownload(material)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500">Aucun support disponible pour ce cours.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Devoirs et projets</CardTitle>
                <CardDescription>
                  Travaux à rendre et évaluations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.assignments && course.assignments.length > 0 ? course.assignments.map((assignment: any) => (
                    <div key={assignment.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                        </div>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span>Échéance: {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}</span>
                          <span>{assignment.maxPoints} points</span>
                          <span>{assignment.submissionCount} remises</span>
                        </div>
                        <Button size="sm" className="bg-academic-600 hover:bg-academic-700">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500">Aucun devoir disponible pour ce cours.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Annonces</CardTitle>
                <CardDescription>
                  Informations importantes du cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.announcements && course.announcements.length > 0 ? course.announcements.map((announcement: any) => (
                    <div key={announcement.id} className={`p-4 rounded-lg ${announcement.important ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                        {announcement.important && (
                          <Badge className="bg-red-100 text-red-800">Important</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                      <p className="text-xs text-gray-500">
                        Publié le {new Date(announcement.publishedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )) : (
                    <p className="text-gray-500">Aucune annonce pour ce cours.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Info Tab */}
          <TabsContent value="info">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Informations du cours</CardTitle>
                <CardDescription>
                  Objectifs, planning et modalités
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Objectifs pédagogiques</h4>
                  <ul className="space-y-2">
                    {course.objectives && course.objectives.length > 0 ? course.objectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-academic-600 rounded-full mt-2 flex-shrink-0"></div>
                        {objective}
                      </li>
                    )) : (
                      <p className="text-gray-500">Aucun objectif défini.</p>
                    )}
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Enseignant</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>{course.teacherName}</p>
                      <p>{course.teacherEmail}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Planning</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>{course.schedule}</p>
                      <p>{course.room}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}