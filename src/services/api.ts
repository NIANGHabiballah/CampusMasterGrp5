const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log('Request config:', config);
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Courses
  async getCourses() {
    return this.request('/courses');
  }

  async createCourse(courseData: any) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: string, courseData: any) {
    console.log('\n=== FRONTEND: updateCourse appelé ===');
    console.log('ID:', id);
    console.log('Données:', courseData);
    console.log('URL complète:', `${API_BASE_URL}/courses/${id}`);
    
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Assignments
  async getAssignments() {
    return this.request('/assignments');
  }

  async createAssignment(assignmentData: any) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async updateAssignment(id: string, assignmentData: any) {
    return this.request(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteAssignment(id: string) {
    return this.request(`/assignments/${id}`, {
      method: 'DELETE',
    });
  }

  // Forums
  async getForums() {
    return this.request('/forums');
  }

  async getTopicsByForum(forumId: number) {
    return this.request(`/forums/${forumId}/topics`);
  }

  async getTopicById(topicId: number) {
    return this.request(`/topics/${topicId}`);
  }

  async getPostsByTopic(topicId: number) {
    return this.request(`/topics/${topicId}/posts`);
  }

  async createPost(postData: any) {
    return this.request(`/topics/${postData.topicId}/posts`, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: number) {
    return this.request(`/topics/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async incrementTopicViews(topicId: number) {
    return this.request(`/topics/${topicId}/view`, {
      method: 'POST',
    });
  }

  async likeTopic(topicId: number) {
    return this.request(`/topics/${topicId}/like`, {
      method: 'POST',
    });
  }

  async createTopic(topicData: any) {
    return this.request('/forums/topics', {
      method: 'POST',
      body: JSON.stringify(topicData),
    });
  }

  // Submissions
  // Submissions
  async getSubmissionsByAssignment(assignmentId: string) {
    return this.request(`/submissions/assignment/${assignmentId}`);
  }

  async gradeSubmission(submissionId: string, gradeData: any) {
    return this.request(`/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  async createSubmission(submissionData: any) {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  }

  async updateSubmission(id: string, submissionData: any) {
    return this.request(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(submissionData),
    });
  }

  async deleteSubmission(id: string) {
    return this.request(`/submissions/${id}`, {
      method: 'DELETE',
    });
  }

  // Materials upload
  async uploadMaterials(courseId: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return fetch(`${API_BASE_URL}/materials/upload/${courseId}`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return response.json();
    });
  }
  async createMessage(messageData: any) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getMessages() {
    return this.request('/messages');
  }

  async toggleMessageStar(messageId: string) {
    return this.request(`/messages/${messageId}/star`, {
      method: 'POST',
    });
  }

  async toggleMessageArchive(messageId: string) {
    return this.request(`/messages/${messageId}/archive`, {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(userId: number) {
    return this.request(`/notifications/user/${userId}`);
  }

  async getUnreadCount(userId: number) {
    return this.request(`/notifications/user/${userId}/unread-count`);
  }

  async markNotificationAsRead(notificationId: number) {
    return this.request(`/notifications/${notificationId}/mark-read`, {
      method: 'PUT',
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/mark-read`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();

// Export individual methods for convenience
export const login = (email: string, password: string) => apiService.login(email, password);
export const register = (userData: any) => apiService.register(userData);
export const getUsers = () => apiService.getUsers();
export const updateUser = (id: string, userData: any) => apiService.updateUser(id, userData);
export const deleteUser = (id: string) => apiService.deleteUser(id);
export const getCourses = () => apiService.getCourses();
export const createCourse = (courseData: any) => apiService.createCourse(courseData);
export const updateCourse = (id: string, courseData: any) => apiService.updateCourse(id, courseData);
export const deleteCourse = (id: string) => apiService.deleteCourse(id);
export const getAssignments = () => apiService.getAssignments();
export const createAssignment = (assignmentData: any) => apiService.createAssignment(assignmentData);
export const updateAssignment = (id: string, assignmentData: any) => apiService.updateAssignment(id, assignmentData);
export const deleteAssignment = (id: string) => apiService.deleteAssignment(id);
export const getForums = () => apiService.getForums();
export const getTopicsByForum = (forumId: number) => apiService.getTopicsByForum(forumId);
export const getTopicById = (topicId: number) => apiService.getTopicById(topicId);
export const getPostsByTopic = (topicId: number) => apiService.getPostsByTopic(topicId);
export const createTopic = (topicData: any) => apiService.createTopic(topicData);
export const createPost = (postData: any) => apiService.createPost(postData);
export const likePost = (postId: number) => apiService.likePost(postId);
export const incrementTopicViews = (topicId: number) => apiService.incrementTopicViews(topicId);
export const likeTopic = (topicId: number) => apiService.likeTopic(topicId);
export const createSubmission = (submissionData: any) => apiService.createSubmission(submissionData);
export const updateSubmission = (id: string, submissionData: any) => apiService.updateSubmission(id, submissionData);
export const deleteSubmission = (id: string) => apiService.deleteSubmission(id);
export const createMessage = (messageData: any) => apiService.createMessage(messageData);
export const getMessages = () => apiService.getMessages();
export const toggleMessageStar = (messageId: string) => apiService.toggleMessageStar(messageId);
export const toggleMessageArchive = (messageId: string) => apiService.toggleMessageArchive(messageId);
export const getNotifications = (userId: number) => apiService.getNotifications(userId);
export const getUnreadCount = (userId: number) => apiService.getUnreadCount(userId);
export const markNotificationAsRead = (notificationId: number) => apiService.markNotificationAsRead(notificationId);
export const markMessageAsRead = (messageId: string) => apiService.markMessageAsRead(messageId);