import { useState } from 'react';
import { z } from 'zod';

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const validate = (data: any): data is z.infer<T> => {
    try {
      schema.parse(data);
      setErrors({});
      setIsValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(newErrors);
      }
      setIsValid(false);
      return false;
    }
  };

  const getFieldError = (fieldName: string) => errors[fieldName];
  const hasFieldError = (fieldName: string) => !!errors[fieldName];

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  return {
    validate,
    errors,
    isValid,
    getFieldError,
    hasFieldError,
    clearErrors
  };
}

// Common validation schemas
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court')
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mots de passe différents',
  path: ['confirmPassword']
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Titre requis'),
  description: z.string().min(10, 'Description trop courte'),
  credits: z.number().min(1).max(12, 'Crédits invalides'),
  semester: z.string().min(1, 'Semestre requis')
});

export const assignmentSchema = z.object({
  title: z.string().min(3, 'Titre requis'),
  description: z.string().min(10, 'Description requise'),
  dueDate: z.string().min(1, 'Date limite requise'),
  maxPoints: z.number().min(1, 'Points maximum requis')
});