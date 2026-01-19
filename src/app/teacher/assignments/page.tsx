'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Download, Eye, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const mockAssignments = [
  {
    id: '1',
    title: 'Projet Microservices',
    course: 'Architecture Logicielle',
    dueDate: '2024-02-15',
    submissions: 28,
    totalStudents: 32,
    status: 'active',
    description: 'Développer une architecture microservices complète',
    maxPoints: 100
  },
  {
    id: '2',
    title: 'Analyse de Performance',
    course: 'Optimisation Système',
    dueDate: '2024-02-10',
    submissions: 30,
    totalStudents: 32,
    status: 'grading',
    description: 'Analyser les performances d\'une application web',
    maxPoints: 80
  },
  {
    id: '3',
    title: 'Rapport de Sécurité',
    course: 'Sécurité Informatique',
    dueDate: '2024-01-30',
    submissions: 32,
    totalStudents: 32,
    status: 'completed',
    description: 'Audit de sécurité d\'une application',
    maxPoints: 60
  }
];

const mockSubmissions = [
  {
    id: '1',
    studentName: 'Marie Dupont',
    studentId: '20240001',
    submittedAt: '2024-02-08T14:30:00',
    status: 'submitted',
    files: ['rapport.pdf', 'code.zip'],
    grade: null,
    feedback: ''
  },
  {
    id: '2',
    studentName: 'Jean Martin',
    studentId: '20240002',
    submittedAt: '2024-02-07T16:45:00',
    status: 'graded',
    files: ['projet.pdf', 'source.zip'],
    grade: 85,
    feedback: 'Excellent travail, architecture bien conçue.'
  },
  {
    id: '3',
    studentName: 'Sophie Bernard',
    studentId: '20240003',
    submittedAt: '2024-02-09T10:15:00',
    status: 'late',
    files: ['document.pdf'],
    grade: null,
    feedback: ''
  }
];

export default function TeacherAssignmentsPage() {
  const [selectedTab, setSelectedTab] = useState('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState(mockAssignments[0]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    maxPoints: 100
  });

  const getStatusBadge = (status: string, submissions: number, total: number) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Actif ({submissions}/{total})</Badge>;
      case 'grading':
        return <Badge variant="secondary">Correction en cours</Badge>;
      case 'completed':
        return <Badge variant="outline">Terminé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="default">Soumis</Badge>;
      case 'graded':
        return <Badge variant="outline">Noté</Badge>;
      case 'late':
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCreateAssignment = () => {
    toast.success('Devoir créé avec succès');
    setIsCreateDialogOpen(false);
    setNewAssignment({
      title: '',
      course: '',
      description: '',
      dueDate: '',
      maxPoints: 100
    });
  };

  const handleGradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    toast.success('Note attribuée avec succès');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Devoirs</h1>
            <p className="text-gray-600">Créez et gérez les devoirs de vos étudiants</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Devoir
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau devoir</DialogTitle>
                <DialogDescription>
                  Définissez les détails du devoir pour vos étudiants
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du devoir</Label>
                    <Input
                      id="title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Projet Final"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Cours</Label>
                    <Select value={newAssignment.course} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, course: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un cours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="architecture">Architecture Logicielle</SelectItem>
                        <SelectItem value="security">Sécurité Informatique</SelectItem>
                        <SelectItem value="ai">Intelligence Artificielle</SelectItem>
                        <SelectItem value="data">Data Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez les objectifs et consignes du devoir..."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Date limite</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPoints">Points maximum</Label>
                    <Input
                      id="maxPoints"
                      type="number"
                      value={newAssignment.maxPoints}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, maxPoints: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateAssignment}>
                    Créer le devoir
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments">Mes Devoirs</TabsTrigger>
            <TabsTrigger value="submissions">Soumissions</TabsTrigger>
            <TabsTrigger value="grading">Correction</TabsTrigger>
          </TabsList>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockAssignments.map((assignment) => (
                <Card key={assignment.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription className="mt-1">{assignment.course}</CardDescription>
                      </div>
                      {getStatusBadge(assignment.status, assignment.submissions, assignment.totalStudents)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {assignment.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Date limite:</span>
                        <span className="font-medium">
                          {new Date(assignment.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Points max:</span>
                        <span className="font-medium">{assignment.maxPoints}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Soumissions:</span>
                        <span className="font-medium">
                          {assignment.submissions}/{assignment.totalStudents}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Soumissions récentes</CardTitle>
                    <CardDescription>Gérez les soumissions de vos étudiants</CardDescription>
                  </div>
                  <Select value={selectedAssignment.id} onValueChange={(value) => {
                    const assignment = mockAssignments.find(a => a.id === value);
                    if (assignment) setSelectedAssignment(assignment);
                  }}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAssignments.map((assignment) => (
                        <SelectItem key={assignment.id} value={assignment.id}>
                          {assignment.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{submission.studentName}</h4>
                            <p className="text-sm text-gray-600">ID: {submission.studentId}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getSubmissionStatusBadge(submission.status)}
                            {submission.grade && (
                              <Badge variant="outline">{submission.grade}/100</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(submission.submittedAt).toLocaleString('fr-FR')}
                          </span>
                          <span>{submission.files.length} fichier(s)</span>
                        </div>
                        
                        {submission.feedback && (
                          <p className="text-sm text-gray-600 mt-2 italic">"{submission.feedback}"</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Commenter
                        </Button>
                        {submission.status === 'submitted' && (
                          <Button size="sm">
                            Noter
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grading Tab */}
          <TabsContent value="grading">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Correction en cours</CardTitle>
                <CardDescription>Attribuez des notes et commentaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune correction en attente</h3>
                  <p className="text-gray-600">Toutes les soumissions ont été corrigées.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}