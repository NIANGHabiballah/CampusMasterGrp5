'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Plus, Pin, MessageSquare, Eye, ThumbsUp, Reply, Search } from 'lucide-react';
import Link from 'next/link';

export default function ForumPage({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);

  const forumData = {
    1: { name: 'Architecture Logicielle', color: 'bg-blue-500' },
    2: { name: 'Intelligence Artificielle', color: 'bg-green-500' },
    3: { name: 'Sécurité Informatique', color: 'bg-red-500' },
    4: { name: 'Data Science', color: 'bg-purple-500' },
    5: { name: 'Projet de Fin d\'Études', color: 'bg-orange-500' }
  };

  const forum = forumData[params.id as keyof typeof forumData] || forumData[1];

  const topics = [
    {
      id: 1,
      title: 'Aide pour implémenter un pattern Observer',
      author: 'Alex Martin',
      authorAvatar: '',
      createdAt: '2024-01-15',
      replies: 8,
      views: 45,
      lastReply: '1h',
      isPinned: true,
      isLocked: false,
      tags: ['pattern', 'observer', 'aide']
    },
    {
      id: 2,
      title: 'Différence entre Factory et Abstract Factory',
      author: 'Marie Dupont',
      authorAvatar: '',
      createdAt: '2024-01-14',
      replies: 12,
      views: 78,
      lastReply: '2h',
      isPinned: false,
      isLocked: false,
      tags: ['pattern', 'factory']
    },
    {
      id: 3,
      title: 'Microservices vs Monolithe - Retour d\'expérience',
      author: 'Pierre Martin',
      authorAvatar: '',
      createdAt: '2024-01-13',
      replies: 15,
      views: 123,
      lastReply: '4h',
      isPinned: false,
      isLocked: false,
      tags: ['microservices', 'architecture']
    },
    {
      id: 4,
      title: 'Ressources pour apprendre DDD (Domain Driven Design)',
      author: 'Sophie Leroy',
      authorAvatar: '',
      createdAt: '2024-01-12',
      replies: 6,
      views: 34,
      lastReply: '1j',
      isPinned: false,
      isLocked: false,
      tags: ['ddd', 'ressources']
    }
  ];

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
          <Link href="/forums" className="hover:text-blue-600 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Forums
          </Link>
          <span>/</span>
          <span className="font-medium">{forum.name}</span>
        </div>

        {/* Forum Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${forum.color} rounded-lg flex items-center justify-center`}>
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{forum.name}</h1>
              <p className="text-gray-600">Discussions et échanges sur {forum.name.toLowerCase()}</p>
            </div>
          </div>
          
          <Button onClick={() => setShowNewTopic(!showNewTopic)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau sujet
          </Button>
        </div>

        {/* New Topic Form */}
        {showNewTopic && (
          <Card className="mb-6 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Créer un nouveau sujet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Titre du sujet" />
              <Textarea placeholder="Décrivez votre question ou sujet de discussion..." rows={4} />
              <Input placeholder="Tags (séparés par des virgules)" />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewTopic(false)}>
                  Annuler
                </Button>
                <Button>Publier</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans ce forum..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback>
                      {topic.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {topic.isPinned && (
                          <Pin className="h-4 w-4 text-orange-500" />
                        )}
                        <Link href={`/forums/topic/${topic.id}`} className="hover:text-blue-600">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {topic.title}
                          </h3>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      {topic.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>par <span className="font-medium">{topic.author}</span></span>
                        <span>{topic.createdAt}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {topic.replies}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {topic.views}
                        </span>
                        <span>Dernier: {topic.lastReply}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun sujet trouvé</h3>
              <p className="text-gray-600 text-center">
                {searchTerm ? 'Aucun sujet ne correspond à votre recherche.' : 'Soyez le premier à créer un sujet dans ce forum !'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}