'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { BookOpen, Search, Filter, Users, Clock, Download, Play } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { ROUTES } from '@/lib/constants';
import { Course } from '@/types';

export default function CoursesPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Mock courses data
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Architecture des Systèmes Distribués',
        description: 'Conception et développement d\'applications distribuées modernes, microservices, conteneurisation.',
        teacherId: '1',
        teacherName: 'Prof. Martin Dubois',
        semester: 'S1',
        credits: 6,
        coverImage: '/api/placeholder/400/200',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      },
      {
        id: '2',
        title: 'Intelligence Artificielle Avancée',
        description: 'Machine Learning, Deep Learning, réseaux de neurones et applications pratiques.',
        teacherId: '2',
        teacherName: 'Dr. Sarah Leroy',
        semester: 'S1',
        credits: 6,
        coverImage: '/api/placeholder/400/200',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-08'
      },
      {
        id: '3',
        title: 'Sécurité Informatique',
        description: 'Cryptographie, sécurité des réseaux, audit de sécurité et gestion des risques.',
        teacherId: '3',
        teacherName: 'Prof. Jean Moreau',
        semester: 'S1',
        credits: 4,
        coverImage: '/api/placeholder/400/200',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-12'
      },
      {
        id: '4',
        title: 'Gestion de Projet Agile',
        description: 'Méthodologies agiles, Scrum, Kanban, gestion d\'équipe et livraison continue.',
        teacherId: '4',
        teacherName: 'Mme. Claire Petit',
        semester: 'S2',
        credits: 4,
        coverImage: '/api/placeholder/400/200',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      },
      {
        id: '5',
        title: 'Data Science & Big Data',
        description: 'Analyse de données massives, visualisation, algorithmes de recommandation.',
        teacherId: '5',
        teacherName: 'Dr. Pierre Blanc',
        semester: 'S2',
        credits: 6,
        coverImage: '/api/placeholder/400/200',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: '6',
        title: 'Développement Mobile Cross-Platform',
        description: 'React Native, Flutter, développement d\'applications mobiles multiplateformes.',
        teacherId: '6',
        teacherName: 'M. Alex Roux',
        semester: 'S2',
        credits: 5,
        coverImage: '/api/placeholder/400/200',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-11'
      }
    ];

    setCourses(mockCourses);
  }, [isAuthenticated, router]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'all' || course.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Cours
          </h1>
          <p className="text-gray-600">
            Accédez à tous vos cours et supports pédagogiques
          </p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un cours, enseignant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les semestres</SelectItem>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id} 
              className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="aspect-video bg-gradient-to-br from-academic-100 to-academic-200 rounded-t-lg flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-academic-600" />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mb-2">
                    {course.semester} • {course.credits} ECTS
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-academic-600 transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.teacherName}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-academic-600 hover:bg-academic-700">
                    <Play className="h-4 w-4 mr-1" />
                    Accéder
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun cours trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-academic-600 mb-1">
                {courses.length}
              </div>
              <div className="text-sm text-gray-600">Cours inscrits</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </div>
              <div className="text-sm text-gray-600">ECTS totaux</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                85%
              </div>
              <div className="text-sm text-gray-600">Progression moyenne</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}