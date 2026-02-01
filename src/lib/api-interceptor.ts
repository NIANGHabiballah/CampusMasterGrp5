import { API_CONFIG } from '@/lib/config';

const getTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  
  return authCookie ? authCookie.split('=')[1] : null;
};

export const createApiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const token = getTokenFromCookie();
  
  const config: RequestInit = {
    headers: {
      ...API_CONFIG.HEADERS,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      if (typeof document !== 'undefined') {
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      
      throw new Error('Session expired');
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const apiRequest = async <T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const response = await createApiRequest(endpoint, options);
  return response.json();
};

export const apiUpload = async <T = any>(
  endpoint: string,
  formData: FormData
): Promise<T> => {
  const token = getTokenFromCookie();
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error response:', errorText);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }
    
    const responseText = await response.text();
    console.log('Upload response:', responseText);
    
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Upload request failed:', error);
    throw error;
  }
};