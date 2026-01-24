'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Users, FileText, Plus, Edit, Eye } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

export function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', semester: '', credits: 3 });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', courseId: '', maxPoints: 20 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [coursesData, assignmentsData] = await Promise.all([
        apiService.getCourses(),
        apiService.getAssignments()
      ]);
      
      setCourses(coursesData || []);
      setAssignments(assignmentsData || []);
      setStudents([
        { id: 1, name: 'Marie Dupont', email: 'marie@test.com', courses: 2 },
        { id: 2, name: 'Pierre Martin', email: 'pierre@test.com', courses: 1 }
      ]);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    try {
      await apiService.createCourse(newCourse);
      toast.success('Cours créé avec succès');
      setNewCourse({ title: '', description: '', semester: '', credits: 3 });
      loadDashboardData();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await apiService.createAssignment(newAssignment);
      toast.success('Devoir créé avec succès');
      setNewAssignment({ title: '', description: '', dueDate: '', courseId: '', maxPoints: 20 });
      loadDashboardData();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devoirs Actifs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Corriger</CardTitle>
            <Edit className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-academic-600 hover:bg-academic-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Cours
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau cours</DialogTitle>
              <DialogDescription>Ajoutez un nouveau cours à votre programme</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Titre du cours"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              />
              <Input
                placeholder="Semestre (ex: S1 2024)"
                value={newCourse.semester}
                onChange={(e) => setNewCourse({...newCourse, semester: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Crédits"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
              />
              <Button onClick={handleCreateCourse} className="w-full">
                Créer le cours
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Devoir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau devoir</DialogTitle>
              <DialogDescription>Ajoutez un devoir pour vos étudiants</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Titre du devoir"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
              />
              <Textarea
                placeholder="Description et consignes"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
              />
              <Input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Points maximum"
                value={newAssignment.maxPoints}
                onChange={(e) => setNewAssignment({...newAssignment, maxPoints: parseInt(e.target.value)})}
              />
              <Button onClick={handleCreateAssignment} className="w-full">
                Créer le devoir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Mes Cours</CardTitle>
            <CardDescription>Gérez vos cours et contenus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.semester}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Devoirs Récents</CardTitle>
            <CardDescription>Suivez les soumissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.course}</p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">3/15 soumissions</span>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Corriger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}