'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Users, Search, Plus, Pin, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ForumsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const forums = [
    {
      id: 1,
      name: 'Architecture Logicielle',
      description: 'Discussions sur les patterns, microservices et architecture système',
      topics: 24,
      posts: 156,
      lastPost: {
        author: 'Marie Dupont',
        time: '2h',
        title: 'Question sur les microservices'
      },
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Intelligence Artificielle',
      description: 'Machine Learning, Deep Learning et IA générative',
      topics: 18,
      posts: 89,
      lastPost: {
        author: 'Pierre Martin',
        time: '4h',
        title: 'Optimisation des réseaux de neurones'
      },
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Sécurité Informatique',
      description: 'Cybersécurité, cryptographie et protection des données',
      topics: 15,
      posts: 67,
      lastPost: {
        author: 'Sophie Leroy',
        time: '1j',
        title: 'Nouvelles vulnérabilités OWASP'
      },
      color: 'bg-red-500'
    },
    {
      id: 4,
      name: 'Data Science',
      description: 'Analyse de données, visualisation et Big Data',
      topics: 21,
      posts: 134,
      lastPost: {
        author: 'Thomas Dubois',
        time: '3h',
        title: 'Comparaison Python vs R'
      },
      color: 'bg-purple-500'
    },
    {
      id: 5,
      name: 'Projet de Fin d\'Études',
      description: 'Partage d\'expériences et conseils pour les projets',
      topics: 32,
      posts: 198,
      lastPost: {
        author: 'Julie Bernard',
        time: '30min',
        title: 'Aide pour la soutenance'
      },
      color: 'bg-orange-500'
    }
  ];

  const recentTopics = [
    {
      id: 1,
      title: 'Aide pour implémenter un pattern Observer',
      author: 'Alex Martin',
      forum: 'Architecture Logicielle',
      replies: 8,
      views: 45,
      lastReply: '1h',
      isPinned: true
    },
    {
      id: 2,
      title: 'Comparaison TensorFlow vs PyTorch',
      author: 'Sarah Chen',
      forum: 'Intelligence Artificielle',
      replies: 12,
      views: 78,
      lastReply: '2h',
      isPinned: false
    },
    {
      id: 3,
      title: 'Bonnes pratiques pour les API REST sécurisées',
      author: 'David Wilson',
      forum: 'Sécurité Informatique',
      replies: 6,
      views: 34,
      lastReply: '3h',
      isPinned: false
    }
  ];

  const filteredForums = forums.filter(forum =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forums de Discussion</h1>
            <p className="text-gray-600">Échangez avec vos camarades sur les sujets de cours</p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau sujet
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans les forums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forums List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Forums par Matière</h2>
            
            {filteredForums.map((forum) => (
              <Card key={forum.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${forum.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/forums/${forum.id}`} className="hover:text-blue-600">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {forum.name}
                          </h3>
                        </Link>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{forum.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {forum.topics} sujets
                          </span>
                          <span>{forum.posts} messages</span>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Dernier message</p>
                          <p className="text-sm font-medium">{forum.lastPost.title}</p>
                          <p className="text-xs text-gray-500">
                            par {forum.lastPost.author} • {forum.lastPost.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Topics */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Sujets Récents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTopics.map((topic) => (
                  <div key={topic.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start space-x-2 mb-2">
                      {topic.isPinned && (
                        <Pin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      )}
                      <Link href={`/forums/topic/${topic.id}`} className="hover:text-blue-600">
                        <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                          {topic.title}
                        </h4>
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>par {topic.author}</span>
                      <span>{topic.lastReply}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {topic.replies}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {topic.views}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Forum Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total sujets</span>
                  <span className="font-semibold">110</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total messages</span>
                  <span className="font-semibold">644</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Membres actifs</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aujourd'hui</span>
                  <span className="font-semibold">23 messages</span>
                </div>
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  En ligne (12)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Marie D.', 'Pierre M.', 'Sophie L.', 'Thomas D.', 'Julie B.'].map((user, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-green-50 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-700">{user}</span>
                    </div>
                  ))}
                  <Badge variant="secondary" className="text-xs">+7 autres</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}