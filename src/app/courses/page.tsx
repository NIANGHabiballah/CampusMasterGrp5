'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { BookOpen, Users, Play, Download } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useCourseStore } from '@/store/courses';
import { ROUTES } from '@/lib/constants';

import { apiService } from '@/services/api';

export default function CoursesPage() {
  const { isAuthenticated } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    semester: 'all',
    teacher: '',
    credits: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourses();
  }, [isAuthenticated, router]);

  const filteredCourses = courses.filter(course => {
    let matches = true;
    
    if (filters.search) {
      matches = matches && (
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        `${course.teacher.firstName} ${course.teacher.lastName}`.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return matches;
  });

  const handleCourseClick = (courseId: number) => {
    router.push(`/courses/${courseId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Cours
          </h1>
          <p className="text-gray-600">
            Accédez à tous vos cours et supports pédagogiques
          </p>
        </div>

        <CourseFilters onFiltersChange={setFilters} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id} 
              className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-blue-600" />
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
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
                    <span>{course.teacher.firstName} {course.teacher.lastName}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
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
                Aucun cours disponible pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}