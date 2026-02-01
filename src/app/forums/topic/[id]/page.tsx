'use client';

import { useState, use, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, ThumbsUp, Reply, Pin, Lock, MessageCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { getTopicById, getPostsByTopic, createPost, likePost, incrementTopicViews, likeTopic } from '@/services/api';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuthStore();
  const [newReply, setNewReply] = useState('');
  const [topic, setTopic] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadTopicData();
    // Incrémenter les vues quand on visite le sujet
    incrementTopicViews(parseInt(id)).catch(() => {});
  }, [id]);

  const loadTopicData = async () => {
    try {
      setLoading(true);
      const [topicData, postsData] = await Promise.all([
        getTopicById(parseInt(id)),
        getPostsByTopic(parseInt(id))
      ]);
      setTopic(topicData);
      setPosts(postsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement du sujet');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim()) {
      toast.error('Veuillez écrire une réponse');
      return;
    }

    try {
      setSubmitting(true);
      await createPost({
        content: newReply.trim(),
        topicId: parseInt(id),
        authorId: user?.id || 1
      });
      
      toast.success('Réponse ajoutée avec succès!');
      setNewReply('');
      loadTopicData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      toast.error('Erreur lors de l\'ajout de la réponse');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (postId === -1) {
      try {
        await likeTopic(parseInt(id));
        toast.success('Merci ! Ce sujet vous a été utile.');
        loadTopicData();
      } catch (error) {
        console.error('Erreur like topic:', error);
        toast.success('Merci ! Ce sujet vous a été utile.'); // Fallback en cas d'erreur API
      }
      return;
    }
    
    try {
      await likePost(postId);
      toast.success('Post liké!');
      loadTopicData();
    } catch (error) {
      toast.error('Erreur lors du like');
    }
  };

  const handleReplyToPost = (postId: number) => {
    setReplyingTo(postId);
    setReplyText('');
  };

  const submitReplyToPost = async (postId: number) => {
    if (!replyText.trim()) {
      toast.error('Veuillez écrire une réponse');
      return;
    }

    try {
      const targetName = postId === -1 ? topic?.authorName : posts.find(p => p.id === postId)?.authorName;
      const content = targetName ? `@${targetName} ${replyText.trim()}` : replyText.trim();
      
      await createPost({
        content: content,
        topicId: parseInt(id),
        authorId: user?.id || 1
      });
      
      toast.success('Réponse ajoutée!');
      setReplyingTo(null);
      setReplyText('');
      loadTopicData();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la réponse');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p>Chargement du sujet...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p>Sujet non trouvé</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
          <Link href="/forums" className="hover:text-blue-600">Forums</Link>
          <span>/</span>
          <Link href={`/forums/${topic.forumId || 1}`} className="hover:text-blue-600">{topic.forumName || 'Forum'}</Link>
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
                <Link href={`/forums/${topic.forumId || 1}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au forum
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {topic.tags?.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              )) || null}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{topic.views || 0} vues</span>
              <span>{posts.length} réponses</span>
              <span>Créé le {new Date(topic.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Original Post */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="flex-shrink-0">
                <AvatarFallback>
                  {topic.authorName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{topic.authorName || 'Utilisateur'}</span>
                  <Badge variant="outline" className="text-xs">Auteur</Badge>
                  <span className="text-sm text-gray-500">{new Date(topic.createdAt).toLocaleString()}</span>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-700">
                  {topic.content?.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-3">{paragraph}</p>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLike(-1)}
                    className="text-gray-500 hover:text-green-600"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Utile
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleReplyToPost(-1)}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Répondre
                  </Button>
                </div>
                
                {replyingTo === -1 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Textarea
                      placeholder="Votre réponse..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => submitReplyToPost(-1)}
                      >
                        Répondre
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-2 mb-6">
          {posts.map((post: any, index: number) => {
            const isReplyToPost = post.content?.includes('@');
            const mentionedUser = post.content?.match(/@([^\s]+(?:\s+[^\s]+)?)/)?.[1];
            
            // Trouver le post parent pour calculer l'indentation
            const parentPost = mentionedUser ? posts.find(p => 
              p.authorName?.toLowerCase().includes(mentionedUser.toLowerCase())
            ) : null;
            
            const indentLevel = isReplyToPost ? 1 : 0;
            const marginLeft = indentLevel * 40; // 40px par niveau
            
            return (
              <div key={post.id} style={{ marginLeft: `${marginLeft}px` }}>
                {/* Ligne de connexion au parent */}
                {isReplyToPost && (
                  <div className="flex items-center mb-2 text-xs text-gray-500">
                    <div className="w-6 h-0.5 bg-blue-300"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full mx-1"></div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Répond à {mentionedUser}
                    </span>
                  </div>
                )}
                
                <Card className={`border-0 shadow-sm relative ${
                  isReplyToPost 
                    ? 'border-l-4 border-l-blue-400 bg-blue-50/50' 
                    : 'border-l-4 border-l-green-400 bg-green-50/50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className={`flex-shrink-0 w-8 h-8 ${
                        isReplyToPost ? 'ring-2 ring-blue-200' : 'ring-2 ring-green-200'
                      }`}>
                        <AvatarFallback className={`text-xs ${
                          isReplyToPost ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {post.authorName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900 text-sm">{post.authorName || 'Utilisateur'}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center ${
                            isReplyToPost 
                              ? 'text-blue-700 bg-blue-100' 
                              : 'text-green-700 bg-green-100'
                          }`}>
                            {isReplyToPost ? (
                              <><RotateCcw className="h-3 w-3 mr-1" /> Réponse</>
                            ) : (
                              <><MessageCircle className="h-3 w-3 mr-1" /> Direct</>
                            )}
                          </span>
                          <span className="text-xs text-gray-500">#{post.id}</span>
                          <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                        
                        <div className="prose prose-sm max-w-none text-gray-700 mb-3 text-sm">
                          {post.content?.split('\n').map((paragraph: string, pIndex: number) => {
                            const highlightedText = paragraph.replace(
                              /@([^\s]+(?:\s+[^\s]+)?)/g, 
                              '<span class="bg-yellow-200 text-yellow-900 px-1 rounded font-semibold">@$1</span>'
                            );
                            
                            return (
                              <p key={pIndex} className="mb-1" 
                                 dangerouslySetInnerHTML={{ __html: highlightedText }} />
                            );
                          })}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={`h-7 text-xs ${post.isLiked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
                              onClick={() => handleLike(post.id)}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {post.likes || 0}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 text-xs text-gray-500 hover:text-blue-600"
                              onClick={() => handleReplyToPost(post.id)}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Répondre
                            </Button>
                          </div>
                        </div>
                        
                        {replyingTo === post.id && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="text-xs text-blue-700 mb-2 font-medium flex items-center">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Répondre à <strong>{post.authorName}</strong>
                            </div>
                            <Textarea
                              placeholder={`@${post.authorName} Votre réponse...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                              className="mb-2 text-sm border-blue-200 focus:border-blue-400"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                                className="h-7 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                Annuler
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => submitReplyToPost(post.id)}
                                className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                              >
                                Répondre
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
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
                <Button onClick={handleSubmitReply} disabled={submitting}>
                  {submitting ? 'Publication...' : 'Publier la réponse'}
                </Button>
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