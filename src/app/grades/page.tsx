'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { GradeEvolutionChart, PerformanceComparisonChart } from '@/components/dashboard/Charts';
import { TrendingUp, TrendingDown, Award, BookOpen, Calendar, Target } from 'lucide-react';

const mockGrades = [
  {
    id: '1',
    course: 'Architecture Logicielle',
    assignment: 'Projet Microservices',
    grade: 16.5,
    maxGrade: 20,
    date: '2024-01-15',
    coefficient: 2,
    type: 'Projet',
    feedback: 'Excellent travail sur la conception des microservices. Architecture bien pensée.'
  },
  {
    id: '2',
    course: 'Intelligence Artificielle',
    assignment: 'Examen Final',
    grade: 17.2,
    maxGrade: 20,
    date: '2024-01-10',
    coefficient: 3,
    type: 'Examen',
    feedback: 'Très bonne maîtrise des concepts d\'IA. Réponses claires et précises.'
  },
  {
    id: '3',
    course: 'Sécurité Informatique',
    assignment: 'TP Cryptographie',
    grade: 15.8,
    maxGrade: 20,
    date: '2024-01-08',
    coefficient: 1,
    type: 'TP',
    feedback: 'Bonne implémentation des algorithmes de chiffrement.'
  },
  {
    id: '4',
    course: 'Data Science',
    assignment: 'Analyse de Données',
    grade: 18.0,
    maxGrade: 20,
    date: '2024-01-05',
    coefficient: 2,
    type: 'Projet',
    feedback: 'Analyse très approfondie et visualisations excellentes.'
  }
];

const courseAverages = [
  { course: 'Architecture Logicielle', average: 16.2, target: 16.0, trend: 'up' },
  { course: 'Intelligence Artificielle', average: 17.1, target: 16.5, trend: 'up' },
  { course: 'Sécurité Informatique', average: 15.8, target: 16.0, trend: 'down' },
  { course: 'Data Science', average: 17.5, target: 17.0, trend: 'up' },
  { course: 'Projet Opérationnel', average: 16.8, target: 16.5, trend: 'up' }
];

export default function GradesPage() {
  const [selectedSemester, setSelectedSemester] = useState('current');
  
  const overallAverage = 16.7;
  const classAverage = 15.2;
  const ranking = 3;
  const totalStudents = 45;

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBadgeVariant = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 85) return 'default';
    if (percentage >= 70) return 'secondary';
    if (percentage >= 60) return 'outline';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Notes</h1>
          <p className="text-gray-600">Consultez vos résultats et suivez votre progression académique</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Moyenne générale</p>
                  <p className="text-3xl font-bold text-green-600">{overallAverage}/20</p>
                  <p className="text-sm text-green-600 mt-1">+0.3 ce mois</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rang dans la classe</p>
                  <p className="text-3xl font-bold text-blue-600">{ranking}/{totalStudents}</p>
                  <p className="text-sm text-blue-600 mt-1">Top 7%</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Moyenne de classe</p>
                  <p className="text-3xl font-bold text-gray-600">{classAverage}/20</p>
                  <p className="text-sm text-gray-500 mt-1">Référence</p>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Évaluations</p>
                  <p className="text-3xl font-bold text-purple-600">{mockGrades.length}</p>
                  <p className="text-sm text-purple-600 mt-1">Ce semestre</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedSemester} onValueChange={setSelectedSemester} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">Semestre actuel</TabsTrigger>
            <TabsTrigger value="previous">Semestre précédent</TabsTrigger>
            <TabsTrigger value="all">Toutes les notes</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedSemester} className="space-y-6">
            {/* Course Averages */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Moyennes par matière</CardTitle>
                <CardDescription>Vos performances dans chaque cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseAverages.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{course.course}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${getGradeColor(course.average, 20)}`}>
                              {course.average}/20
                            </span>
                            {course.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Progress 
                            value={(course.average / 20) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-gray-500">
                            Objectif: {course.target}/20
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Notes récentes</CardTitle>
                <CardDescription>Vos dernières évaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGrades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                            <p className="text-sm text-gray-600">{grade.course}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={getGradeBadgeVariant(grade.grade, grade.maxGrade)}>
                              {grade.type}
                            </Badge>
                            <span className={`text-lg font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                              {grade.grade}/{grade.maxGrade}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(grade.date).toLocaleDateString('fr-FR')}
                            </span>
                            <span>Coeff. {grade.coefficient}</span>
                          </div>
                          <span>{((grade.grade / grade.maxGrade) * 100).toFixed(0)}%</span>
                        </div>
                        {grade.feedback && (
                          <p className="text-sm text-gray-600 mt-2 italic">"{grade.feedback}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GradeEvolutionChart />
              <PerformanceComparisonChart />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}