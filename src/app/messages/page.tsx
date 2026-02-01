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
import { useNotificationStore } from '@/store/notifications';
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
  parentId?: string; // ID du message parent pour les réponses
  replies?: Message[]; // Messages enfants
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

import { apiService, createMessage, toggleMessageStar, toggleMessageArchive, markMessageAsRead } from '@/services/api';

// Fonction pour trouver le message parent basé sur le sujet
const findParentMessage = (messages: any[], originalSubject: string): string | undefined => {
  const parent = messages.find(msg => 
    msg.subject.toLowerCase() === originalSubject.toLowerCase()
  );
  return parent?.id?.toString();
};

// Fonction pour organiser les messages en threads
const organizeMessagesInThreads = (messages: Message[]): Message[] => {
  const messageMap = new Map<string, Message>();
  const rootMessages: Message[] = [];
  
  // Créer une map de tous les messages
  messages.forEach(msg => {
    messageMap.set(msg.id, { ...msg, replies: [] });
  });
  
  // Organiser en threads
  messages.forEach(msg => {
    const message = messageMap.get(msg.id)!;
    
    if (msg.parentId && messageMap.has(msg.parentId)) {
      // C'est une réponse, l'ajouter au parent
      const parent = messageMap.get(msg.parentId)!;
      parent.replies!.push(message);
    } else {
      // C'est un message racine
      rootMessages.push(message);
    }
  });
  
  // Trier les réponses par date
  const sortReplies = (msg: Message) => {
    if (msg.replies && msg.replies.length > 0) {
      msg.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      msg.replies.forEach(sortReplies);
    }
  };
  
  rootMessages.forEach(sortReplies);
  return rootMessages;
};

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { addNotification, markAsRead: markNotificationAsRead } = useNotificationStore();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log('Chargement des données...');
        
        const [usersData, coursesData, messagesData] = await Promise.all([
          apiService.getUsers(),
          apiService.getCourses(),
          apiService.getMessages()
        ]);
        
        console.log('Utilisateurs chargés:', usersData);
        console.log('Cours chargés:', coursesData);
        console.log('Messages chargés:', messagesData);
        
        setUsers(usersData || []);
        setCourses(coursesData || []);
        
        // Convertir les messages de l'API au format attendu
        const formattedMessages = (messagesData || []).map((msg: any) => ({
          id: msg.id.toString(),
          senderId: msg.sender.id.toString(),
          senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
          senderRole: msg.sender.role,
          receiverId: msg.receiver?.id?.toString(),
          receiverName: msg.receiver ? `${msg.receiver.firstName} ${msg.receiver.lastName}` : undefined,
          courseId: msg.course?.id?.toString(),
          courseName: msg.course?.title,
          subject: msg.subject,
          content: msg.content,
          tags: [],
          isRead: msg.isRead || false,
          isStarred: msg.isStarred || false,
          isArchived: msg.isArchived || false,
          createdAt: msg.createdAt,
          parentId: msg.subject.toLowerCase().startsWith('re:') ? 
            findParentMessage(messagesData, msg.subject.substring(3).trim()) : undefined,
          replies: []
        }));
        
        // Organiser les messages en threads
        const threaded = organizeMessagesInThreads(formattedMessages);
        setMessages(threaded);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
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
        setMessages(mockMessages);
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

  const handleSendMessage = async () => {
    if (!newMessage.subject || !newMessage.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const messageData = {
        senderId: user?.id || 1,
        receiverId: newMessage.receiverId || null,
        courseId: newMessage.courseId || null,
        subject: newMessage.subject,
        content: newMessage.content
      };
      
      console.log('Sending message:', messageData);
      const result = await createMessage(messageData);
      console.log('Message sent successfully:', result);

      toast.success('Message envoyé avec succès');
      setNewMessage({ receiverId: '', courseId: '', subject: '', content: '', tags: [] });
      setIsComposeOpen(false);
      
      // Recharger les messages
      const messagesData = await apiService.getMessages();
      const formattedMessages = (messagesData || []).map((msg: any) => ({
        id: msg.id.toString(),
        senderId: msg.sender.id.toString(),
        senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
        senderRole: msg.sender.role,
        receiverId: msg.receiver?.id?.toString(),
        receiverName: msg.receiver ? `${msg.receiver.firstName} ${msg.receiver.lastName}` : undefined,
        courseId: msg.course?.id?.toString(),
        courseName: msg.course?.title,
        subject: msg.subject,
        content: msg.content,
        tags: [],
        isRead: msg.isRead || false,
        isStarred: msg.isStarred || false,
        isArchived: msg.isArchived || false,
        createdAt: msg.createdAt,
        parentId: msg.subject.toLowerCase().startsWith('re:') ? 
          findParentMessage(messagesData, msg.subject.substring(3).trim()) : undefined,
        replies: []
      }));
      const threaded = organizeMessagesInThreads(formattedMessages);
      setMessages(threaded);
      
      // Ajouter une notification pour le nouveau message
      addNotification({
        userId: messageData.receiverId?.toString() || '1',
        type: 'message',
        title: 'Nouveau message',
        message: `Nouveau message de ${user?.firstName} ${user?.lastName}: ${messageData.subject}`,
        isRead: false,
        actionUrl: '/messages'
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error(`Erreur lors de l'envoi du message : ${error.message}`);
    }
  };

  const handleTagToggle = (tag: string) => {
    setNewMessage(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleToggleMessageStar = async (messageId: string) => {
    try {
      await toggleMessageStar(messageId);
      const updateMessageInTree = (messages: Message[]): Message[] => {
        return messages.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, isStarred: !msg.isStarred };
          }
          if (msg.replies && msg.replies.length > 0) {
            return { ...msg, replies: updateMessageInTree(msg.replies) };
          }
          return msg;
        });
      };
      setMessages(prev => updateMessageInTree(prev));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!messageId || messageId === 'undefined') {
      console.error('ID de message invalide:', messageId);
      return;
    }
    
    try {
      await markMessageAsRead(messageId);
      const updateMessageInTree = (messages: Message[]): Message[] => {
        return messages.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, isRead: true };
          }
          if (msg.replies && msg.replies.length > 0) {
            return { ...msg, replies: updateMessageInTree(msg.replies) };
          }
          return msg;
        });
      };
      setMessages(prev => updateMessageInTree(prev));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu pour ID', messageId, ':', error);
    }
  };

  const archiveMessage = async (messageId: string) => {
    try {
      await toggleMessageArchive(messageId);
      const updateMessageInTree = (messages: Message[]): Message[] => {
        return messages.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, isArchived: true };
          }
          if (msg.replies && msg.replies.length > 0) {
            return { ...msg, replies: updateMessageInTree(msg.replies) };
          }
          return msg;
        });
      };
      setMessages(prev => updateMessageInTree(prev));
      toast.success('Message archivé');
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      toast.error('Erreur lors de l\'archivage');
    }
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

  // Composant pour afficher un message et ses réponses
  const MessageThread = ({ message, depth = 0, parentSubject }: { message: Message; depth?: number; parentSubject?: string }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4 mt-2' : ''}`}>
      <Card 
        className={`cursor-pointer hover:shadow-md transition-all duration-200 group mb-2 ${
          !message.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50 shadow-sm' : 'hover:bg-gray-50'
        } ${depth > 0 ? 'bg-gray-50/30' : ''}`}
        onClick={() => {
          setSelectedMessage(message);
          if (!message.isRead) markAsRead(message.id);
        }}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Non lu"></div>
                  )}
                  {depth > 0 && (
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs ml-1 font-medium">Réponse à</span>
                    </div>
                  )}
                </div>
                
                <h4 className={`font-medium text-gray-900 ${
                  !message.isRead ? 'font-bold' : ''
                }`}>
                  {message.subject}
                </h4>
              </div>
              
              {/* Afficher le message parent pour les réponses */}
              {depth > 0 && parentSubject && (
                <div className="mb-2 p-2 bg-blue-50 border-l-2 border-blue-300 rounded">
                  <div className="flex items-center space-x-1 text-xs text-blue-700">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">En réponse à :</span>
                  </div>
                  <p className="text-sm text-blue-800 font-medium mt-1">"{parentSubject}"</p>
                </div>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    message.senderRole === 'ADMIN' ? 'bg-red-500' :
                    message.senderRole === 'TEACHER' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <span className="font-medium">
                    {activeTab === 'sent' ? 
                      `À: ${message.receiverName || message.courseName || 'Groupe'}` : 
                      `De: ${message.senderName}`
                    }
                  </span>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                    {message.senderRole === 'ADMIN' ? 'Admin' :
                     message.senderRole === 'TEACHER' ? 'Prof' : 'Étudiant'}
                  </span>
                </div>
                
                {message.courseName && (
                  <div className="flex items-center space-x-1 text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                    <span>{message.courseName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <div className="flex items-center space-x-1">
                {message.isRead && (
                  <div className="text-green-500" title="Lu">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMessageStar(message.id);
                }}
                className="opacity-60 group-hover:opacity-100 transition-opacity"
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
                className="opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <Archive className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 line-clamp-2 mb-3 pl-6">
            {message.content}
          </p>
          
          <div className="flex justify-between items-center pl-6">
            <div className="flex flex-wrap gap-1">
              {message.tags.map(tag => (
                <Badge key={tag} className={`text-xs ${getTagStyle(tag)}`}>
                  {availableTags.find(t => t.value === tag)?.label || tag}
                </Badge>
              ))}
              
              {(message.subject.toLowerCase().includes('urgent') || 
                message.content.toLowerCase().includes('urgent')) && (
                <Badge className="text-xs bg-red-100 text-red-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
              
              {message.replies && message.replies.length > 0 && (
                <Badge className="text-xs bg-blue-100 text-blue-800">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {message.replies.length} réponse{message.replies.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>
                {format(new Date(message.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Réponses imbriquées */}
      {message.replies && message.replies.map(reply => (
        <MessageThread key={reply.id} message={reply} depth={depth + 1} parentSubject={message.subject} />
      ))}
    </div>
  );

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
                  <select 
                    value={newMessage.receiverId} 
                    onChange={(e) => setNewMessage({...newMessage, receiverId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">{isLoading ? "Chargement..." : "Sélectionner un destinataire"}</option>
                    {!isLoading && users.filter((u: any) => u.id !== user?.id).map((u: any) => (
                      <option key={u.id} value={u.id.toString()}>
                        {u.firstName} {u.lastName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="course">Groupe de cours (optionnel)</Label>
                  <select 
                    value={newMessage.courseId} 
                    onChange={(e) => setNewMessage({...newMessage, courseId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">{isLoading ? "Chargement..." : "Sélectionner un cours"}</option>
                    {!isLoading && courses.map((course: any) => (
                      <option key={course.id} value={course.id.toString()}>
                        {course.title}
                      </option>
                    ))}
                  </select>
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
          <div className="space-y-3">
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
                <MessageThread key={message.id} message={message} />
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