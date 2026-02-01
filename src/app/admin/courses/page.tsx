'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Users, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  teacher: string;
  students: number;
  status: string;
  semester: string;
}

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await apiService.deleteCourse(courseId.toString());
      toast.success('Cours supprimé avec succès');
      loadCourses();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours</h1>
            <p className="text-gray-600 mt-2">Administrez tous les cours de la plateforme</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Cours
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>Créer un nouveau cours</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau cours à la plateforme
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du cours</Label>
                  <Input 
                    id="title"
                    placeholder="Ex: React Avancé" 
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description"
                    placeholder="Description du cours" 
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher">Enseignant assigné</Label>
                  <select 
                    id="teacher"
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Sélectionner un enseignant</option>
                    <option value="5">Jean Dupont (prof@campus.sn)</option>
                    <option value="1">Admin Campus (admin@campus.sn)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semestre</Label>
                    <select 
                      id="semester"
                      className="w-full p-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="S1">Semestre 1</option>
                      <option value="S2">Semestre 2</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits">Crédits ECTS</Label>
                    <Input 
                      id="credits"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="3"
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Nombre max d'étudiants</Label>
                  <Input 
                    id="maxStudents"
                    type="number"
                    min="1"
                    max="200"
                    defaultValue="30"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={async () => {
                    try {
                      const title = document.getElementById('title').value;
                      const description = document.getElementById('description').value;
                      const semester = document.getElementById('semester').value;
                      const credits = parseInt(document.getElementById('credits').value);
                      const maxStudents = parseInt(document.getElementById('maxStudents').value);
                      const teacherId = document.getElementById('teacher').value;
                      
                      if (!teacherId) {
                        toast.error('Veuillez sélectionner un enseignant');
                        return;
                      }
                      
                      const courseData = {
                        title,
                        description,
                        semester,
                        credits,
                        maxStudents,
                        teacherId: parseInt(teacherId)
                      };
                      
                      const response = await fetch('http://localhost:8080/api/courses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(courseData)
                      });
                      
                      if (response.ok) {
                        setIsCreateDialogOpen(false);
                        toast.success('Cours créé avec succès');
                        // Recharger la liste des cours
                        loadCourses();
                      } else {
                        toast.error('Erreur lors de la création');
                      }
                    } catch (error) {
                      toast.error('Erreur: ' + error.message);
                    }
                  }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Créer le cours
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cours</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Étudiants Inscrits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Chargement des cours...</div>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                  </div>
                  <Badge variant="default">Actif</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    0 étudiants
                  </div>
                  <p className="text-sm text-gray-600">Enseignant: {course.teacher?.firstName} {course.teacher?.lastName}</p>
                  <p className="text-sm text-gray-600">Semestre: {course.semester}</p>
                  <p className="text-sm text-gray-600">Crédits: {course.credits} ECTS</p>
                  <p className="text-sm text-gray-600">Max étudiants: {course.maxStudents}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      setCourseToDelete(course);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-red-600">Supprimer le cours</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le cours "{courseToDelete?.title}" ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  if (courseToDelete) {
                    await handleDeleteCourse(courseToDelete.id);
                    setIsDeleteDialogOpen(false);
                    setCourseToDelete(null);
                  }
                }}
              >
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Course Dialog */}
        {selectedCourse && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>Modifier le cours</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du cours {selectedCourse.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="editTitle">Titre du cours</Label>
                  <Input 
                    id="editTitle"
                    defaultValue={selectedCourse.title}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Input 
                    id="editDescription"
                    defaultValue={selectedCourse.description}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTeacher">Enseignant assigné</Label>
                  <select 
                    id="editTeacher"
                    defaultValue={selectedCourse.teacher?.id || ''}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Sélectionner un enseignant</option>
                    <option value="5">Jean Dupont (prof@campus.sn)</option>
                    <option value="1">Admin Campus (admin@campus.sn)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCredits">Crédits ECTS</Label>
                    <Input 
                      id="editCredits"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={selectedCourse.credits}
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editMaxStudents">Nombre max d'étudiants</Label>
                    <Input 
                      id="editMaxStudents"
                      type="number"
                      min="1"
                      max="200"
                      defaultValue={selectedCourse.maxStudents}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSemester">Semestre</Label>
                  <select 
                    id="editSemester"
                    defaultValue={selectedCourse.semester}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="S1">Semestre 1</option>
                    <option value="S2">Semestre 2</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={async () => {
                    try {
                      const title = document.getElementById('editTitle').value;
                      const description = document.getElementById('editDescription').value;
                      const semester = document.getElementById('editSemester').value;
                      const credits = parseInt(document.getElementById('editCredits').value) || 0;
                      const maxStudents = parseInt(document.getElementById('editMaxStudents').value) || 0;
                      const teacherId = document.getElementById('editTeacher').value;
                      
                      console.log('Valeurs récupérées du formulaire:');
                      console.log('- title:', title);
                      console.log('- description:', description);
                      console.log('- semester:', semester);
                      console.log('- credits:', credits);
                      console.log('- maxStudents:', maxStudents);
                      console.log('- teacherId:', teacherId);
                      
                      const updateData = {
                        title,
                        description,
                        semester,
                        credits,
                        maxStudents,
                        teacherId: teacherId ? parseInt(teacherId) : null
                      };
                      
                      console.log('Données à envoyer:', updateData);
                      
                      console.log('=== DÉBUT MODIFICATION ADMIN ===');
                      console.log('ID du cours sélectionné:', selectedCourse.id);
                      console.log('Type de l\'ID:', typeof selectedCourse.id);
                      console.log('URL complète:', `http://localhost:8080/api/courses/${selectedCourse.id}`);
                      
                      const response = await fetch(`http://localhost:8080/api/courses/${selectedCourse.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updateData)
                      });
                      
                      console.log('Statut de la réponse:', response.status);
                      console.log('Réponse OK:', response.ok);
                      
                      if (response.ok) {
                        setIsEditDialogOpen(false);
                        setSelectedCourse(null);
                        toast.success('Cours modifié avec succès');
                        loadCourses();
                      } else {
                        toast.error('Erreur lors de la modification');
                      }
                    } catch (error) {
                      toast.error('Erreur: ' + error.message);
                    }
                  }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Enregistrer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}