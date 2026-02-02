'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Users, Search, Plus, Pin, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

export default function ForumsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [forums, setForums] = useState([]);
  const [recentTopics, setRecentTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    forumId: '',
    priority: 'normal'
  });

  useEffect(() => {
    loadForums();
  }, []);

  useEffect(() => {
    if (forums.length > 0) {
      loadRecentTopics();
    }
  }, [forums]);

  const loadForums = async () => {
    try {
      setLoading(true);
      const data = await apiService.getForums();
      setForums(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des forums');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentTopics = async () => {
    try {
      const topics = await apiService.getTopicsByForum(1);
      setRecentTopics(topics.slice(0, 5));
    } catch (error) {
      console.error('Erreur chargement sujets:', error);
      setRecentTopics([]);
    }
  };

  const handleCreateTopic = async () => {
    if (!newTopic.title || !newTopic.content || !newTopic.forumId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      await apiService.createTopic(newTopic);
      setNewTopic({ title: '', content: '', forumId: '', priority: 'normal' });
      setIsNewTopicOpen(false);
      toast.success('Sujet créé avec succès !');
      loadRecentTopics(); // Recharger les sujets
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la création du sujet');
    }
  };

  const filteredForums = (loading ? [] : forums).filter(forum =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center py-8">Chargement des forums...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forums de Discussion</h1>
            <p className="text-gray-600">Échangez avec vos camarades sur les sujets de cours</p>
          </div>
          
          <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau sujet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>Créer un nouveau sujet</DialogTitle>
                <DialogDescription>
                  Partagez vos questions ou idées avec la communauté
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor="forum">Forum</Label>
                  <select 
                    value={newTopic.forumId}
                    onChange={(e) => setNewTopic({...newTopic, forumId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">Sélectionner un forum</option>
                    {forums.map(forum => (
                      <option key={forum.id} value={forum.id.toString()}>
                        {forum.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <select 
                    value={newTopic.priority}
                    onChange={(e) => setNewTopic({...newTopic, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="low">Basse</option>
                    <option value="normal">Normale</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du sujet</Label>
                  <Input 
                    id="title"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                    placeholder="Ex: Question sur React Hooks" 
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea 
                    id="content"
                    value={newTopic.content}
                    onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                    placeholder="Décrivez votre question ou sujet de discussion..." 
                    className="bg-white border-gray-300 min-h-32"
                    rows={6}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewTopicOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateTopic} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Créer le sujet
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Forums par Matière</h2>
            
            {filteredForums.map((forum) => (
              <Card key={forum.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                            {forum.topicCount || 0} sujets
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Sujets Récents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTopics.map((topic) => (
                  <div key={topic.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start space-x-2 mb-2">
                      <Link href={`/forums/topic/${topic.id}`} className="hover:text-blue-600">
                        <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                          {topic.title}
                        </h4>
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>par {topic.author?.firstName} {topic.author?.lastName}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">{topic.priority}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{topic.content}</p>
                  </div>
                ))}
                {recentTopics.length === 0 && (
                  <p className="text-sm text-gray-500">Aucun sujet récent</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total forums</span>
                  <span className="font-semibold">{forums.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total sujets</span>
                  <span className="font-semibold">{recentTopics.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}