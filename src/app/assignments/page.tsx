'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

import { apiService } from '@/services/api';

export default function AssignmentsPage() {
  const { user } = useAuthStore();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [viewingAssignment, setViewingAssignment] = useState<any>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [submissionContent, setSubmissionContent] = useState('');
  const [assignmentFiles, setAssignmentFiles] = useState<File[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Charger les devoirs et soumissions
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Chargement des devoirs...');
        const assignmentsData = await apiService.getAssignments();
        setAssignments(assignmentsData || []);
        
        // Charger les soumissions de l'étudiant
        if (user?.role === 'STUDENT') {
          const submissionsData = [];
          for (const assignment of assignmentsData || []) {
            try {
              const assignmentSubmissions = await apiService.getSubmissionsByAssignment(assignment.id.toString());
              const userSubmission = assignmentSubmissions.find(s => s.student?.id?.toString() === user.id);
              if (userSubmission) {
                submissionsData.push(userSubmission);
              }
            } catch (error) {
              console.log(`Pas de soumissions pour le devoir ${assignment.id}`);
            }
          }
          setSubmissions(submissionsData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadData();
    }
  }, [user]);
  
  // Mock data pour les soumissions à corriger
  const mockSubmissions = [
    {
      id: '1',
      assignmentId: '1',
      assignmentTitle: 'Projet React - Application Todo',
      studentName: 'Marie Dupont',
      submittedAt: '2024-02-10T14:30:00',
      grade: null,
      maxPoints: 100
    },
    {
      id: '2', 
      assignmentId: '2',
      assignmentTitle: 'API REST avec Node.js',
      studentName: 'Pierre Martin',
      submittedAt: '2024-02-12T16:45:00',
      grade: 75,
      maxPoints: 80
    }
  ];

  const handleGradeSubmission = () => {
    toast.success(`Note attribuée: ${grade}/${selectedSubmission?.maxPoints}`);
    setIsGradingOpen(false);
    setGrade('');
    setFeedback('');
  };
  const mockAssignments = [
    {
      id: '1',
      title: 'Projet React - Application Todo',
      description: 'Créer une application de gestion de tâches avec React et TypeScript. L\'application doit permettre d\'ajouter, modifier, supprimer et marquer comme terminées les tâches.',
      courseId: '1',
      dueDate: '2024-02-15T23:59:00',
      maxPoints: 100,
      submissions: []
    },
    {
      id: '2',
      title: 'API REST avec Node.js',
      description: 'Développer une API REST complète avec Node.js et Express pour gérer les utilisateurs et leurs données.',
      courseId: '2',
      dueDate: '2024-02-20T23:59:00',
      maxPoints: 80,
      submissions: []
    },
    {
      id: '3',
      title: 'Modélisation Base de Données',
      description: 'Concevoir et implémenter un schéma de base de données pour un système de gestion de bibliothèque.',
      courseId: '3',
      dueDate: '2024-02-25T23:59:00',
      maxPoints: 60,
      submissions: []
    }
  ];
  
  // New assignment form
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxPoints: 20
  });

  const handleCreateAssignment = async () => {
    console.log('=== CRÉATION DEVOIR FRONTEND ===');
    console.log('Données:', newAssignment);
    console.log('Fichiers:', assignmentFiles);
    
    if (!newAssignment.title || !newAssignment.description || !newAssignment.courseId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const result = await apiService.createAssignment(newAssignment);
      console.log('Résultat création:', result);
      
      // Recharger les devoirs
      const data = await apiService.getAssignments();
      setAssignments(data || []);
      
      toast.success('Devoir créé avec succès');
      setIsCreateDialogOpen(false);
      setNewAssignment({
        title: '',
        description: '',
        courseId: '',
        dueDate: '',
        maxPoints: 20
      });
      setAssignmentFiles([]);
    } catch (error) {
      console.error('Erreur création complète:', error);
      console.error('Stack trace:', error.stack);
      toast.error('Erreur lors de la création: ' + error.message);
    }
  };

  const handleSubmitAssignment = async () => {
    if (uploadFiles.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier');
      return;
    }

    try {
      console.log('=== SOUMISSION FRONTEND ===');
      console.log('Assignment ID:', selectedAssignment);
      console.log('User ID:', user?.id);
      console.log('Files:', uploadFiles.length);
      
      const result = await apiService.createSubmission(
        selectedAssignment,
        user?.id || '1',
        submissionContent,
        uploadFiles
      );
      
      console.log('Résultat:', result);
      toast.success('Devoir soumis avec succès');
      setIsSubmitDialogOpen(false);
      setUploadFiles([]);
      setSubmissionContent('');
      
      // Recharger les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur soumission complète:', error);
      toast.error('Erreur lors de la soumission: ' + error.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(files);
  };

  const handleViewDetails = (assignment: any) => {
    setViewingAssignment(assignment);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (assignment: any) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const userSubmission = submissions.find(s => s.assignment?.id === assignment.id);
    
    if (userSubmission) {
      if (userSubmission.grade !== null) {
        return <Badge variant="outline" className="border-green-600 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Noté ({userSubmission.grade}/20)</Badge>;
      }
      return <Badge variant="outline" className="border-blue-600 text-blue-600"><CheckCircle className="w-3 h-3 mr-1" />Soumis</Badge>;
    }
    
    if (now > dueDate) {
      return <Badge variant="outline" className="border-red-600 text-red-600"><AlertCircle className="w-3 h-3 mr-1 text-red-600" />Échéance dépassée</Badge>;
    }
    
    return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />À faire</Badge>;
  };

  const filteredAssignments = selectedCourse === 'all' 
    ? assignments 
    : assignments.filter(a => a.courseId === selectedCourse);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Chargement des devoirs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Devoirs</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {user?.role === 'STUDENT' ? 'Consultez et soumettez vos devoirs' : 'Gérez et corrigez les devoirs de vos cours'}
          </p>
        </div>
        
        {user?.role !== 'STUDENT' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nouveau devoir</span>
                <span className="sm:hidden">Nouveau</span>
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
                <div>
                  <Label htmlFor="title">Titre du devoir</Label>
                  <Input
                    id="title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    placeholder="Ex: Projet React - Application Todo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="course">Cours</Label>
                  <select 
                    id="course"
                    value={newAssignment.courseId} 
                    onChange={(e) => setNewAssignment({...newAssignment, courseId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Sélectionner un cours</option>
                    <option value="1">React Avancé</option>
                    <option value="2">Node.js Backend</option>
                    <option value="3">Base de Données</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    placeholder="Décrivez les objectifs et consignes du devoir..."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Date limite</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPoints">Points maximum</Label>
                    <Input
                      id="maxPoints"
                      type="number"
                      value={newAssignment.maxPoints}
                      onChange={(e) => setNewAssignment({...newAssignment, maxPoints: parseInt(e.target.value)})}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="assignmentFiles">Fichiers à joindre (optionnel)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <Input
                      id="assignmentFiles"
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setAssignmentFiles(files);
                      }}
                      accept=".pdf,.doc,.docx,.zip,.rar,.txt"
                      className="w-full cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Cahier des charges, consignes, ressources...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Formats: PDF, DOC, DOCX, ZIP, RAR, TXT
                    </p>
                  </div>
                  {assignmentFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {assignmentFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span>{file.name}</span>
                          <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2">
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
        )}
      </div>

      {/* Filters */}
      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className={`grid w-full ${user?.role === 'STUDENT' ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <TabsTrigger value="assignments">Devoirs</TabsTrigger>
          {user?.role !== 'STUDENT' && (
            <TabsTrigger value="corrections">Corrections</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="assignments">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[200]">
                <SelectItem value="all">Tous les cours</SelectItem>
                <SelectItem value="1">React Avancé</SelectItem>
                <SelectItem value="2">Node.js Backend</SelectItem>
                <SelectItem value="3">Base de Données</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignments Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAssignments.map((assignment) => {
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = new Date() > dueDate;
          
          return (
            <Card key={assignment.id} className={`hover:shadow-lg transition-shadow ${
              isOverdue ? 'border-red-200 bg-red-50' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">{assignment.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      Cours: {assignment.course?.title || 'Cours non défini'} • {assignment.maxPoints} points
                    </CardDescription>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(assignment)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                  {assignment.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Échéance: {dueDate.toLocaleDateString('fr-FR')}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {user?.role === 'STUDENT' ? (
                    (() => {
                      const now = new Date();
                      const dueDate = new Date(assignment.dueDate);
                      const userSubmission = submissions.find(s => s.assignment?.id === assignment.id);
                      const isOverdue = now > dueDate;
                      
                      if (userSubmission) {
                        // Devoir déjà soumis
                        return (
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setViewingAssignment({...assignment, submission: userSubmission});
                                setIsDetailDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Voir soumission</span>
                              <span className="sm:hidden">Soumission</span>
                            </Button>
                            {!isOverdue && (
                              <Button size="sm" className="flex-1">
                                <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Modifier</span>
                                <span className="sm:hidden">Modif</span>
                              </Button>
                            )}
                          </div>
                        );
                      } else if (isOverdue) {
                        // Échéance dépassée
                        return (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleViewDetails(assignment)}
                            >
                              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Détails</span>
                              <span className="sm:hidden">Voir</span>
                            </Button>
                            <Button size="sm" className="flex-1" disabled>
                              <AlertCircle className="w-4 h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Échéance dépassée</span>
                              <span className="sm:hidden">Expiré</span>
                            </Button>
                          </>
                        );
                      } else {
                        // Pas encore soumis et dans les temps
                        return (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleViewDetails(assignment)}
                            >
                              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Détails</span>
                              <span className="sm:hidden">Voir</span>
                            </Button>
                            <Dialog open={isSubmitDialogOpen && selectedAssignment === assignment.id} 
                                   onOpenChange={(open) => {
                                     setIsSubmitDialogOpen(open);
                                     if (open) setSelectedAssignment(assignment.id);
                                   }}>
                              <DialogTrigger asChild>
                                <Button size="sm" className="flex-1">
                                  <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                                  <span className="hidden sm:inline">Soumettre</span>
                                  <span className="sm:hidden">Envoyer</span>
                                </Button>
                              </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Soumettre le devoir</DialogTitle>
                                <DialogDescription>
                                  {assignment.title}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="files">Fichiers à soumettre</Label>
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <Input
                                      id="files"
                                      type="file"
                                      multiple
                                      onChange={handleFileUpload}
                                      accept=".pdf,.doc,.docx,.zip,.rar"
                                      className="w-full cursor-pointer"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                      Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      Formats acceptés: PDF, DOC, DOCX, ZIP, RAR (Max 50MB par fichier)
                                    </p>
                                  </div>
                                </div>
                                
                                {uploadFiles.length > 0 && (
                                  <div className="space-y-2">
                                    <Label>Fichiers sélectionnés:</Label>
                                    {uploadFiles.map((file, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="text-sm">{file.name}</span>
                                        <span className="text-xs text-gray-500">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div>
                                  <Label htmlFor="content">Commentaire (optionnel)</Label>
                                  <Textarea
                                    id="content"
                                    value={submissionContent}
                                    onChange={(e) => setSubmissionContent(e.target.value)}
                                    placeholder="Ajoutez un commentaire sur votre travail..."
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                                    Annuler
                                  </Button>
                                  <Button onClick={handleSubmitAssignment}>
                                    Soumettre le devoir
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                            </Dialog>
                          </>
                        );
                      }
                    })()
                  ) : (
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Modifier</span>
                        <span className="sm:hidden">Modif</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Supprimer</span>
                        <span className="sm:hidden">Suppr</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
          </div>
          
          {filteredAssignments.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun devoir</h3>
                <p className="text-gray-600">
                  {user?.role === 'STUDENT' 
                    ? 'Aucun devoir disponible pour le moment.' 
                    : 'Créez votre premier devoir pour vos étudiants.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Corrections pour les enseignants */}
        {user?.role !== 'STUDENT' && (
          <TabsContent value="corrections">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Devoirs à corriger</h2>
              <div className="grid gap-4">
                {mockSubmissions.map((submission) => (
                  <Card key={submission.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium">{submission.assignmentTitle}</h3>
                        <p className="text-sm text-gray-600">Par: {submission.studentName}</p>
                        <p className="text-sm text-gray-500">Soumis le: {new Date(submission.submittedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setIsGradingOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Corriger
                        </Button>
                        {submission.grade && (
                          <Badge variant="outline">
                            {submission.grade}/{submission.maxPoints}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Dialog de détails */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du devoir</DialogTitle>
          </DialogHeader>
          {viewingAssignment && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{viewingAssignment.title}</h3>
                <p className="text-gray-600">Cours: {viewingAssignment.course?.title || 'Cours non défini'} • {viewingAssignment.maxPoints} points</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{viewingAssignment.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Date limite</h4>
                  <p>{new Date(viewingAssignment.dueDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <h4 className="font-medium">Points maximum</h4>
                  <p>{viewingAssignment.maxPoints}</p>
                </div>
              </div>
              
              {/* Afficher les détails de la soumission si elle existe */}
              {viewingAssignment.submission && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Votre soumission</h4>
                  <div className="bg-blue-50 p-4 rounded space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Soumis le:</span>
                      <span>{new Date(viewingAssignment.submission.submittedAt).toLocaleString('fr-FR')}</span>
                    </div>
                    {viewingAssignment.submission.content && (
                      <div>
                        <span className="font-medium">Commentaire:</span>
                        <p className="text-gray-700 mt-1">{viewingAssignment.submission.content}</p>
                      </div>
                    )}
                    {viewingAssignment.submission.files && viewingAssignment.submission.files.length > 0 && (
                      <div>
                        <span className="font-medium">Fichiers soumis:</span>
                        <ul className="list-disc list-inside mt-1">
                          {viewingAssignment.submission.files.map((file, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {file.originalName} ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {viewingAssignment.submission.grade !== null && (
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Note:</span>
                          <span className="text-lg font-bold text-green-600">
                            {viewingAssignment.submission.grade}/20
                          </span>
                        </div>
                        {viewingAssignment.submission.feedback && (
                          <div className="mt-2">
                            <span className="font-medium">Feedback:</span>
                            <p className="text-gray-700 mt-1 italic">"{viewingAssignment.submission.feedback}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Instructions</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Respectez la date limite de soumission</li>
                  <li>Formats acceptés: PDF, DOC, DOCX, ZIP, RAR</li>
                  <li>Taille maximale par fichier: 50MB</li>
                  <li>Vous pouvez modifier votre soumission avant la date limite</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de correction */}
      <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Corriger le devoir</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.assignmentTitle} - {selectedSubmission?.studentName}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium mb-2">Informations de soumission</h4>
                <p className="text-sm text-gray-600">Soumis le: {new Date(selectedSubmission.submittedAt).toLocaleDateString('fr-FR')}</p>
                <p className="text-sm text-gray-600">Points maximum: {selectedSubmission.maxPoints}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">Note (sur {selectedSubmission.maxPoints})</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max={selectedSubmission.maxPoints}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Ex: 85"
                  />
                </div>
                <div>
                  <Label>Note actuelle</Label>
                  <p className="text-lg font-semibold text-blue-600">
                    {selectedSubmission.grade ? `${selectedSubmission.grade}/${selectedSubmission.maxPoints}` : 'Non noté'}
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="feedback">Commentaire de correction</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Ajoutez vos commentaires sur le travail de l'étudiant..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsGradingOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleGradeSubmission} disabled={!grade}>
                  Enregistrer la note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}