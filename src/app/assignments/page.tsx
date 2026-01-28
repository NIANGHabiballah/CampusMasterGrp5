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

export default function AssignmentsPage() {
  const { user } = useAuthStore();
  
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [viewingAssignment, setViewingAssignment] = useState<any>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [submissionContent, setSubmissionContent] = useState('');
  
  // Mock data
  const assignments = [
    {
      id: '1',
      title: 'Projet React - Application Todo',
      description: 'Créer une application de gestion de tâches avec React et TypeScript',
      courseId: '1',
      dueDate: '2024-02-15T23:59:00',
      maxPoints: 100,
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
    if (!newAssignment.title || !newAssignment.description || !newAssignment.courseId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    toast.success('Devoir créé avec succès');
    setIsCreateDialogOpen(false);
    setNewAssignment({
      title: '',
      description: '',
      courseId: '',
      dueDate: '',
      maxPoints: 20
    });
  };

  const handleSubmitAssignment = async () => {
    if (uploadFiles.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier');
      return;
    }

    toast.success('Devoir soumis avec succès');
    setIsSubmitDialogOpen(false);
    setUploadFiles([]);
    setSubmissionContent('');
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
    
    if (now > dueDate) {
      return <Badge variant="outline" className="border-black text-black"><AlertCircle className="w-3 h-3 mr-1 text-black" />En retard</Badge>;
    }
    
    return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />À faire</Badge>;
  };

  const filteredAssignments = selectedCourse === 'all' 
    ? assignments 
    : assignments.filter(a => a.courseId === selectedCourse);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Devoirs</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'STUDENT' ? 'Consultez et soumettez vos devoirs' : 'Gérez les devoirs de vos cours'}
          </p>
        </div>
        
        {user?.role === 'TEACHER' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau devoir
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
                  <Select value={newAssignment.courseId} onValueChange={(value) => setNewAssignment({...newAssignment, courseId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">React Avancé</SelectItem>
                      <SelectItem value="2">Node.js Backend</SelectItem>
                      <SelectItem value="3">Base de Données</SelectItem>
                    </SelectContent>
                  </Select>
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
      <div className="flex space-x-4 mb-16">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-48">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((assignment) => {
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = new Date() > dueDate;
          
          return (
            <Card key={assignment.id} className={`hover:shadow-lg transition-shadow ${
              isOverdue ? 'border-red-200 bg-red-50' : ''
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Cours: React Avancé • {assignment.maxPoints} points
                    </CardDescription>
                  </div>
                  {getStatusBadge(assignment)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {assignment.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Échéance: {dueDate.toLocaleDateString('fr-FR')}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(assignment)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                  
                  {user?.role === 'STUDENT' && (
                    <Dialog open={isSubmitDialogOpen && selectedAssignment === assignment.id} 
                           onOpenChange={(open) => {
                             setIsSubmitDialogOpen(open);
                             if (open) setSelectedAssignment(assignment.id);
                           }}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1">
                          <Upload className="w-4 h-4 mr-2" />
                          Soumettre
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
                                className="w-full h-20 cursor-pointer"
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
                <p className="text-gray-600">Cours: React Avancé • {viewingAssignment.maxPoints} points</p>
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
              <div>
                <h4 className="font-medium mb-2">Instructions</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Respectez la date limite de soumission</li>
                  <li>Formats acceptés: PDF, DOC, DOCX, ZIP, RAR</li>
                  <li>Taille maximale par fichier: 50MB</li>
                  <li>Nommez vos fichiers clairement</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}