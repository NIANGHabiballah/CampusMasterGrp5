import { API_CONFIG, ENDPOINTS } from '@/lib/config';

// API Service with complete CRUD operations
class ApiService {
  private baseUrl = API_CONFIG.BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...API_CONFIG.HEADERS,
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
      this.request(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: any) =>
      this.request(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    logout: () =>
      this.request(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' }),
    
    getProfile: () =>
      this.request(ENDPOINTS.AUTH.PROFILE),
  };

  // Users endpoints
  users = {
    getAll: (params?: any) =>
      this.request(`${ENDPOINTS.USERS.BASE}${params ? `?${new URLSearchParams(params)}` : ''}`),
    
    getById: (id: string) =>
      this.request(ENDPOINTS.USERS.BY_ID(id)),
    
    update: (id: string, data: any) =>
      this.request(ENDPOINTS.USERS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(ENDPOINTS.USERS.BY_ID(id), { method: 'DELETE' }),
    
    approve: (id: string) =>
      this.request(ENDPOINTS.USERS.APPROVE(id), { method: 'POST' }),
    
    suspend: (id: string) =>
      this.request(ENDPOINTS.USERS.SUSPEND(id), { method: 'POST' }),
  };

  // Courses endpoints
  courses = {
    getAll: (filters?: any) =>
      this.request(`${ENDPOINTS.COURSES.BASE}${filters ? `?${new URLSearchParams(filters)}` : ''}`),
    
    getById: (id: string) =>
      this.request(ENDPOINTS.COURSES.BY_ID(id)),
    
    create: (courseData: any) =>
      this.request(ENDPOINTS.COURSES.BASE, {
        method: 'POST',
        body: JSON.stringify(courseData),
      }),
    
    update: (id: string, data: any) =>
      this.request(ENDPOINTS.COURSES.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(ENDPOINTS.COURSES.BY_ID(id), { method: 'DELETE' }),
    
    getStudents: (id: string) =>
      this.request(ENDPOINTS.COURSES.STUDENTS(id)),
    
    getMaterials: (id: string) =>
      this.request(ENDPOINTS.COURSES.MATERIALS(id)),
  };

  // Assignments endpoints
  assignments = {
    getAll: (params?: any) =>
      this.request(`${ENDPOINTS.ASSIGNMENTS.BASE}${params ? `?${new URLSearchParams(params)}` : ''}`),
    
    getById: (id: string) =>
      this.request(ENDPOINTS.ASSIGNMENTS.BY_ID(id)),
    
    create: (data: any) =>
      this.request(ENDPOINTS.ASSIGNMENTS.BASE, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      this.request(ENDPOINTS.ASSIGNMENTS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    
    delete: (id: string) =>
      this.request(ENDPOINTS.ASSIGNMENTS.BY_ID(id), { method: 'DELETE' }),
    
    submit: (id: string, submission: any) =>
      this.request(ENDPOINTS.ASSIGNMENTS.SUBMIT(id), {
        method: 'POST',
        body: JSON.stringify(submission),
      }),
    
    grade: (id: string, submissionId: string, grade: any) =>
      this.request(ENDPOINTS.ASSIGNMENTS.GRADE(id, submissionId), {
        method: 'POST',
        body: JSON.stringify(grade),
      }),
  };

  // Messages endpoints
  messages = {
    getAll: (params?: any) =>
      this.request(`${ENDPOINTS.MESSAGES.BASE}${params ? `?${new URLSearchParams(params)}` : ''}`),
    
    getById: (id: string) =>
      this.request(ENDPOINTS.MESSAGES.BY_ID(id)),
    
    send: (messageData: any) =>
      this.request(ENDPOINTS.MESSAGES.BASE, {
        method: 'POST',
        body: JSON.stringify(messageData),
      }),
    
    markAsRead: (id: string) =>
      this.request(ENDPOINTS.MESSAGES.MARK_READ(id), { method: 'POST' }),
    
    delete: (id: string) =>
      this.request(ENDPOINTS.MESSAGES.BY_ID(id), { method: 'DELETE' }),
  };

  // Notifications endpoints
  notifications = {
    getAll: () =>
      this.request(ENDPOINTS.NOTIFICATIONS.BASE),
    
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