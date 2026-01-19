'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { 
  FileText, Upload, Calendar, Clock, AlertCircle, CheckCircle, 
  Search, Filter, Download, Eye, Star, BookOpen 
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { ROUTES } from '@/lib/constants';
import { Assignment } from '@/types';

export default function AssignmentsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Mock assignments data
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        courseId: '1',
        title: 'Projet Architecture Microservices',
        description: 'Concevoir et implémenter une architecture microservices complète pour un système e-commerce. Le projet doit inclure au minimum 5 services, une API Gateway, et un système de monitoring.',
        dueDate: '2024-02-15T23:59:00',
        maxPoints: 100,
        attachments: [
          {
            id: '1',
            name: 'Cahier_des_charges.pdf',
            url: '/files/cahier_charges.pdf',
            size: 245760,
            type: 'application/pdf',
            uploadedAt: '2024-01-10T10:00:00'
          }
        ],
        submissions: [
          {
            id: '1',
            assignmentId: '1',
            studentId: user?.id || '1',
            studentName: `${user?.firstName} ${user?.lastName}`,
            files: [
              {
                id: '2',
                name: 'projet_microservices.zip',
                url: '/files/projet.zip',
                size: 1048576,
                type: 'application/zip',
                uploadedAt: '2024-02-10T14:30:00'
              }
            ],
            submittedAt: '2024-02-10T14:30:00',
            grade: 85,
            feedback: 'Excellent travail sur l\'architecture. Quelques améliorations possibles sur la gestion des erreurs.',
            status: 'graded'
          }
        ],
        createdAt: '2024-01-10T10:00:00'
      },
      {
        id: '2',
        courseId: '2',
        title: 'Analyse de Données - Machine Learning',
        description: 'Développer un modèle de machine learning pour prédire les ventes d\'un e-commerce. Utiliser Python, pandas, scikit-learn et présenter les résultats dans un notebook Jupyter.',
        dueDate: '2024-02-20T23:59:00',
        maxPoints: 80,
        attachments: [
          {
            id: '3',
            name: 'dataset_ventes.csv',
            url: '/files/dataset.csv',
            size: 512000,
            type: 'text/csv',
            uploadedAt: '2024-01-15T09:00:00'
          }
        ],
        submissions: [],
        createdAt: '2024-01-15T09:00:00'
      },
      {
        id: '3',
        courseId: '3',
        title: 'Audit de Sécurité - Rapport',
        description: 'Réaliser un audit de sécurité complet d\'une application web. Le rapport doit inclure l\'identification des vulnérabilités, leur classification et les recommandations de correction.',
        dueDate: '2024-01-25T23:59:00',
        maxPoints: 90,
        attachments: [],
        submissions: [
          {
            id: '2',
            assignmentId: '3',
            studentId: user?.id || '1',
            studentName: `${user?.firstName} ${user?.lastName}`,
            files: [
              {
                id: '4',
                name: 'audit_securite.pdf',
                url: '/files/audit.pdf',
                size: 2097152,
                type: 'application/pdf',
                uploadedAt: '2024-01-24T16:45:00'
              }
            ],
            submittedAt: '2024-01-24T16:45:00',
            status: 'submitted'
          }
        ],
        createdAt: '2024-01-08T14:00:00'
      },
      {
        id: '4',
        courseId: '4',
        title: 'Présentation Méthodologie Agile',
        description: 'Préparer une présentation de 15 minutes sur une méthodologie agile de votre choix (Scrum, Kanban, XP, etc.). Inclure des exemples concrets et des retours d\'expérience.',
        dueDate: '2024-03-01T23:59:00',
        maxPoints: 60,
        attachments: [],
        submissions: [],
        createdAt: '2024-01-20T11:00:00'
      }
    ];

    setAssignments(mockAssignments);
  }, [isAuthenticated, router, user]);

  const getAssignmentStatus = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const userSubmission = assignment.submissions?.find(s => s.studentId === user?.id);

    if (userSubmission) {
      if (userSubmission.grade !== undefined) {
        return { status: 'graded', label: 'Noté', color: 'bg-green-100 text-green-800' };
      }
      return { status: 'submitted', label: 'Rendu', color: 'bg-blue-100 text-blue-800' };
    }

    if (now > dueDate) {
      return { status: 'overdue', label: 'En retard', color: 'bg-red-100 text-red-800' };
    }

    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <= 3) {
      return { status: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800' };
    }

    return { status: 'pending', label: 'À faire', color: 'bg-gray-100 text-gray-800' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'submitted':
        return <Upload className="h-4 w-4 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'urgent':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const assignmentStatus = getAssignmentStatus(assignment);
    return matchesSearch && assignmentStatus.status === statusFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAssignmentClick = (assignmentId: string) => {
    router.push(`/assignments/${assignmentId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  const pendingAssignments = filteredAssignments.filter(a => getAssignmentStatus(a).status === 'pending');
  const submittedAssignments = filteredAssignments.filter(a => ['submitted', 'graded'].includes(getAssignmentStatus(a).status));
  const overdueAssignments = filteredAssignments.filter(a => getAssignmentStatus(a).status === 'overdue');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Devoirs
          </h1>
          <p className="text-gray-600">
            Gérez vos travaux et suivez vos évaluations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">À faire</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingAssignments.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Rendus</p>
                  <p className="text-2xl font-bold text-blue-600">{submittedAssignments.length}</p>
                </div>
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">En retard</p>
                  <p className="text-2xl font-bold text-red-600">{overdueAssignments.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Moyenne</p>
                  <p className="text-2xl font-bold text-green-600">16.2</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un devoir..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">À faire</SelectItem>
                  <SelectItem value="submitted">Rendus</SelectItem>
                  <SelectItem value="graded">Notés</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tous ({filteredAssignments.length})</TabsTrigger>
            <TabsTrigger value="pending">À faire ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="submitted">Rendus ({submittedAssignments.length})</TabsTrigger>
            <TabsTrigger value="overdue">En retard ({overdueAssignments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => {
                const status = getAssignmentStatus(assignment);
                const userSubmission = assignment.submissions?.find(s => s.studentId === user?.id);
                
                return (
                  <Card 
                    key={assignment.id} 
                    className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleAssignmentClick(assignment.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getStatusIcon(status.status)}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{assignment.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                Cours {assignment.courseId}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Échéance: {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                              </span>
                              <span>{assignment.maxPoints} points</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>{status.label}</Badge>
                          {userSubmission?.grade !== undefined && (
                            <Badge className="bg-green-100 text-green-800">
                              {userSubmission.grade}/{assignment.maxPoints}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Attachments */}
                      {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Fichiers fournis:</h4>
                          <div className="flex flex-wrap gap-2">
                            {assignment.attachments.map((file) => (
                              <div key={file.id} className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1 text-sm">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span>{file.name}</span>
                                <span className="text-gray-500">({formatFileSize(file.size)})</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submission Info */}
                      {userSubmission && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">Votre rendu:</h4>
                          <div className="space-y-2">
                            {userSubmission.files.map((file) => (
                              <div key={file.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <span>{file.name}</span>
                                  <span className="text-gray-500">({formatFileSize(file.size)})</span>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <p className="text-xs text-blue-700">
                              Rendu le {new Date(userSubmission.submittedAt).toLocaleString('fr-FR')}
                            </p>
                            {userSubmission.feedback && (
                              <div className="mt-2 p-2 bg-white rounded border">
                                <p className="text-xs font-medium text-gray-700">Commentaire:</p>
                                <p className="text-xs text-gray-600">{userSubmission.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">
                          Échéance: {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button className="bg-academic-600 hover:bg-academic-700">
                        Commencer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submitted">
            <div className="space-y-4">
              {submittedAssignments.map((assignment) => {
                const userSubmission = assignment.submissions?.find(s => s.studentId === user?.id);
                return (
                  <Card key={assignment.id} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">
                            Rendu le {userSubmission && new Date(userSubmission.submittedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        {userSubmission?.grade !== undefined ? (
                          <Badge className="bg-green-100 text-green-800">
                            {userSubmission.grade}/{assignment.maxPoints}
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">En attente</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="overdue">
            <div className="space-y-4">
              {overdueAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-0 shadow-sm border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-red-600">
                          Échéance dépassée: {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button variant="destructive">
                        Rendre en retard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}