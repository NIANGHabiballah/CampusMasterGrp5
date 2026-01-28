'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, X, Image, Video, Archive } from 'lucide-react';

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-purple-500" />;
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-8 w-8 text-orange-500" />;
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const canPreview = (type: string) => {
    return type.startsWith('image/') || type.startsWith('text/');
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="flex justify-center p-4">
          <img 
            src={file.url} 
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        {getFileIcon(file.type)}
        <p className="mt-4 text-sm">Aperçu non disponible pour ce type de fichier</p>
        <p className="text-xs text-gray-400">Téléchargez le fichier pour le consulter</p>
      </div>
    );
  };

  const handleDownload = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0" showCloseButton={false}>
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(file.type)}
              <div>
                <DialogTitle className="text-lg">{file.name}</DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {file.type}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? 'Téléchargement...' : 'Télécharger'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(85vh-120px)] p-6">
          {canPreview(file.type) ? (
            renderPreview()
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              {getFileIcon(file.type)}
              <p className="mt-4 text-sm">Aperçu non disponible</p>
              <Button 
                className="mt-4" 
                onClick={handleDownload}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger pour consulter
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}