'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Tag, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Archive,
  Trash2
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId?: string;
  receiverName?: string;
  courseId?: string;
  courseName?: string;
  subject: string;
  content: string;
  tags: string[];
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  createdAt: string;
  attachments?: any[];
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Prof. Jean Martin',
    senderRole: 'TEACHER',
    receiverId: '3',
    receiverName: 'Marie Dupont',
    subject: 'Feedback sur votre projet React',
    content: 'Bonjour Marie, j\'ai corrigé votre projet React. Excellent travail ! Quelques points d\'amélioration : la gestion des erreurs pourrait être renforcée et l\'interface utilisateur est très intuitive. Continuez ainsi !',
    tags: ['feedback', 'projet'],
    isRead: false,
    isStarred: true,
    isArchived: false,
    createdAt: '2024-01-24T10:30:00Z'
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'Admin Système',
    senderRole: 'ADMIN',
    courseId: '1',
    courseName: 'React Avancé',
    subject: 'Nouvelle fonctionnalité disponible',
    content: 'Une nouvelle fonctionnalité de collaboration en temps réel a été ajoutée à la plateforme. Vous pouvez maintenant travailler simultanément sur vos projets.',
    tags: ['annonce', 'nouveau'],
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: '2024-01-23T14:15:00Z'
  },
  {
    id: '3',
    senderId: '3',
    senderName: 'Marie Dupont',
    senderRole: 'STUDENT',
    receiverId: '2',
    receiverName: 'Prof. Jean Martin',
    subject: 'Question sur l\'architecture des composants',
    content: 'Bonjour Professeur, j\'ai une question concernant l\'architecture des composants React. Comment organiser efficacement les composants dans une application complexe ?',
    tags: ['question', 'urgent'],
    isRead: true,
    isStarred: false,
    isArchived: false,
    createdAt: '2024-01-22T16:45:00Z'
  }
];

const availableTags = [
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
  { value: 'annonce', label: 'Annonce', color: 'bg-blue-100 text-blue-800' },
  { value: 'projet', label: 'Projet', color: 'bg-green-100 text-green-800' },
  { value: 'question', label: 'Question', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'feedback', label: 'Feedback', color: 'bg-purple-100 text-purple-800' },
  { value: 'nouveau', label: 'Nouveau', color: 'bg-indigo-100 text-indigo-800' }
];

import { apiService } from '@/services/api';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Chargement des données...');
        
        const [usersData, coursesData] = await Promise.all([
          apiService.getUsers(),
          apiService.getCourses()
        ]);
        
        console.log('Utilisateurs chargés:', usersData);
        console.log('Cours chargés:', coursesData);
        
        setUsers(usersData || []);
        setCourses(coursesData || []);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        // En cas d'erreur, utiliser des données de fallback
        setUsers([
          { id: 4, firstName: 'Admin', lastName: 'Campus', role: 'ADMIN' },
          { id: 5, firstName: 'Jean', lastName: 'Dupont', role: 'TEACHER' },
          { id: 6, firstName: 'Marie', lastName: 'Martin', role: 'STUDENT' }
        ]);
        setCourses([
          { id: 1, title: 'React Avancé' },
          { id: 2, title: 'Node.js Backend' },
          { id: 3, title: 'Base de Données' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Compose message form
  const [newMessage, setNewMessage] = useState({
    receiverId: '',
    courseId: '',
    subject: '',
    content: '',
    tags: [] as string[]
  });

  const handleSendMessage = () => {
    if (!newMessage.subject || !newMessage.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || '',
      senderName: `${user?.firstName} ${user?.lastName}`,
      senderRole: user?.role || 'STUDENT',
      receiverId: newMessage.receiverId || undefined,
      receiverName: newMessage.receiverId ? 'Destinataire' : undefined,
      courseId: newMessage.courseId || undefined,
      courseName: newMessage.courseId ? 'Cours sélectionné' : undefined,
      subject: newMessage.subject,
      content: newMessage.content,
      tags: newMessage.tags,
      isRead: false,
      isStarred: false,
      isArchived: false,
      createdAt: new Date().toISOString()
    };

    setMessages([message, ...messages]);
    setNewMessage({ receiverId: '', courseId: '', subject: '', content: '', tags: [] });
    setIsComposeOpen(false);
    toast.success('Message envoyé avec succès');
  };

  const handleTagToggle = (tag: string) => {
    setNewMessage(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const toggleMessageStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const archiveMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: true } : msg
    ));
    toast.success('Message archivé');
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.senderName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => msg.tags.includes(tag));
    
    const matchesTab = (() => {
      switch (activeTab) {
        case 'inbox': return !msg.isArchived && (msg.receiverId === user?.id || msg.courseId);
        case 'sent': return msg.senderId === user?.id;
        case 'starred': return msg.isStarred;
        case 'archived': return msg.isArchived;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesTags && matchesTab;
  });

  const getTagStyle = (tag: string) => {
    const tagConfig = availableTags.find(t => t.value === tag);
    return tagConfig?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Communiquez avec vos enseignants et étudiants</p>
        </div>
        
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Composer un message</DialogTitle>
              <DialogDescription>
                Envoyez un message à un utilisateur ou à un groupe de cours
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipient">Destinataire</Label>
                  <Select value={newMessage.receiverId} onValueChange={(value) => setNewMessage({...newMessage, receiverId: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un destinataire"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Chargement des utilisateurs...</SelectItem>
                      ) : users.length === 0 ? (
                        <SelectItem value="empty" disabled>Aucun utilisateur trouvé</SelectItem>
                      ) : (
                        users.filter(u => u.id !== user?.id).map(u => (
                          <SelectItem key={u.id} value={u.id.toString()}>
                            {u.firstName} {u.lastName} ({u.role})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="course">Groupe de cours (optionnel)</Label>
                  <Select value={newMessage.courseId} onValueChange={(value) => setNewMessage({...newMessage, courseId: value})}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un cours"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Chargement des cours...</SelectItem>
                      ) : courses.length === 0 ? (
                        <SelectItem value="empty" disabled>Aucun cours trouvé</SelectItem>
                      ) : (
                        courses.map(course => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Sujet du message"
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  placeholder="Tapez votre message ici..."
                  rows={6}
                  className="bg-white border-gray-300"
                />
              </div>
              
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableTags.map(tag => (
                    <div key={tag.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag.value}
                        checked={newMessage.tags.includes(tag.value)}
                        onCheckedChange={() => handleTagToggle(tag.value)}
                      />
                      <Label htmlFor={tag.value} className={`px-2 py-1 rounded-full text-xs ${tag.color}`}>
                        {tag.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Boîte de réception</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="inbox">Reçus</TabsTrigger>
                  <TabsTrigger value="sent">Envoyés</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-2 mt-2">
                  <TabsTrigger value="starred">Favoris</TabsTrigger>
                  <TabsTrigger value="archived">Archivés</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Tag Filters */}
              <div className="mt-4">
                <Label className="text-sm font-medium">Filtrer par tags</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag.value}
                      variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        setSelectedTags(prev => 
                          prev.includes(tag.value)
                            ? prev.filter(t => t !== tag.value)
                            : [...prev, tag.value]
                        );
                      }}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                  <p className="text-gray-600">Aucun message ne correspond à vos critères de recherche.</p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map(message => (
                <Card 
                  key={message.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    !message.isRead ? 'border-blue-200 bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) markAsRead(message.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${!message.isRead ? 'font-bold' : ''}`}>
                            {message.subject}
                          </h4>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {activeTab === 'sent' ? `À: ${message.receiverName || message.courseName}` : `De: ${message.senderName}`}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMessageStar(message.id);
                          }}
                        >
                          <Star className={`w-4 h-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveMessage(message.id);
                          }}
                        >
                          <Archive className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                      {message.content}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {message.tags.map(tag => (
                          <Badge key={tag} className={`text-xs ${getTagStyle(tag)}`}>
                            {availableTags.find(t => t.value === tag)?.label || tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {format(new Date(message.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription>
                De: {selectedMessage.senderName} • {format(new Date(selectedMessage.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {selectedMessage.tags.map(tag => (
                  <Badge key={tag} className={`text-xs ${getTagStyle(tag)}`}>
                    {availableTags.find(t => t.value === tag)?.label || tag}
                  </Badge>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setNewMessage({
                    receiverId: selectedMessage.senderId,
                    courseId: '',
                    subject: `Re: ${selectedMessage.subject}`,
                    content: '',
                    tags: []
                  });
                  setSelectedMessage(null);
                  setIsComposeOpen(true);
                }}>
                  Répondre
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}