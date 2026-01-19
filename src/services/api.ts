import { useAuthStore } from '@/store/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  private getHeaders(): HeadersInit {
    const token = useAuthStore.getState().token;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Courses endpoints
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  // Assignments endpoints
  async getAssignments(courseId?: string) {
    const endpoint = courseId ? `/assignments?course=${courseId}` : '/assignments';
    return this.request(endpoint);
  }

  async submitAssignment(assignmentId: string, formData: FormData) {
    const token = useAuthStore.getState().token;
    return fetch(`${API_BASE_URL}/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
  }

  // Messages endpoints
  async getMessages() {
    return this.request('/messages');
  }

  async sendMessage(messageData: any) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }
}

export const apiService = new ApiService();