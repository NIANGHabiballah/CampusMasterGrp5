'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Download, Eye, MessageSquare, Upload, X, File, BarChart3 } from 'lucide-react';
import { SubmissionViewer } from '@/components/assignments/SubmissionViewer';
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

import { apiService } from '@/services/api';
import { useEffect } from 'react';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [assignmentsData, coursesData] = await Promise.all([
          apiService.getAssignments(),
          apiService.getCourses()
        ]);
        setAssignments(assignmentsData);
        setCourses(coursesData);
        
        // Charger les soumissions pour chaque devoir
        const submissionsData = {};
        for (const assignment of assignmentsData) {
          try {
            const assignmentSubmissions = await apiService.getSubmissionsByAssignment(assignment.id);
            submissionsData[assignment.id] = assignmentSubmissions;
          } catch (error) {
            console.log('Pas de soumissions pour:', assignment.id);
            // Données de test temporaires
            submissionsData[assignment.id] = [
              {
                id: `${assignment.id}-1`,
                student: { firstName: 'Marie', lastName: 'Dupont' },
                submittedAt: '2024-02-08T14:30:00',
                grade: null,
                feedback: '',
                files: []
              }
            ];
          }
        }
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  
  const [selectedTab, setSelectedTab] = useState('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState(mockAssignments[0]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState<any>(null);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    files: [] as File[]
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

  const handleViewAssignment = (assignment: any) => {
    setViewingAssignment(assignment);
    setIsViewDialogOpen(true);
  };

  const handleEditAssignment = (assignment: any) => {
    const dueDate = assignment.dueDate;
    let formattedDate = '';
    
    if (dueDate) {
      const dateStr = dueDate.split('.')[0];
      formattedDate = dateStr;
    }
    
    setEditingAssignment({
      ...assignment,
      dueDate: formattedDate
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      console.log('Avant envoi - editingAssignment:', editingAssignment);
      
      const dataToSend = {
        title: editingAssignment.title,
        description: editingAssignment.description,
        maxPoints: editingAssignment.maxPoints,
        dueDate: editingAssignment.dueDate,
        course: editingAssignment.course
      };
      
      console.log('Données envoyées au backend:', dataToSend);
      
      await apiService.updateAssignment(editingAssignment.id, dataToSend);
      const updatedAssignments = await apiService.getAssignments();
      setAssignments(updatedAssignments);
      toast.success('Devoir modifié avec succès');
      setIsEditDialogOpen(false);
      setEditingAssignment(null);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const handleCreateAssignment = async () => {
    try {
      const dataToSend = {
        ...newAssignment,
        course: newAssignment.course
      };
      
      console.log('Données création envoyées:', dataToSend);
      
      await apiService.createAssignment(dataToSend);
      const updatedAssignments = await apiService.getAssignments();
      setAssignments(updatedAssignments);
      toast.success('Devoir créé avec succès');
      setIsCreateDialogOpen(false);
      setNewAssignment({
        title: '',
        course: '',
        description: '',
        dueDate: '',
        maxPoints: 100,
        files: []
      });
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = Array.from(event.target.files || []);
    if (isEdit && editingAssignment) {
      setEditingAssignment(prev => ({
        ...prev,
        files: [...(prev.files || []), ...files]
      }));
    } else {
      setNewAssignment(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
  };

  const removeFile = (index: number, isEdit = false) => {
    if (isEdit && editingAssignment) {
      setEditingAssignment(prev => ({
        ...prev,
        files: prev.files?.filter((_, i) => i !== index) || []
      }));
    } else {
      setNewAssignment(prev => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index)
      }));
    }
  };

  const handleGradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
    try {
      console.log('Notation soumission:', { submissionId, grade, feedback });
      
      // Simuler la sauvegarde pour le moment
      const updatedSubmissions = { ...submissions };
      Object.keys(updatedSubmissions).forEach(assignmentId => {
        updatedSubmissions[assignmentId] = updatedSubmissions[assignmentId].map(sub => 
          sub.id === submissionId ? { ...sub, grade, feedback } : sub
        );
      });
      setSubmissions(updatedSubmissions);
      
      toast.success('Note enregistrée avec succès');
    } catch (error) {
      console.error('Erreur notation:', error);
      toast.error('Erreur lors de l\'enregistrement de la note');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-8">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl opacity-90"></div>
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Gestion des Devoirs
                    </h1>
                    <p className="text-blue-100 text-lg font-medium mt-1">
                      Créez et gérez les devoirs de vos étudiants
                    </p>
                  </div>
                </div>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                    <Plus className="h-5 w-5 mr-2" />
                    Nouveau Devoir
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white">
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau devoir</DialogTitle>
                    <DialogDescription>
                      Définissez les détails du devoir pour vos étudiants
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Titre du devoir</Label>
                        <Input
                          id="title"
                          value={newAssignment.title}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: Projet Final"
                          className="bg-white border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course">Cours</Label>
                        <Select value={newAssignment.course} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, course: value }))}>
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Sélectionner un cours" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-[200]">
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.title}
                              </SelectItem>
                            ))}
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
                        className="bg-white border-gray-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Documents du devoir</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Ajoutez des documents (consignes, ressources...)</p>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(e)}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.doc,.docx,.txt,.zip"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Sélectionner des fichiers
                          </Button>
                        </div>
                        {newAssignment.files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {newAssignment.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <div className="flex items-center">
                                  <File className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Date limite</Label>
                        <Input
                          id="dueDate"
                          type="datetime-local"
                          value={newAssignment.dueDate}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="bg-white border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxPoints">Points maximum</Label>
                        <Input
                          id="maxPoints"
                          type="number"
                          value={newAssignment.maxPoints}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, maxPoints: parseInt(e.target.value) }))}
                          className="bg-white border-gray-300"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateAssignment} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Créer le devoir
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-2">
                <TabsTrigger 
                  value="assignments" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold rounded-xl transition-all duration-300 data-[state=active]:scale-105"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Mes Devoirs
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold rounded-xl transition-all duration-300 data-[state=active]:scale-105"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Notes
                </TabsTrigger>
                <TabsTrigger 
                  value="grading"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold rounded-xl transition-all duration-300 data-[state=active]:scale-105"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Correction
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="assignments">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">Chargement des devoirs...</div>
                </div>
              ) : assignments.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devoir créé</h3>
                    <p className="text-gray-600 mb-4">Commencez par créer votre premier devoir</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un devoir
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {assignments.map((assignment, index) => (
                    <div 
                      key={assignment.id} 
                      className="group relative"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Card className="relative bg-white/80 backdrop-blur-sm border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-2xl overflow-hidden group-hover:bg-white/90">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                        
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-300">
                                {assignment.title}
                              </CardTitle>
                              <CardDescription className="text-sm font-semibold mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  assignment.course?.title 
                                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200' 
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  {assignment.course?.title || 'Cours non défini'}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="ml-3">
                              {getStatusBadge(assignment.status, assignment.submissions || 0, assignment.totalStudents || 0)}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0 space-y-6">
                          <p className="text-sm text-gray-700 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                            {assignment.description || 'Aucune description disponible'}
                          </p>
                          
                          <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 font-medium">Date limite</div>
                                  <div className="font-bold text-gray-900 text-sm">
                                    {new Date(assignment.dueDate).toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    })}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 font-medium">Points max</div>
                                  <div className="font-bold text-gray-900 text-sm">{assignment.maxPoints}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">Soumissions</span>
                                <span className="text-sm font-bold text-gray-900">
                                  {submissions[assignment.id]?.length || 0}/{assignment.totalStudents || 0}
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
                                    style={{ 
                                      width: `${((submissions[assignment.id]?.length || 0) / (assignment.totalStudents || 1)) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-300 hover:shadow-md font-medium"
                              onClick={() => handleViewAssignment(assignment)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 transition-all duration-300 hover:shadow-md font-medium"
                              onClick={() => handleEditAssignment(assignment)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="submissions">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">Notes des étudiants</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">Consultez les notes attribuées aux devoirs</CardDescription>
                    </div>
                    <Select value={selectedAssignment.id} onValueChange={(value) => {
                      const assignment = mockAssignments.find(a => a.id === value);
                      if (assignment) setSelectedAssignment(assignment);
                    }}>
                      <SelectTrigger className="w-64 bg-white border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {mockAssignments.map((assignment) => (
                          <SelectItem key={assignment.id} value={assignment.id}>
                            {assignment.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {mockSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune note disponible</h3>
                      <p className="text-gray-600">Les notes apparaîtront ici après correction des devoirs.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {submissions[selectedAssignment.id]?.filter(sub => sub.grade !== null).map((submission) => (
                          <Card key={submission.id} className="border border-gray-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center justify-between">
                                <span>{submission.studentName || submission.student?.firstName + ' ' + submission.student?.lastName}</span>
                                <Badge variant={submission.grade >= 70 ? "default" : submission.grade >= 50 ? "secondary" : "destructive"}>
                                  {submission.grade}/100
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Soumis le:</span>
                                  <span>{new Date(submission.submittedAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                                {submission.feedback && (
                                  <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-blue-900 mb-1">Commentaire:</p>
                                    <p className="text-sm text-blue-800">{submission.feedback}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )) || []}
                      </div>
                      
                      {submissions[selectedAssignment.id]?.filter(sub => sub.grade !== null).length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Aucune note attribuée pour ce devoir.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grading">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="text-xl font-semibold text-gray-900">Correction en cours</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">Attribuez des notes et commentaires</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {mockSubmissions.filter(s => !s.grade).length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune correction en attente</h3>
                      <p className="text-gray-600 max-w-md mx-auto">Toutes les soumissions ont été corrigées. Les nouvelles soumissions apparaîtront ici automatiquement.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          {mockSubmissions.filter(s => !s.grade).length} soumission(s) en attente de correction
                        </p>
                      </div>
                      {mockSubmissions.filter(s => !s.grade).map((submission) => (
                        <SubmissionViewer
                          key={submission.id}
                          submission={{
                            ...submission,
                            files: submission.files.map(fileName => ({
                              id: `${submission.id}-${fileName}`,
                              name: fileName,
                              url: `/api/files/${fileName}`,
                              size: Math.random() * 1000000,
                              type: fileName.endsWith('.pdf') ? 'application/pdf' : 
                                    fileName.endsWith('.zip') ? 'application/zip' : 'text/plain'
                            }))
                          }}
                          onGrade={handleGradeSubmission}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Détails du devoir</DialogTitle>
              </DialogHeader>
              {viewingAssignment && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{viewingAssignment.title}</h3>
                    <p className="text-blue-700 font-medium">{viewingAssignment.course?.title || 'Cours non défini'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{viewingAssignment.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Date limite
                      </h4>
                      <p className="text-green-800 font-medium text-lg">
                        {new Date(viewingAssignment.dueDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Points maximum
                      </h4>
                      <p className="text-purple-800 font-bold text-2xl">{viewingAssignment.maxPoints}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">Soumissions</h4>
                      <p className="text-orange-800 font-medium">
                        {viewingAssignment.submissions || 0}/{viewingAssignment.totalStudents || 0} étudiants
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2">Statut</h4>
                      <p className="text-indigo-800 font-medium capitalize">
                        {viewingAssignment.status || 'Actif'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Fermer
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        handleEditAssignment(viewingAssignment);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Modifier ce devoir
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Modifier le devoir</DialogTitle>
                <DialogDescription>
                  Modifiez les détails du devoir
                </DialogDescription>
              </DialogHeader>
              {editingAssignment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Titre du devoir</Label>
                      <Input
                        id="edit-title"
                        value={editingAssignment.title}
                        onChange={(e) => setEditingAssignment(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-course">Cours</Label>
                      <Select 
                        value={editingAssignment.course?.id?.toString() || editingAssignment.course?.toString() || ''} 
                        onValueChange={(value) => {
                          console.log('Cours sélectionné:', value);
                          setEditingAssignment(prev => ({ ...prev, course: value }));
                        }}
                      >
                        <SelectTrigger className="bg-white border-gray-300">
                          <SelectValue placeholder="Sélectionner un cours" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-[200]">
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editingAssignment.description}
                      onChange={(e) => setEditingAssignment(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Documents du devoir</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Ajoutez des documents</p>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(e, true)}
                          className="hidden"
                          id="edit-file-upload"
                          accept=".pdf,.doc,.docx,.txt,.zip"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('edit-file-upload')?.click()}
                        >
                          Sélectionner des fichiers
                        </Button>
                      </div>
                      {editingAssignment.files && editingAssignment.files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {editingAssignment.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center">
                                <File className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm">{file.name || file}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index, true)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-dueDate">Date limite</Label>
                      <Input
                        id="edit-dueDate"
                        type="datetime-local"
                        value={editingAssignment.dueDate}
                        onChange={(e) => setEditingAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-maxPoints">Points maximum</Label>
                      <Input
                        id="edit-maxPoints"
                        type="number"
                        value={editingAssignment.maxPoints}
                        onChange={(e) => setEditingAssignment(prev => ({ ...prev, maxPoints: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}