'use client';

import { useState, use, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Plus, Pin, MessageSquare, Eye, ThumbsUp, Reply, Search } from 'lucide-react';
import Link from 'next/link';
import { createTopic, getTopicsByForum } from '@/services/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

export default function ForumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const forumData = {
    1: { name: 'Architecture Logicielle', color: 'bg-blue-500' },
    2: { name: 'Intelligence Artificielle', color: 'bg-green-500' },
    3: { name: 'Sécurité Informatique', color: 'bg-red-500' },
    4: { name: 'Data Science', color: 'bg-purple-500' },
    5: { name: 'Projet de Fin d\'Études', color: 'bg-orange-500' }
  };

  const forum = forumData[id as keyof typeof forumData] || forumData[1];

  useEffect(() => {
    loadTopics();
    
    // Rechargement automatique toutes les 3 secondes
    const interval = setInterval(loadTopics, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await getTopicsByForum(parseInt(id));
      setTopics(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sujets:', error);
      toast.error('Erreur lors du chargement des sujets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Veuillez remplir le titre et le contenu');
      return;
    }

    try {
      setSubmitting(true);
      await createTopic({
        title: title.trim(),
        content: content.trim(),
        priority: 'NORMAL',
        forumId: parseInt(id),
        authorId: user?.id || 1
      });
      
      toast.success('Sujet créé avec succès!');
      setTitle('');
      setContent('');
      setTags('');
      setShowNewTopic(false);
      
      // Recharger immédiatement
      setTimeout(() => {
        loadTopics();
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la création du sujet:', error);
      toast.error('Erreur lors de la création du sujet');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTopics = topics.filter((topic: any) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Input 
                placeholder="Titre du sujet" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea 
                placeholder="Décrivez votre question ou sujet de discussion..." 
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Input 
                placeholder="Tags (séparés par des virgules)" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewTopic(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Publication...' : 'Publier'}
                </Button>
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
        {loading ? (
          <div className="text-center py-8">
            <p>Chargement des sujets...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic: any) => (
              <Card key={topic.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="flex-shrink-0 w-12 h-12 ring-2 ring-blue-100">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {topic.authorName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <Link href={`/forums/topic/${topic.id}`} className="group">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                            {topic.title}
                          </h3>
                        </Link>
                        
                        {topic.content && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {topic.content.substring(0, 150)}{topic.content.length > 150 ? '...' : ''}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-gray-700">par</span>
                            <span className="font-semibold text-blue-600">{topic.authorName || 'Utilisateur'}</span>
                          </div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <span>{new Date(topic.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {topic.postCount > 0 && (
                            <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                              <MessageSquare className="h-4 w-4" />
                              <span className="font-semibold">{topic.postCount}</span>
                              <span className="text-xs">{topic.postCount === 1 ? 'réponse' : 'réponses'}</span>
                            </div>
                          )}
                          
                          {topic.views > 0 && (
                            <div className="flex items-center space-x-1 bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                              <Eye className="h-4 w-4" />
                              <span className="font-semibold">{topic.views}</span>
                              <span className="text-xs">{topic.views === 1 ? 'vue' : 'vues'}</span>
                            </div>
                          )}
                          
                          {topic.postCount === 0 && topic.views === 0 && (
                            <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-xs font-medium">Nouveau sujet</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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