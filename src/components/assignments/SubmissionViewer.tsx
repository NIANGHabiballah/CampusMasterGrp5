'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FilePreview } from '@/components/assignments/FilePreview';
import { Download, Eye, FileText, Image, Video, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionViewerProps {
  submission: {
    id: string;
    studentName: string;
    files: Array<{
      id: string;
      name: string;
      url: string;
      size: number;
      type: string;
    }>;
    submittedAt: string;
    grade?: number;
    feedback?: string;
    status?: string;
  };
  onGrade?: (submissionId: string, grade: number, feedback: string) => void;
}

export function SubmissionViewer({ submission, onGrade }: SubmissionViewerProps) {
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(submission.grade || 0);
  const [feedback, setFeedback] = useState(submission.feedback || '');

  const handleDownload = async (file: any) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const handleSaveGrade = () => {
    if (onGrade) {
      onGrade(submission.id, grade, feedback);
      setIsGrading(false);
      toast.success('Note enregistrée avec succès');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="default">Soumis</Badge>;
      case 'graded':
        return <Badge variant="outline">Noté</Badge>;
      case 'late':
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold">{submission.studentName}</span>
              {submission.status && getStatusBadge(submission.status)}
            </div>
            <div className="flex items-center space-x-2">
              {submission.grade !== undefined && (
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {submission.grade}/100
                </Badge>
              )}
              {!isGrading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsGrading(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {submission.grade ? 'Modifier' : 'Noter'}
                </Button>
              )}
            </div>
          </CardTitle>
          <p className="text-sm text-gray-500">
            Soumis le {new Date(submission.submittedAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Fichiers soumis</h4>
              <div className="space-y-2">
                {submission.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewFile(file)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Aperçu
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Section de correction */}
            {isGrading ? (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Correction</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grade">Note sur 100</Label>
                      <Input
                        id="grade"
                        type="number"
                        min="0"
                        max="100"
                        value={grade}
                        onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="feedback">Commentaires</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Ajoutez vos commentaires sur le travail de l'étudiant..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsGrading(false);
                        setGrade(submission.grade || 0);
                        setFeedback(submission.feedback || '');
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </Button>
                    <Button onClick={handleSaveGrade}>
                      <Save className="h-4 w-4 mr-1" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              submission.feedback && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Commentaires</h4>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">{submission.feedback}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {previewFile && (
        <FilePreview
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </>
  );
}