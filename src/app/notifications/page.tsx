'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificationStore } from '@/store/notifications';
import { Bell, CheckCircle, FileText, MessageSquare, Clock, MarkAsRead } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.isRead
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'grade':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'assignment':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'grade':
        return <Badge variant="outline" className="text-green-600 border-green-600">Note</Badge>;
      case 'assignment':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Devoir</Badge>;
      case 'message':
        return <Badge variant="outline" className="text-purple-600 border-purple-600">Message</Badge>;
      case 'announcement':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Annonce</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes vos notifications sont lues'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <MarkAsRead className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              Toutes ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Non lues ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {filter === 'unread' 
                      ? 'Toutes vos notifications ont été lues.' 
                      : 'Vous recevrez ici vos notifications importantes.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`border-0 shadow-sm transition-all duration-200 hover:shadow-md ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            {getNotificationBadge(notification.type)}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              Il y a quelques minutes
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {notification.actionUrl && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  asChild
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Link href={notification.actionUrl}>
                                    Voir détails
                                  </Link>
                                </Button>
                              )}
                              
                              {!notification.isRead && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Marquer comme lu
                                </Button>
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}