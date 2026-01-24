// API Service with complete CRUD operations
class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: any) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    logout: () =>
      this.request('/auth/logout', { method: 'POST' }),
    
    getProfile: () =>
      this.request('/auth/profile'),
  };

  // Users endpoints
  users = {
    getAll: (params?: any) =>
      this.request(`/users${params ? `?${new URLSearchParams(params)}` : ''}`),
    
    getById: (id: string) =>
      this.request(`/users/${id}`),
    
    update: (id: string, data: any) =>
      this.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(`/users/${id}`, { method: 'DELETE' }),
    
    approve: (id: string) =>
      this.request(`/users/${id}/approve`, { method: 'POST' }),
    
    suspend: (id: string) =>
      this.request(`/users/${id}/suspend`, { method: 'POST' }),
  };

  // Courses endpoints
  courses = {
    getAll: (filters?: any) =>
      this.request(`/courses${filters ? `?${new URLSearchParams(filters)}` : ''}`),
    
    getById: (id: string) =>
      this.request(`/courses/${id}`),
    
    create: (courseData: any) =>
      this.request('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      }),
    
    update: (id: string, data: any) =>
      this.request(`/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(`/courses/${id}`, { method: 'DELETE' }),
    
    getStudents: (id: string) =>
      this.request(`/courses/${id}/students`),
    
    getMaterials: (id: string) =>
      this.request(`/courses/${id}/materials`),
  };

  // Assignments endpoints
  assignments = {
    getAll: (params?: any) =>
      this.request(`/assignments${params ? `?${new URLSearchParams(params)}` : ''}`),
    
    getById: (id: string) =>
      this.request(`/assignments/${id}`),
    
    create: (data: any) =>
      this.request('/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      this.request(`/assignments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(`/assignments/${id}`, { method: 'DELETE' }),
    
    submit: (id: string, submission: any) =>
      this.request(`/assignments/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify(submission),
      }),
    
    grade: (id: string, submissionId: string, grade: any) =>
      this.request(`/assignments/${id}/submissions/${submissionId}/grade`, {
        method: 'POST',
        body: JSON.stringify(grade),
      }),
  };

  // Messages endpoints
  messages = {
    getAll: (params?: any) =>
      this.request(`/messages${params ? `?${new URLSearchParams(params)}` : ''}`),
    
    getById: (id: string) =>
      this.request(`/messages/${id}`),
    
    send: (messageData: any) =>
      this.request('/messages', {
        method: 'POST',
        body: JSON.stringify(messageData),
      }),
    
    markAsRead: (id: string) =>
      this.request(`/messages/${id}/read`, { method: 'POST' }),
    
    delete: (id: string) =>
      this.request(`/messages/${id}`, { method: 'DELETE' }),
  };

  // Notifications endpoints
  notifications = {
    getAll: () =>
      this.request('/notifications'),
    
    markAsRead: (id: string) =>
      this.request(`/notifications/${id}/read`, { method: 'POST' }),
    
    markAllAsRead: () =>
      this.request('/notifications/read-all', { method: 'POST' }),
    
    delete: (id: string) =>
      this.request(`/notifications/${id}`, { method: 'DELETE' }),
  };

  // Grades endpoints
  grades = {
    getAll: (params?: any) =>
      this.request(`/grades${params ? `?${new URLSearchParams(params)}` : ''}`),
    
    getByStudent: (studentId: string) =>
      this.request(`/grades/student/${studentId}`),
    
    getByCourse: (courseId: string) =>
      this.request(`/grades/course/${courseId}`),
    
    getStatistics: () =>
      this.request('/grades/statistics'),
  };

  // Files endpoints
  files = {
    upload: async (file: File, type: string = 'general') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      return fetch(`${this.baseUrl}/files/upload`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
    },
    
    delete: (id: string) =>
      this.request(`/files/${id}`, { method: 'DELETE' }),
    
    getDownloadUrl: (id: string) =>
      `${this.baseUrl}/files/${id}/download`,
  };

  // Analytics endpoints
  analytics = {
    getDashboard: () =>
      this.request('/analytics/dashboard'),
    
    getUserStats: () =>
      this.request('/analytics/users'),
    
    getCourseStats: () =>
      this.request('/analytics/courses'),
    
    getSystemMetrics: () =>
      this.request('/analytics/system'),
  };
}

export const apiService = new ApiService();
export default apiService;