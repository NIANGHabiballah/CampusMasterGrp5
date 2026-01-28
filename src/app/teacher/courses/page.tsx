'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Plus, Edit, Users, FileText, Upload, Eye, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as z from 'zod';

const courseSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  semester: z.string(),
  credits: z.number().min(1).max(10),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([
    {
      id: '1',
      title: 'Architecture des Systèmes Distribués',
      description: 'Conception et développement d\'applications distribuées modernes',
      semester: 'S1',
      credits: 6,
      students: 45,
      materials: 12,
      assignments: 3
    },
    {
      id: '2',
      title: 'Sécurité Informatique',
      description: 'Cryptographie, sécurité des réseaux et audit de sécurité',
      semester: 'S1',
      credits: 4,
      students: 38,
      materials: 8,
      assignments: 2
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleViewCourse = (course) => {
    router.push(`/teacher/courses/${course.id}`);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsEditOpen(true);
  };

  const handleExportCourse = (course) => {
    toast.success(`Export du cours "${course.title}" en cours...`);
    // Simuler l'export
    setTimeout(() => {
      toast.success('Cours exporté avec succès');
    }, 1500);
  };

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      semester: 'S1',
      credits: 3,
    },
  });

  const onSubmit = (data: CourseForm) => {
    const newCourse = {
      id: Date.now().toString(),
      ...data,
      students: 0,
      materials: 0,
      assignments: 0
    };
    setCourses([...courses, newCourse]);
    setIsCreateOpen(false);
    form.reset();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des cours
            </h1>
            <p className="text-gray-600">
              Créez et gérez vos cours, supports et devoirs
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau cours
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau cours</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du cours
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre du cours</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Architecture des Systèmes Distribués" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description détaillée du cours..."
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semestre</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="S1">Semestre 1</SelectItem>
                              <SelectItem value="S2">Semestre 2</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crédits ECTS</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Créer le cours
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                      {course.semester} • {course.credits} ECTS
                    </Badge>
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{course.students}</div>
                    <div className="text-xs text-gray-600">Étudiants</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{course.materials}</div>
                    <div className="text-xs text-gray-600">Supports</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{course.assignments}</div>
                    <div className="text-xs text-gray-600">Devoirs</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewCourse(course)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExportCourse(course)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Course Dialog */}
        {selectedCourse && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>Modifier le cours</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du cours {selectedCourse.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre du cours</label>
                  <Input defaultValue={selectedCourse.title} className="bg-white border-gray-300" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea defaultValue={selectedCourse.description} className="bg-white border-gray-300" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => {
                    setIsEditOpen(false);
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
    </div>
  );
}