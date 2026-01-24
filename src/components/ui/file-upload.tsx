'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Validate file size
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`Fichier(s) trop volumineux. Taille max: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(acceptedFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
      
      toast.success(`${acceptedFiles.length} fichier(s) uploadé(s) avec succès`);
      
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
      
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple,
    maxSize
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-academic-500 bg-academic-50'
            : 'border-gray-300 hover:border-academic-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-academic-600">Déposez les fichiers ici...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Glissez-déposez vos fichiers ici, ou{' '}
              <span className="text-academic-600 font-medium">cliquez pour parcourir</span>
            </p>
            <p className="text-xs text-gray-500">
              Formats acceptés: {acceptedTypes.join(', ')} • Max {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Upload en cours...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Fichiers uploadés:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}