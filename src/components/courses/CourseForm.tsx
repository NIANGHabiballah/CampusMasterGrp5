'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormValidation, courseSchema } from '@/hooks/use-form-validation';
import { toast } from 'sonner';

interface CourseFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function CourseForm({ onSubmit, initialData }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    credits: initialData?.credits || 6,
    semester: initialData?.semester || ''
  });

  const { validate, getFieldError, hasFieldError } = useFormValidation(courseSchema);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate(formData)) {
      onSubmit(formData);
      toast.success('Cours sauvegardé');
    } else {
      toast.error('Veuillez corriger les erreurs');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre du cours</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={hasFieldError('title') ? 'border-red-500' : ''}
        />
        {hasFieldError('title') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('title')}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={hasFieldError('description') ? 'border-red-500' : ''}
          rows={3}
        />
        {hasFieldError('description') && (
          <p className="text-sm text-red-500 mt-1">{getFieldError('description')}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="credits">Crédits ECTS</Label>
          <Input
            id="credits"
            type="number"
            min="1"
            max="12"
            value={formData.credits}
            onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
            className={hasFieldError('credits') ? 'border-red-500' : ''}
          />
          {hasFieldError('credits') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('credits')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="semester">Semestre</Label>
          <Select 
            value={formData.semester} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
          >
            <SelectTrigger className={hasFieldError('semester') ? 'border-red-500' : ''}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S1">Semestre 1</SelectItem>
              <SelectItem value="S2">Semestre 2</SelectItem>
              <SelectItem value="S3">Semestre 3</SelectItem>
              <SelectItem value="S4">Semestre 4</SelectItem>
            </SelectContent>
          </Select>
          {hasFieldError('semester') && (
            <p className="text-sm text-red-500 mt-1">{getFieldError('semester')}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Sauvegarder
      </Button>
    </form>
  );
}