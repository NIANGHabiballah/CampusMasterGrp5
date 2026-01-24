'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilePreview } from '@/components/assignments/FilePreview';
import { Download, Eye, FileText, Image, Video } from 'lucide-react';

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
  };
}

export function SubmissionViewer({ submission }: SubmissionViewerProps) {
  const [previewFile, setPreviewFile] = useState<any>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Soumission de {submission.studentName}</span>
            {submission.grade && (
              <Badge variant="outline">{submission.grade}/100</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submission.files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
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
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {submission.feedback && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Commentaire :</p>
              <p className="text-sm text-gray-600">{submission.feedback}</p>
            </div>
          )}
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