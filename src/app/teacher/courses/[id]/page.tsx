'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Clock, 
  Users, 
  FileText, 
  Calendar, 
  Award,
  Download,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await apiService.getCourseById(courseId.toString());
        setCourse(courseData);
      } catch (error) {
        console.error('Erreur chargement cours:', error);
        toast.error('Erreur lors du chargement du cours');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement du cours...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Cours non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/teacher/courses">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux cours
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{course.semester || 'S1'}</Badge>
                <Badge variant="outline">{course.credits} ECTS</Badge>
                <Badge variant="outline">Master 2</Badge>
              </div>
              <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
              <CardDescription className="text-base">
                {course.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Informations du cours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Enseignant :</span>
                  <p>{course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'Non assigné'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email :</span>
                  <p className="text-blue-600">{course.teacher?.email || 'Non défini'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Durée :</span>
                  <p>14 semaines</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Volume horaire :</span>
                  <p>42h (3h/semaine)</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Langue :</span>
                  <p>Français</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Étudiants :</span>
                  <p>{course.maxStudents ? `0/${course.maxStudents}` : 'Non défini'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Étudiants inscrits</span>
                </div>
                <span className="font-bold">0</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Supports de cours</span>
                </div>
                <span className="font-bold">{course.materials?.length || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Horaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Lundi</div>
                <div className="text-sm text-gray-600">14h00 - 17h00</div>
                <div className="text-sm text-gray-600">Cours en ligne</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Mercredi</div>
                <div className="text-sm text-gray-600">09h00 - 12h00</div>
                <div className="text-sm text-gray-600">TP pratique en ligne</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Supports de cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {course.materials && course.materials.length > 0 ? (
                course.materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{material.fileName}</div>
                      <div className="text-xs text-gray-500">{(material.fileSize / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={async () => {
                        try {
                          const response = await fetch(`http://localhost:8082/api/materials/download/${material.id}`);
                          if (response.ok) {
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = material.fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                            toast.success('Support téléchargé');
                          }
                        } catch (error) {
                          toast.error('Erreur lors du téléchargement');
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Aucun support disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}