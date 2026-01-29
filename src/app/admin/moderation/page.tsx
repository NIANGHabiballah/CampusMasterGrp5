'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, XCircle, Eye, Flag, MessageSquare, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Report {
  id: string;
  type: 'message' | 'assignment' | 'forum' | 'user';
  contentId: string;
  contentTitle: string;
  contentPreview: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  severity: 'low' | 'medium' | 'high';
}

const mockReports: Report[] = [
  {
    id: '1',
    type: 'message',
    contentId: 'msg-123',
    contentTitle: 'Message inapproprié',
    contentPreview: 'Contenu potentiellement offensant dans un message privé...',
    reportedBy: 'Marie Dupont',
    reportedUser: 'Jean Martin',
    reason: 'Langage inapproprié',
    status: 'pending',
    createdAt: '2024-01-24T10:30:00Z',
    severity: 'medium'
  },
  {
    id: '2',
    type: 'forum',
    contentId: 'forum-456',
    contentTitle: 'Post de forum suspect',
    contentPreview: 'Contenu hors sujet et potentiellement spam...',
    reportedBy: 'Pierre Durand',
    reportedUser: 'Sophie Leroy',
    reason: 'Spam/Hors sujet',
    status: 'pending',
    createdAt: '2024-01-23T15:45:00Z',
    severity: 'low'
  },
  {
    id: '3',
    type: 'assignment',
    contentId: 'assign-789',
    contentTitle: 'Soumission suspecte',
    contentPreview: 'Possible plagiat détecté dans une soumission...',
    reportedBy: 'Prof. Martin',
    reportedUser: 'Alex Dubois',
    reason: 'Plagiat suspecté',
    status: 'pending',
    createdAt: '2024-01-22T09:15:00Z',
    severity: 'high'
  }
];

export default function AdminModerationPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const handleModerate = (reportId: string, action: 'approve' | 'reject') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: action === 'approve' ? 'approved' : 'rejected' }
        : report
    ));
    
    const actionText = action === 'approve' ? 'approuvé' : 'rejeté';
    toast.success(`Signalement ${actionText}`);
    setSelectedReport(null);
    setModerationNote('');
  };

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-5 w-5" />;
      case 'assignment': return <FileText className="h-5 w-5" />;
      case 'forum': return <Users className="h-5 w-5" />;
      case 'user': return <Users className="h-5 w-5" />;
      default: return <Flag className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'message': return 'Message';
      case 'assignment': return 'Devoir';
      case 'forum': return 'Forum';
      case 'user': return 'Utilisateur';
      default: return type;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modération</h1>
          <p className="text-gray-600 mt-1">
            Gérez les signalements de contenu ({pendingCount} en attente)
          </p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            En attente ({reports.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approuvés ({reports.filter(r => r.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejetés ({reports.filter(r => r.status === 'rejected').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Tous ({reports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun signalement
                </h3>
                <p className="text-gray-600">
                  {filter === 'pending' 
                    ? 'Aucun signalement en attente de modération.'
                    : 'Aucun signalement dans cette catégorie.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReports.map(report => (
                <Card key={report.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(report.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {report.contentTitle}
                            </h3>
                            <Badge className={getSeverityColor(report.severity)}>
                              {report.severity === 'high' ? 'Urgent' : 
                               report.severity === 'medium' ? 'Moyen' : 'Faible'}
                            </Badge>
                            <Badge variant="outline">
                              {getTypeLabel(report.type)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Signalé par:</strong> {report.reportedBy} • 
                            <strong> Utilisateur concerné:</strong> {report.reportedUser}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Motif:</strong> {report.reason}
                          </p>
                          
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {report.contentPreview}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status === 'pending' ? 'En attente' :
                           report.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {format(new Date(report.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Examiner
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle>Modération du signalement</DialogTitle>
                              <DialogDescription>
                                Examinez le contenu et prenez une décision
                              </DialogDescription>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-4 p-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">Détails du signalement</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Type:</strong> {getTypeLabel(selectedReport.type)}</p>
                                    <p><strong>Signalé par:</strong> {selectedReport.reportedBy}</p>
                                    <p><strong>Utilisateur concerné:</strong> {selectedReport.reportedUser}</p>
                                    <p><strong>Motif:</strong> {selectedReport.reason}</p>
                                    <p><strong>Sévérité:</strong> {selectedReport.severity}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">Contenu signalé</h4>
                                  <p className="text-sm">{selectedReport.contentPreview}</p>
                                </div>
                                
                                <div>
                                  <Label htmlFor="note">Note de modération (optionnel)</Label>
                                  <Textarea
                                    id="note"
                                    value={moderationNote}
                                    onChange={(e) => setModerationNote(e.target.value)}
                                    placeholder="Ajoutez une note sur votre décision..."
                                    className="bg-white border-gray-300"
                                  />
                                </div>
                                
                                {selectedReport.status === 'pending' && (
                                  <div className="flex justify-end space-x-2">
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleModerate(selectedReport.id, 'reject')}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Rejeter
                                    </Button>
                                    <Button 
                                      onClick={() => handleModerate(selectedReport.id, 'approve')}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approuver
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {report.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleModerate(report.id, 'reject')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleModerate(report.id, 'approve')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}