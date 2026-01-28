'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Users, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'React Avancé',
      description: 'Développement d\'applications React complexes',
      teacher: 'Prof. Dubois',
      students: 25,
      status: 'active',
      semester: 'S1 2024'
    },
    {
      id: 2,
      title: 'Node.js Backend',
      description: 'Développement d\'APIs avec Node.js',
      teacher: 'Prof. Martin',
      students: 22,
      status: 'active',
      semester: 'S1 2024'
    }
  ]);

  const handleDeleteCourse = (courseId: number) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    toast.success('Cours supprimé avec succès');
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
                  <Input 
                    id="teacher"
                    placeholder="Nom de l'enseignant" 
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => {
                    setIsCreateDialogOpen(false);
                    toast.success('Cours créé avec succès');
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                  </div>
                  <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                    {course.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {course.students} étudiants
                  </div>
                  <p className="text-sm text-gray-600">Enseignant: {course.teacher}</p>
                  <p className="text-sm text-gray-600">Semestre: {course.semester}</p>
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
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                  <Input 
                    id="editTeacher"
                    defaultValue={selectedCourse.teacher}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSemester">Semestre</Label>
                  <Input 
                    id="editSemester"
                    defaultValue={selectedCourse.semester}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCourse(null);
                    toast.success('Cours modifié avec succès');
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