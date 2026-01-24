'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, ThumbsUp, Reply, Pin, Lock } from 'lucide-react';
import Link from 'next/link';

export default function TopicPage({ params }: { params: { id: string } }) {
  const [newReply, setNewReply] = useState('');

  const topic = {
    id: params.id,
    title: 'Aide pour implémenter un pattern Observer',
    author: 'Alex Martin',
    createdAt: '2024-01-15T10:30:00Z',
    views: 45,
    replies: 8,
    isPinned: true,
    isLocked: false,
    tags: ['pattern', 'observer', 'aide'],
    content: `Bonjour à tous,

Je travaille sur un projet où je dois implémenter le pattern Observer en JavaScript/TypeScript. J'ai lu la théorie mais j'ai du mal à comprendre comment l'appliquer concrètement dans mon cas.

Mon contexte : J'ai une application de gestion de tâches où plusieurs composants doivent être notifiés quand une tâche change d'état.

Quelqu'un pourrait-il me donner un exemple simple ou des conseils ?

Merci d'avance !`
  };

  const replies = [
    {
      id: 1,
      author: 'Marie Dupont',
      createdAt: '2024-01-15T11:15:00Z',
      content: `Salut Alex ! Le pattern Observer est parfait pour ton cas. Voici un exemple simple :

\`\`\`typescript
class TaskManager {
  private observers: Observer[] = [];
  
  addObserver(observer: Observer) {
    this.observers.push(observer);
  }
  
  notifyObservers(task: Task) {
    this.observers.forEach(observer => observer.update(task));
  }
}
\`\`\`

Tu peux créer des observateurs pour tes différents composants UI.`,
      likes: 5,
      isLiked: false
    },
    {
      id: 2,
      author: 'Pierre Martin',
      createdAt: '2024-01-15T14:30:00Z',
      content: `Excellente explication Marie ! Je rajouterais qu'avec React, tu peux aussi utiliser des hooks personnalisés pour implémenter ce pattern de manière plus moderne.`,
      likes: 2,
      isLiked: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
          <Link href="/forums" className="hover:text-blue-600">Forums</Link>
          <span>/</span>
          <Link href="/forums/1" className="hover:text-blue-600">Architecture Logicielle</Link>
          <span>/</span>
          <span className="font-medium">{topic.title}</span>
        </div>

        {/* Topic Header */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {topic.isPinned && <Pin className="h-5 w-5 text-orange-500" />}
                {topic.isLocked && <Lock className="h-5 w-5 text-red-500" />}
                <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/forums/1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au forum
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {topic.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{topic.views} vues</span>
              <span>{topic.replies} réponses</span>
              <span>Créé le 15 janvier 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* Original Post */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="flex-shrink-0">
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{topic.author}</span>
                  <Badge variant="outline" className="text-xs">Auteur</Badge>
                  <span className="text-sm text-gray-500">15 jan. à 10:30</span>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-700">
                  {topic.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Utile
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Répondre
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          {replies.map((reply) => (
            <Card key={reply.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback>
                      {reply.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{reply.author}</span>
                      <span className="text-sm text-gray-500">15 jan. à 11:15</span>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                      {reply.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-2">{paragraph}</p>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={reply.isLiked ? 'text-blue-600' : ''}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Répondre
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        {!topic.isLocked && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Ajouter une réponse</h3>
              <Textarea
                placeholder="Écrivez votre réponse..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Aperçu</Button>
                <Button>Publier la réponse</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {topic.isLocked && (
          <Card className="border-0 shadow-sm bg-gray-50">
            <CardContent className="p-6 text-center">
              <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Ce sujet est verrouillé. Vous ne pouvez plus y répondre.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}