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
import { Plus, Edit, Users, FileText, Upload, Eye, Download, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as z from 'zod';

const courseSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  semester: z.string().min(1, 'Le semestre est obligatoire'),
  credits: z.number().min(1, 'Les crédits doivent être au moins 1').max(10, 'Maximum 10 crédits'),
  teacherId: z.number().optional(),
  maxStudents: z.number().min(1, 'Le nombre d\'étudiants doit être au moins 1').max(200, 'Maximum 200 étudiants'),
  professorId: z.number().optional(),
  dayOfWeek: z.string().min(1, 'Le jour est obligatoire'),
  startTime: z.string().min(1, 'L\'heure de début est obligatoire'),
  endTime: z.string().min(1, 'L\'heure de fin est obligatoire'),
  materials: z.array(z.any()).optional(),
});

type CourseForm = z.infer<typeof courseSchema>;

import { apiService } from '@/services/api';
import { useEffect } from 'react';

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [coursesData, usersData] = await Promise.all([
          apiService.getCourses(),
          apiService.getUsers()
        ]);
        setCourses(coursesData);
        setTeachers(usersData.filter(user => user.role === 'TEACHER'));
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);

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
      teacherId: 5,
      maxStudents: 30,
      professorId: 0,
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      materials: [],
    },
  });

  const onSubmit = async (data: CourseForm) => {
    try {
      console.log('Création cours:', data);
      
      // Validation des heures
      if (data.startTime >= data.endTime) {
        toast.error('L\'heure de fin doit être après l\'heure de début');
        return;
      }
      
      const courseData = {
        title: data.title,
        description: data.description,
        semester: data.semester,
        credits: data.credits,
        maxStudents: data.maxStudents,
        schedule: `${data.dayOfWeek} ${data.startTime}-${data.endTime}`
      };
      
      if (data.professorId && data.professorId > 0) {
        courseData.teacher = { id: data.professorId };
      }
      
      const result = await apiService.createCourse(courseData);
      console.log('Résultat création:', result);
      
      // Upload des fichiers si présents
      if (data.materials && data.materials.length > 0) {
        try {
          const courseId = result.id || 1;
          await apiService.uploadMaterials(courseId.toString(), data.materials);
          toast.success('Cours créé avec supports pédagogiques');
        } catch (uploadError) {
          console.warn('Erreur upload fichiers:', uploadError);
          toast.success('Cours créé mais erreur lors de l\'upload des fichiers');
        }
      } else {
        toast.success('Cours créé avec succès');
      }
      
      const updatedCourses = await apiService.getCourses();
      setCourses(updatedCourses);
      setIsCreateOpen(false);
      form.reset();
      
    } catch (error) {
      console.error('Erreur création:', error);
      
      // Gestion spécifique des erreurs
      if (error.message.includes('500')) {
        toast.error('Erreur serveur: Vérifiez que tous les champs obligatoires sont remplis');
      } else if (error.message.includes('400')) {
        toast.error('Données invalides: Vérifiez les informations saisies');
      } else if (error.message.includes('Network')) {
        toast.error('Erreur de connexion: Vérifiez que le serveur est démarré');
      } else {
        toast.error('Erreur lors de la création: ' + (error.message || 'Erreur inconnue'));
      }
    }
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLoading(true);
                apiService.getCourses().then(setCourses).finally(() => setIsLoading(false));
              }}
            >
              Actualiser
            </Button>
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
                        <FormLabel className="flex items-center gap-1">
                          Titre du cours
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Architecture des Systèmes Distribués" 
                            {...field}
                            className={form.formState.errors.title ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Description
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description détaillée du cours..."
                            rows={4}
                            {...field}
                            className={form.formState.errors.description ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="professorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professeur</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="0">Sélectionner un professeur</option>
                            {teachers.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.firstName} {teacher.lastName}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dayOfWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Jour
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <select 
                              {...field}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                form.formState.errors.dayOfWeek ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Sélectionner un jour</option>
                              <option value="Lundi">Lundi</option>
                              <option value="Mardi">Mardi</option>
                              <option value="Mercredi">Mercredi</option>
                              <option value="Jeudi">Jeudi</option>
                              <option value="Vendredi">Vendredi</option>
                            </select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Début
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field}
                              className={form.formState.errors.startTime ? 'border-red-500' : ''}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Fin
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              {...field}
                              className={form.formState.errors.endTime ? 'border-red-500' : ''}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semestre</FormLabel>
                          <FormControl>
                            <select 
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="S1">Semestre 1</option>
                              <option value="S2">Semestre 2</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Crédits ECTS
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className={form.formState.errors.credits ? 'border-red-500' : ''}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxStudents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Nombre max d'étudiants
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="200"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              className={form.formState.errors.maxStudents ? 'border-red-500' : ''}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="materials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supports pédagogiques</FormLabel>
                        <FormControl>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                            onChange={(e) => field.onChange(Array.from(e.target.files || []))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
      </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Chargement des cours...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Aucun cours trouvé</div>
          </div>
        ) : (
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
                    {course.teacher && (
                      <div className="text-sm text-blue-600 font-medium mt-1">
                        Prof. {course.teacher.firstName} {course.teacher.lastName}
                      </div>
                    )}
                    {course.schedule && (
                      <div className="text-xs text-gray-500 mt-1">
                        {course.schedule}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{course.maxStudents || 0}</div>
                    <div className="text-xs text-gray-600">Max Étudiants</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{course.materials?.length || 0}</div>
                    <div className="text-xs text-gray-600">Supports</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{course.assignments?.length || 0}</div>
                    <div className="text-xs text-gray-600">Devoirs</div>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewCourse(course)}>
                    <Eye className="h-4 w-4 mr-1" />Voir
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleExportCourse(course)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={async () => {
                      toast(`Supprimer "${course.title}" ?`, {
                        action: {
                          label: 'Confirmer',
                          onClick: async () => {
                            try {
                              await apiService.deleteCourse(course.id);
                              const updated = await apiService.getCourses();
                              setCourses(updated);
                              toast.success('Cours supprimé');
                            } catch (error) {
                              toast.error('Backend non démarré - Impossible de supprimer');
                            }
                          }
                        },
                        cancel: {
                          label: 'Annuler',
                          onClick: () => {}
                        }
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

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
                  <label className="text-sm font-medium flex items-center gap-1">
                    Titre du cours
                    <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="editTitle"
                    defaultValue={selectedCourse.title} 
                    className="bg-white border-gray-300" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    Description
                    <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    id="editDescription"
                    defaultValue={selectedCourse.description} 
                    className="bg-white border-gray-300" 
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Professeur</label>
                  <select 
                    id="editProfessorId"
                    defaultValue={selectedCourse.professorId || ''}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un professeur</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      Jour
                      <span className="text-red-500">*</span>
                    </label>
                    <select 
                      id="editDayOfWeek"
                      defaultValue={selectedCourse.schedule?.split(' ')[0] || ''}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionner un jour</option>
                      <option value="Lundi">Lundi</option>
                      <option value="Mardi">Mardi</option>
                      <option value="Mercredi">Mercredi</option>
                      <option value="Jeudi">Jeudi</option>
                      <option value="Vendredi">Vendredi</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      Début
                      <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="editStartTime"
                      type="time"
                      defaultValue={selectedCourse.schedule?.split(' ')[1]?.split('-')[0] || ''}
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      Fin
                      <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="editEndTime"
                      type="time"
                      defaultValue={selectedCourse.schedule?.split(' ')[1]?.split('-')[1] || ''}
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Semestre</label>
                    <select 
                      id="editSemester"
                      defaultValue={selectedCourse.semester}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="S1">Semestre 1</option>
                      <option value="S2">Semestre 2</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      Crédits ECTS
                      <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      id="editCredits"
                      type="number" 
                      min="1" 
                      max="10"
                      defaultValue={selectedCourse.credits}
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    Nombre max d'étudiants
                    <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    id="editMaxStudents"
                    type="number" 
                    min="1" 
                    max="200"
                    defaultValue={selectedCourse.maxStudents}
                    className="bg-white border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supports pédagogiques</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                    onChange={(e) => {
                      window.editMaterials = Array.from(e.target.files || []);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={async () => {
                    try {
                      const editTitle = document.getElementById('editTitle').value;
                      const editDescription = document.getElementById('editDescription').value;
                      const editProfessorId = parseInt(document.getElementById('editProfessorId').value);
                      const editDayOfWeek = document.getElementById('editDayOfWeek').value;
                      const editStartTime = document.getElementById('editStartTime').value;
                      const editEndTime = document.getElementById('editEndTime').value;
                      const editSemester = document.getElementById('editSemester').value;
                      const editCredits = parseInt(document.getElementById('editCredits').value);
                      const editMaxStudents = parseInt(document.getElementById('editMaxStudents').value);
                      
                      // Validation des champs obligatoires
                      if (!editTitle || editTitle.trim().length < 3) {
                        toast.error('Le titre doit contenir au moins 3 caractères');
                        return;
                      }
                      
                      if (!editDescription || editDescription.trim().length < 10) {
                        toast.error('La description doit contenir au moins 10 caractères');
                        return;
                      }
                      
                      if (!editDayOfWeek) {
                        toast.error('Veuillez sélectionner un jour');
                        return;
                      }
                      
                      if (!editStartTime || !editEndTime) {
                        toast.error('Veuillez renseigner les heures de début et de fin');
                        return;
                      }
                      
                      if (editStartTime >= editEndTime) {
                        toast.error('L\'heure de fin doit être après l\'heure de début');
                        return;
                      }
                      
                      if (isNaN(editCredits) || editCredits < 1 || editCredits > 10) {
                        toast.error('Les crédits doivent être entre 1 et 10');
                        return;
                      }
                      
                      if (isNaN(editMaxStudents) || editMaxStudents < 1 || editMaxStudents > 200) {
                        toast.error('Le nombre d\'étudiants doit être entre 1 et 200');
                        return;
                      }
                      
                      const updateData = {
                        title: editTitle.trim(),
                        description: editDescription.trim(),
                        code: selectedCourse.code,
                        schedule: `${editDayOfWeek} ${editStartTime}-${editEndTime}`,
                        semester: editSemester,
                        credits: editCredits,
                        maxStudents: editMaxStudents
                      };
                      
                      if (editProfessorId && editProfessorId > 0) {
                        updateData.teacher = { id: editProfessorId };
                      }
                      
                      console.log('Données de mise à jour:', updateData);
                      
                      await apiService.updateCourse(selectedCourse.id.toString(), updateData);
                      
                      // Upload des nouveaux fichiers si présents
                      if (window.editMaterials && window.editMaterials.length > 0) {
                        try {
                          await apiService.uploadMaterials(selectedCourse.id.toString(), window.editMaterials);
                          toast.success('Cours modifié avec nouveaux supports');
                        } catch (uploadError) {
                          console.warn('Erreur upload:', uploadError);
                          toast.success('Cours modifié mais erreur lors de l\'upload des fichiers');
                        }
                      } else {
                        toast.success('Cours modifié avec succès');
                      }
                      
                      const updatedCourses = await apiService.getCourses();
                      setCourses(updatedCourses);
                      setIsEditOpen(false);
                      setSelectedCourse(null);
                      
                    } catch (error) {
                      console.error('Erreur modification:', error);
                      
                      // Gestion spécifique des erreurs
                      if (error.message.includes('500')) {
                        toast.error('Erreur serveur: Problème lors de la sauvegarde');
                      } else if (error.message.includes('400')) {
                        toast.error('Données invalides: Vérifiez les informations saisies');
                      } else if (error.message.includes('Network')) {
                        toast.error('Erreur de connexion: Vérifiez que le serveur est démarré');
                      } else {
                        toast.error('Erreur lors de la modification: ' + (error.message || 'Erreur inconnue'));
                      }
                    }
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