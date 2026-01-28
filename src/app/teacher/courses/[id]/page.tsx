'use client';

import { useParams } from 'next/navigation';
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

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;

  const courseData = {
    id: courseId,
    title: 'Architecture des Systèmes Distribués',
    description: 'Ce cours couvre les concepts fondamentaux de l\'architecture des systèmes distribués, incluant la conception, l\'implémentation et la maintenance d\'applications distribuées modernes.',
    instructor: 'Prof. Jean Martin',
    instructorEmail: 'jean.martin@campus.fr',
    semester: 'S1 2024',
    credits: 6,
    duration: '14 semaines',
    totalHours: 42,
    weeklyHours: 3,
    students: 45,
    maxStudents: 50,
    language: 'Français',
    level: 'Master 2',
    materials: [
      { name: 'Cours 1 - Introduction.pdf', size: '2.4 MB' },
      { name: 'TP1 - Configuration Docker.pdf', size: '1.8 MB' },
      { name: 'Slides - Microservices.pptx', size: '5.2 MB' },
      { name: 'Code - Exemple REST API.zip', size: '12.1 MB' }
    ],
    schedule: [
      { day: 'Lundi', time: '14h00 - 17h00', room: 'Salle A201' },
      { day: 'Mercredi', time: '09h00 - 12h00', room: 'Lab Informatique B' }
    ]
  };

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
                <Badge variant="secondary">{courseData.semester}</Badge>
                <Badge variant="outline">{courseData.credits} ECTS</Badge>
                <Badge variant="outline">{courseData.level}</Badge>
              </div>
              <CardTitle className="text-2xl mb-2">{courseData.title}</CardTitle>
              <CardDescription className="text-base">
                {courseData.description}
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
                  <p>{courseData.instructor}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email :</span>
                  <p className="text-blue-600">{courseData.instructorEmail}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Durée :</span>
                  <p>{courseData.duration}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Volume horaire :</span>
                  <p>{courseData.totalHours}h ({courseData.weeklyHours}h/semaine)</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Langue :</span>
                  <p>{courseData.language}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Étudiants :</span>
                  <p>{courseData.students}/{courseData.maxStudents}</p>
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
                <span className="font-bold">{courseData.students}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Supports de cours</span>
                </div>
                <span className="font-bold">{courseData.materials.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Horaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseData.schedule.map((session, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{session.day}</div>
                  <div className="text-sm text-gray-600">{session.time}</div>
                  <div className="text-sm text-gray-600">{session.room}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Supports de cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courseData.materials.map((material, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{material.name}</div>
                    <div className="text-xs text-gray-500">{material.size}</div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}