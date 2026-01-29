'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Plus, Edit, Trash2, Eye, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Announcement {
  id: string;
  title: string;
  content: string;
  courseId: string;
  courseName: string;
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
  createdAt: string;
  views: number;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Changement de salle pour le cours du 25 janvier',
    content: 'Le cours de React Avancé du 25 janvier aura lieu en salle B204 au lieu de A101. Merci de noter ce changement.',
    courseId: '1',
    courseName: 'React Avancé',
    priority: 'high',
    isPublished: true,
    createdAt: '2024-01-20T10:00:00Z',
    views: 45
  },
  {
    id: '2',
    title: 'Nouveau projet disponible',
    content: 'Un nouveau projet sur l\'architecture microservices est maintenant disponible. Date limite : 15 février.',
    courseId: '2',
    courseName: 'Architecture Logicielle',
    priority: 'medium',
    isPublished: true,
    createdAt: '2024-01-18T14:30:00Z',
    views: 32
  }
];

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    courseId: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const courses = [
    { id: '1', name: 'React Avancé' },
    { id: '2', name: 'Architecture Logicielle' },
    { id: '3', name: 'Base de Données' }
  ];

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.courseId) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      courseId: newAnnouncement.courseId,
      courseName: courses.find(c => c.id === newAnnouncement.courseId)?.name || '',
      priority: newAnnouncement.priority,
      isPublished: true,
      createdAt: new Date().toISOString(),
      views: 0
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement({ title: '', content: '', courseId: '', priority: 'medium' });
    setIsCreateOpen(false);
    toast.success('Annonce créée avec succès');
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success('Annonce supprimée');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Urgent';
      case 'medium': return 'Normal';
      case 'low': return 'Info';
      default: return priority;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Annonces</h1>
          <p className="text-gray-600 mt-1">Gérez vos annonces de cours</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Créer une annonce</DialogTitle>
              <DialogDescription>
                Publiez une annonce importante pour vos étudiants
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <div>
                <Label htmlFor="course">Cours</Label>
                <Select value={newAnnouncement.courseId} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, courseId: value})}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Sélectionner un cours" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[200]">
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select value={newAnnouncement.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewAnnouncement({...newAnnouncement, priority: value})}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[200]">
                    <SelectItem value="low">Info</SelectItem>
                    <SelectItem value="medium">Normal</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  placeholder="Titre de l'annonce"
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  placeholder="Contenu de l'annonce..."
                  rows={6}
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateAnnouncement} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Publier l'annonce
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce</h3>
              <p className="text-gray-600">Créez votre première annonce pour communiquer avec vos étudiants.</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map(announcement => (
            <Card key={announcement.id} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {getPriorityLabel(announcement.priority)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-4">
                      <span>{announcement.courseName}</span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(announcement.createdAt), 'dd MMM yyyy', { locale: fr })}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {announcement.views} vues
                      </span>
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}