'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Header } from '@/components/layout/Header';
import { 
  MessageSquare, Send, Search, Plus, Users, Tag, 
  Clock, CheckCircle, AlertCircle, BookOpen, Star 
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { ROUTES } from '@/lib/constants';
import { Message } from '@/types';

export default function MessagesPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageRecipient, setNewMessageRecipient] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Mock messages data
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        senderName: 'Prof. Martin Dubois',
        receiverId: user?.id || '1',
        subject: 'Retour sur votre projet microservices',
        content: 'Bonjour, j\'ai examiné votre projet d\'architecture microservices. Le travail est globalement excellent, mais j\'aimerais discuter de quelques points d\'amélioration concernant la gestion des erreurs et la résilience du système. Pourriez-vous passer me voir lors de mes permanences cette semaine ?',
        tags: ['projet', 'feedback'],
        isRead: false,
        createdAt: '2024-01-20T14:30:00'
      },
      {
        id: '2',
        senderId: '3',
        senderName: 'Dr. Sarah Leroy',
        receiverId: user?.id || '1',
        subject: 'Nouvelle ressource IA disponible',
        content: 'Une nouvelle base de données d\'articles de recherche en IA est maintenant accessible via la bibliothèque universitaire. Je pense que cela pourrait vous intéresser pour vos recherches.',
        tags: ['ressource', 'ia'],
        isRead: true,
        createdAt: '2024-01-19T10:15:00'
      },
      {
        id: '3',
        senderId: '4',
        senderName: 'Mme. Claire Petit',
        receiverId: user?.id || '1',
        courseId: '4',
        subject: 'Changement de date pour la présentation',
        content: 'La présentation sur les méthodologies agiles initialement prévue le 28 février est reportée au 5 mars. Merci de noter ce changement dans vos agendas.',
        tags: ['annonce', 'urgent'],
        isRead: false,
        createdAt: '2024-01-18T16:45:00'
      },
      {
        id: '4',
        senderId: user?.id || '1',
        senderName: `${user?.firstName} ${user?.lastName}`,
        receiverId: '2',
        subject: 'Question sur l\'architecture distribuée',
        content: 'Bonjour Professeur, j\'ai une question concernant le pattern Saga pour la gestion des transactions distribuées. Pourriez-vous m\'expliquer les différences entre les approches orchestration et chorégraphie ?',
        tags: ['question', 'cours'],
        isRead: true,
        createdAt: '2024-01-17T09:20:00'
      },
      {
        id: '5',
        senderId: '5',
        senderName: 'Dr. Pierre Blanc',
        receiverId: user?.id || '1',
        courseId: '5',
        subject: 'Dataset pour le projet Data Science',
        content: 'Le nouveau dataset pour votre projet de machine learning est maintenant disponible. Vous le trouverez dans l\'espace cours avec les instructions détaillées.',
        tags: ['projet', 'dataset'],
        isRead: true,
        createdAt: '2024-01-16T11:30:00'
      }
    ];

    setMessages(mockMessages);
  }, [isAuthenticated, router, user]);

  const availableTags = [
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
    { value: 'projet', label: 'Projet', color: 'bg-blue-100 text-blue-800' },
    { value: 'cours', label: 'Cours', color: 'bg-green-100 text-green-800' },
    { value: 'annonce', label: 'Annonce', color: 'bg-purple-100 text-purple-800' },
    { value: 'question', label: 'Question', color: 'bg-orange-100 text-orange-800' },
    { value: 'feedback', label: 'Feedback', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'ressource', label: 'Ressource', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const teachers = [
    { id: '2', name: 'Prof. Martin Dubois', subject: 'Architecture Systèmes' },
    { id: '3', name: 'Dr. Sarah Leroy', subject: 'Intelligence Artificielle' },
    { id: '4', name: 'Mme. Claire Petit', subject: 'Gestion de Projet' },
    { id: '5', name: 'Dr. Pierre Blanc', subject: 'Data Science' }
  ];

  const filteredMessages = messages.filter(message => 
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead && m.receiverId === user?.id).length;

  const getTagStyle = (tag: string) => {
    const tagConfig = availableTags.find(t => t.value === tag);
    return tagConfig ? tagConfig.color : 'bg-gray-100 text-gray-800';
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !newMessageSubject.trim() || !newMessageRecipient) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      senderName: `${user?.firstName} ${user?.lastName}`,
      receiverId: newMessageRecipient,
      subject: newMessageSubject,
      content: newMessage,
      tags: selectedTags,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setMessages([message, ...messages]);
    setNewMessage('');
    setNewMessageSubject('');
    setNewMessageRecipient('');
    setSelectedTags([]);
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, isRead: true } : m
    ));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Messagerie
            </h1>
            <p className="text-gray-600">
              Communiquez avec vos enseignants et camarades
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-academic-600 hover:bg-academic-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouveau message</DialogTitle>
                <DialogDescription>
                  Envoyer un message à un enseignant ou camarade
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Destinataire
                  </label>
                  <Select value={newMessageRecipient} onValueChange={setNewMessageRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un destinataire" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sujet
                  </label>
                  <Input
                    placeholder="Sujet du message"
                    value={newMessageSubject}
                    onChange={(e) => setNewMessageSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag.value}
                        className={`cursor-pointer ${
                          selectedTags.includes(tag.value) 
                            ? tag.color 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          if (selectedTags.includes(tag.value)) {
                            setSelectedTags(selectedTags.filter(t => t !== tag.value));
                          } else {
                            setSelectedTags([...selectedTags, tag.value]);
                          }
                        }}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Annuler</Button>
                  </DialogTrigger>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-academic-600 hover:bg-academic-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Messages non lus</p>
                  <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total messages</p>
                  <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Conversations</p>
                  <p className="text-2xl font-bold text-green-600">
                    {new Set(messages.map(m => m.senderId === user?.id ? m.receiverId : m.senderId)).size}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Messages urgents</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {messages.filter(m => m.tags.includes('urgent')).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                !message.isRead && message.receiverId === user?.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => {
                if (!message.isRead && message.receiverId === user?.id) {
                  markAsRead(message.id);
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {message.senderName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {message.senderName}
                        </h3>
                        {!message.isRead && message.receiverId === user?.id && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{message.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {message.tags.map((tag) => (
                          <Badge key={tag} className={`text-xs ${getTagStyle(tag)}`}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {message.courseId && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Cours
                          </Badge>
                        )}
                        <Button size="sm" variant="ghost">
                          Répondre
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun message trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier votre recherche ou commencez une nouvelle conversation.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}