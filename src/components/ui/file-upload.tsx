'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function FileUpload({ 
  onFilesSelected, 
  maxFiles = 5, 
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.zip'],
  className = ''
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      console.error('Fichiers rejetés:', rejectedFiles);
    }

    // Process accepted files
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });

    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>)
  });

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => 
        prev.map(file => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100);
            const isComplete = newProgress >= 100;
            
            return {
              ...file,
              progress: newProgress,
              status: isComplete ? 'success' : 'uploading'
            };
          }
          return file;
        })
      );
    }, 500);

    // Stop simulation after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, progress: 100, status: 'success' }
            : file
        )
      );
    }, 3000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'zip':
      case 'rar':
        return <File className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-academic-400 transition-colors">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer ${
              isDragActive ? 'text-academic-600' : 'text-gray-600'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`h-12 w-12 mx-auto mb-4 ${
              isDragActive ? 'text-academic-600' : 'text-gray-400'
            }`} />
            
            {isDragActive ? (
              <p className="text-lg font-medium">Déposez les fichiers ici...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ou cliquez pour sélectionner
                </p>
                <Button variant="outline" type="button">
                  Choisir des fichiers
                </Button>
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Maximum {maxFiles} fichiers • Taille max: {formatFileSize(maxSize)}</p>
              <p>Formats acceptés: PDF, DOC, DOCX, ZIP, Images</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-4">
              Fichiers ({uploadedFiles.length})
            </h4>
            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getFileIcon(uploadedFile.file.name)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(uploadedFile.status)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(uploadedFile.file.size)}</span>
                      <Badge variant="outline" className="text-xs">
                        {uploadedFile.status === 'uploading' && 'Envoi...'}
                        {uploadedFile.status === 'success' && 'Terminé'}
                        {uploadedFile.status === 'error' && 'Erreur'}
                      </Badge>
                    </div>
                    
                    {uploadedFile.status === 'uploading' && (
                      <Progress 
                        value={uploadedFile.progress} 
                        className="h-1 mt-2"
                      />
                    )}
                    
                    {uploadedFile.error && (
                      <p className="text-xs text-red-500 mt-1">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}