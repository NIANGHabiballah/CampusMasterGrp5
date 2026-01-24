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
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `API Error: ${response.status}`);
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
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password,
        role: userData.role || 'STUDENT'
      })
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Courses endpoints
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  async createCourse(courseData: any) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }

  // Assignments endpoints
  async getAssignments(courseId?: string) {
    const endpoint = courseId ? `/assignments?course=${courseId}` : '/assignments';
    return this.request(endpoint);
  }

  async createAssignment(assignmentData: any) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData)
    });
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

  // Users endpoints (admin)
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(userId: string, userData: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(userId: string) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }
}

export const apiService = new ApiService();