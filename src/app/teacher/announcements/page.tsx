'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Megaphone, Calendar, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as z from 'zod';
import { apiService } from '@/services/api';
import { useAuthStore } from '@/store/auth';

const announcementSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères'),
  courseId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  expiresAt: z.string().optional(),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

export default function TeacherAnnouncementsPage() {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      courseId: 'general',
      priority: 'MEDIUM',
      expiresAt: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les cours
      const coursesData = await apiService.getCourses();
      setCourses(coursesData);
      
      // Charger les annonces
      const announcementsData = await apiService.getAnnouncementsByAuthor(user?.id || '1');
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Erreur:', error);
      setCourses([]);
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AnnouncementForm) => {
    try {
      const announcementData = {
        ...data,
        authorId: user?.id || 1
      };
      
      await apiService.createAnnouncement(announcementData);
      toast.success('Annonce publiée avec succès');
      setIsCreateOpen(false);
      form.reset();
      loadData(); // Recharger les données
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la publication');
    }
  };

  const editForm = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
  });

  const editAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    editForm.reset({
      title: announcement.title,
      content: announcement.content,
      courseId: announcement.course ? announcement.course.id.toString() : 'general',
      priority: announcement.priority || 'MEDIUM',
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : '',
    });
    setIsEditOpen(true);
  };

  const onEditSubmit = async (data: AnnouncementForm) => {
    try {
      await apiService.updateAnnouncement(selectedAnnouncement.id.toString(), {
        ...data,
        authorId: user?.id || 1
      });
      toast.success('Annonce modifiée avec succès');
      setIsEditOpen(false);
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteAnnouncement = async (id: number) => {
    try {
      await apiService.deleteAnnouncement(id.toString());
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('Annonce supprimée');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Urgent';
      case 'MEDIUM': return 'Normal';
      case 'LOW': return 'Info';
      default: return priority;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Publication d'annonces
          </h1>
          <p className="text-gray-600">
            Publiez des annonces pour vos étudiants
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publier une nouvelle annonce</DialogTitle>
              <DialogDescription>
                Créez une annonce pour informer vos étudiants
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'annonce *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Changement d'horaire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Détails de l'annonce..."
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
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cours concerné</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="general">Annonce générale</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id.toString()}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priorité</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="LOW">Info</option>
                            <option value="MEDIUM">Normal</option>
                            <option value="HIGH">Urgent</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'expiration (optionnel)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
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
                    Publier l'annonce
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des annonces */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Chargement des annonces...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {getPriorityLabel(announcement.priority)}
                      </Badge>
                      {announcement.course && (
                        <Badge variant="outline">
                          {announcement.course.title}
                        </Badge>
                      )}
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      <Megaphone className="h-5 w-5 text-blue-600" />
                      {announcement.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700">
                      {announcement.content}
                    </CardDescription>
                    {announcement.expiresAt && (
                      <div className="text-sm text-orange-600 mt-2">
                        Expire le {new Date(announcement.expiresAt).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => editAnnouncement(announcement)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog modification */}
      {selectedAnnouncement && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier l'annonce</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l'annonce
              </DialogDescription>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'annonce *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Changement d'horaire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Détails de l'annonce..."
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
                    control={editForm.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cours concerné</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="general">Annonce générale</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id.toString()}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priorité</FormLabel>
                        <FormControl>
                          <select 
                            {...field}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="LOW">Info</option>
                            <option value="MEDIUM">Normal</option>
                            <option value="HIGH">Urgent</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'expiration (optionnel)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}