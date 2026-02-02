'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, User, Clock, BookOpen } from 'lucide-react';
import { apiService } from '@/services/api';
import { useAuthStore } from '@/store/auth';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await apiService.getAnnouncements();
      setAnnouncements(data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Erreur chargement annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return { label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500' };
      case 'MEDIUM':
        return { label: 'Important', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' };
      case 'LOW':
        return { label: 'Info', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' };
      default:
        return { label: 'Normal', color: 'bg-gray-100 text-gray-800 border-gray-200', dot: 'bg-gray-500' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des annonces...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Megaphone className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Annonces</h1>
              <p className="text-gray-600 mt-1">Toutes les annonces de vos enseignants</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
            <Badge variant="secondary" className="bg-white">
              {announcements.length} annonce{announcements.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Megaphone className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune annonce</h3>
                <p className="text-gray-500">Les annonces de vos enseignants apparaîtront ici</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {announcements.map((announcement) => {
              const priorityConfig = getPriorityConfig(announcement.priority);
              return (
                <Card key={announcement.id} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`h-1.5 ${priorityConfig.dot}`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${priorityConfig.color} border font-medium`}>
                            {priorityConfig.label}
                          </Badge>
                          {announcement.course && (
                            <Badge variant="outline" className="bg-white">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {announcement.course.title}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl mb-3 text-gray-900">
                          {announcement.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              {announcement.author?.firstName} {announcement.author?.lastName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>
                              {new Date(announcement.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span>
                              {new Date(announcement.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                    </div>
                    {announcement.expiresAt && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Clock className="h-4 w-4" />
                          <span>
                            Expire le {new Date(announcement.expiresAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
