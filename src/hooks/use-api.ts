import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Opération réussie',
    errorMessage = 'Une erreur est survenue'
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      
      if (showErrorToast) {
        toast.error(errorMsg);
      }
      
      throw error;
    }
  }, [apiFunction, showSuccessToast, showErrorToast, successMessage, errorMessage]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook spécialisé pour les mutations (POST, PUT, DELETE)
export function useMutation<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  return useApi(apiFunction, {
    showSuccessToast: true,
    showErrorToast: true,
    ...options,
  });
}

// Hook spécialisé pour les requêtes (GET)
export function useQuery<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  return useApi(apiFunction, {
    showSuccessToast: false,
    showErrorToast: true,
    ...options,
  });
}