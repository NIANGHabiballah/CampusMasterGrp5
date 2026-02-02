'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Send, 
  MessageSquare,
  Clock,
  Plus
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notifications';
import { apiService } from '@/services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Aminata Diallo',
    receiverId: '1',
    receiverName: 'Professeur',
    content: 'Merci pour votre retour sur mon devoir !',
    isRead: false,
    createdAt: '2024-01-24T10:30:00Z'
  },
  {
    id: '2',
    senderId: '3',
    senderName: 'Mamadou Sall',
    receiverId: '1',
    receiverName: 'Professeur',
    content: 'Pouvez-vous m\'expliquer l\'exercice 3 ?',
    isRead: false,
    createdAt: '2024-01-24T09:15:00Z'
  },
  {
    id: '3',
    senderId: '4',
    senderName: 'Fatou Ndiaye',
    receiverId: '1',
    receiverName: 'Professeur',
    content: 'J\'ai envoyé mon projet',
    isRead: true,
    createdAt: '2024-01-23T16:00:00Z'
  },
  {
    id: '4',
    senderId: '5',
    senderName: 'Ousmane Ba',
    receiverId: '1',
    receiverName: 'Professeur',
    content: 'Merci professeur',
    isRead: true,
    createdAt: '2024-01-23T14:30:00Z'
  },
  {
    id: '5',
    senderId: '6',
    senderName: 'Aïssatou Diop',
    receiverId: '1',
    receiverName: 'Professeur',
    content: 'Bonjour, j\'ai une question...',
    isRead: true,
    createdAt: '2024-01-23T10:00:00Z'
  },
  {
    id: '6',
    senderId: '7',
    senderName: 'Ibrahima Faye',
    receiverId: '1',
    receiverName: 'Professeur',
    content: 'Le cours était très intéressant',
    isRead: true,
    createdAt: '2024-01-22T15:20:00Z'
  }
];

export default function MessagesPage() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const [messagesData, usersData] = await Promise.all([
          apiService.getMessages(),
          apiService.getUsers()
        ]);
        
        const formattedMessages = (messagesData || []).map((msg: any) => ({
          id: msg.id.toString(),
          senderId: msg.sender.id.toString(),
          senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
          receiverId: msg.receiver?.id?.toString() || '1',
          receiverName: msg.receiver ? `${msg.receiver.firstName} ${msg.receiver.lastName}` : 'Professeur',
          subject: msg.subject || 'Sans sujet',
          content: msg.content,
          isRead: msg.isRead || false,
          createdAt: msg.createdAt
        }));
        setMessages(formattedMessages);
        setUsers(usersData || []);
      } catch (error) {
        console.error('Erreur chargement messages:', error);
        setMessages(mockMessages);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, []);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({ receiverId: '', subject: '', content: '' });
  const [users, setUsers] = useState([]);
  
  // Grouper les messages par conversation
  const conversations = messages.reduce((acc, message) => {
    const conversationId = message.senderId === user?.id?.toString() ? message.receiverId : message.senderId;
    if (!conversationId) return acc;
    
    if (!acc[conversationId]) {
      acc[conversationId] = {
        id: conversationId,
        participant: message.senderId === user?.id?.toString() ? 
          { id: message.receiverId, name: message.receiverName } :
          { id: message.senderId, name: message.senderName },
        messages: [],
        lastMessage: message,
        unreadCount: 0
      };
    }
    
    acc[conversationId].messages.push(message);
    
    // Compter les messages non lus
    if (!message.isRead && message.senderId !== user?.id?.toString()) {
      acc[conversationId].unreadCount++;
    }
    
    // Garder le dernier message
    if (new Date(message.createdAt) > new Date(acc[conversationId].lastMessage.createdAt)) {
      acc[conversationId].lastMessage = message;
    }
    
    return acc;
  }, {} as Record<string, any>);
  
  const conversationList = Object.values(conversations).sort((a: any, b: any) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
  
  const selectedMessages = selectedConversation ? conversations[selectedConversation]?.messages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) : [];
  
  const selectedParticipant = selectedConversation ? conversations[selectedConversation]?.participant : null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleComposeMessage = async () => {
    if (!newMessage.content.trim() || !newMessage.receiverId) return;
    
    try {
      const messageData = {
        senderId: user?.id || 1,
        receiverId: parseInt(newMessage.receiverId),
        subject: newMessage.subject || 'Message',
        content: newMessage.content
      };
      
      await apiService.createMessage(messageData);
      
      // Recharger les messages
      const messagesData = await apiService.getMessages();
      const formattedMessages = (messagesData || []).map((msg: any) => ({
        id: msg.id.toString(),
        senderId: msg.sender.id.toString(),
        senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
        receiverId: msg.receiver?.id?.toString() || '1',
        receiverName: msg.receiver ? `${msg.receiver.firstName} ${msg.receiver.lastName}` : 'Professeur',
        subject: msg.subject || 'Sans sujet',
        content: msg.content,
        isRead: msg.isRead || false,
        createdAt: msg.createdAt
      }));
      setMessages(formattedMessages);
      
      setNewMessage({ receiverId: '', subject: '', content: '' });
      setIsComposeOpen(false);
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !selectedConversation) return;
    
    try {
      const messageData = {
        senderId: user?.id || 1,
        receiverId: parseInt(selectedConversation),
        subject: 'Message',
        content: newMessageText
      };
      
      await apiService.createMessage(messageData);
      
      // Recharger les messages
      const messagesData = await apiService.getMessages();
      const formattedMessages = (messagesData || []).map((msg: any) => ({
        id: msg.id.toString(),
        senderId: msg.sender.id.toString(),
        senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
        receiverId: msg.receiver?.id?.toString() || '1',
        receiverName: msg.receiver ? `${msg.receiver.firstName} ${msg.receiver.lastName}` : 'Professeur',
        subject: msg.subject || 'Sans sujet',
        content: msg.content,
        isRead: msg.isRead || false,
        createdAt: msg.createdAt
      }));
      setMessages(formattedMessages);
      
      setNewMessageText('');
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Composer un message</DialogTitle>
              <DialogDescription>
                Envoyez un message à un utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Destinataire</Label>
                <select 
                  value={newMessage.receiverId} 
                  onChange={(e) => setNewMessage({...newMessage, receiverId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Sélectionner un destinataire</option>
                  {users.filter((u: any) => u.id !== user?.id).map((u: any) => (
                    <option key={u.id} value={u.id.toString()}>
                      {u.firstName} {u.lastName} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Sujet du message"
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
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleComposeMessage}>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Liste des conversations */}
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Barre de recherche */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher une conversation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversationList.map((conversation: any) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation.id);
                  // Marquer tous les messages de cette conversation comme lus
                  if (conversation.unreadCount > 0) {
                    const conversationMessages = conversation.messages.filter(
                      (msg: any) => !msg.isRead && msg.senderId !== user?.id?.toString()
                    );
                    conversationMessages.forEach((msg: any) => {
                      apiService.markMessageAsRead(msg.id).catch(() => {});
                    });
                    
                    // Mettre à jour l'état local
                    setMessages(prev => prev.map(msg => 
                      conversationMessages.some((cm: any) => cm.id === msg.id) 
                        ? { ...msg, isRead: true } 
                        : msg
                    ));
                    
                    // Mettre à jour le compteur global immédiatement
                    const { unreadCount } = useNotificationStore.getState();
                    const newCount = Math.max(0, unreadCount - conversation.unreadCount);
                    useNotificationStore.setState({ unreadCount: newCount });
                  }
                }}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {getInitials(conversation.participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {conversation.participant.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {format(new Date(conversation.lastMessage.createdAt), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-1 ${
                      conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {conversation.lastMessage.subject && conversation.lastMessage.subject !== 'Sans sujet' 
                        ? `${conversation.lastMessage.subject}: ${conversation.lastMessage.content}` 
                        : conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header de la conversation */}
              <div className="bg-white border-b px-6 py-4 flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {getInitials(selectedParticipant?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedParticipant?.name}</h2>
                  <p className="text-sm text-green-600">En ligne</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id?.toString() ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id?.toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      {message.subject && message.subject !== 'Sans sujet' && (
                        <p className={`text-xs font-medium mb-1 ${
                          message.senderId === user?.id?.toString() ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {message.subject}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user?.id?.toString() ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {format(new Date(message.createdAt), 'HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div className="bg-white border-t p-4">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Écrivez votre message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-600">
                  Choisissez une conversation dans la liste pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}