import { API_CONFIG, ENDPOINTS } from '@/lib/config';
import { apiRequest, apiUpload } from '@/lib/api-interceptor';

class ApiService {
  // Auth
  async login(email: string, password: string) {
    return apiRequest(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return apiRequest(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Users
  async getUsers() {
    return apiRequest(ENDPOINTS.USERS.BASE);
  }

  async updateUser(id: string, userData: any) {
    return apiRequest(ENDPOINTS.USERS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async approveUser(id: string) {
    return apiRequest(ENDPOINTS.USERS.APPROVE(id), {
      method: 'PUT',
    });
  }

  async suspendUser(id: string) {
    return apiRequest(ENDPOINTS.USERS.SUSPEND(id), {
      method: 'PUT',
    });
  }

  async deleteUser(id: string) {
    return apiRequest(ENDPOINTS.USERS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Courses
  async getCourses() {
    return apiRequest(ENDPOINTS.COURSES.BASE);
  }

  async getCourseById(id: string) {
    return apiRequest(ENDPOINTS.COURSES.BY_ID(id));
  }

  async createCourse(courseData: any) {
    return apiRequest(ENDPOINTS.COURSES.BASE, {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: string, courseData: any) {
    console.log('\n=== FRONTEND: updateCourse appelé ===');
    console.log('ID:', id);
    console.log('Données:', courseData);
    console.log('URL complète:', `${API_CONFIG.BASE_URL}${ENDPOINTS.COURSES.BY_ID(id)}`);
    
    return apiRequest(ENDPOINTS.COURSES.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id: string) {
    console.log('\n=== FRONTEND: deleteCourse appelé ===');
    console.log('ID:', id);
    console.log('URL complète:', `${API_CONFIG.BASE_URL}${ENDPOINTS.COURSES.BY_ID(id)}`);
    
    return apiRequest(ENDPOINTS.COURSES.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Assignments
  async getAssignments() {
    return apiRequest(ENDPOINTS.ASSIGNMENTS.BASE);
  }

  async createAssignment(assignmentData: any) {
    return apiRequest(ENDPOINTS.ASSIGNMENTS.BASE, {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async updateAssignment(id: string, assignmentData: any) {
    return apiRequest(ENDPOINTS.ASSIGNMENTS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteAssignment(id: string) {
    return apiRequest(ENDPOINTS.ASSIGNMENTS.BY_ID(id), {
      method: 'DELETE',
    });
  }

  // Forums
  async getForums() {
    return apiRequest(ENDPOINTS.FORUMS.BASE);
  }

  async getTopicsByForum(forumId: number) {
    return apiRequest(ENDPOINTS.FORUMS.TOPICS(forumId));
  }

  async getTopicById(topicId: number) {
    return apiRequest(ENDPOINTS.FORUMS.TOPIC_BY_ID(topicId));
  }

  async getPostsByTopic(topicId: number) {
    return apiRequest(ENDPOINTS.FORUMS.POSTS(topicId));
  }

  async createPost(postData: any) {
    return apiRequest(ENDPOINTS.FORUMS.CREATE_POST(postData.topicId), {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: number) {
    return apiRequest(ENDPOINTS.FORUMS.LIKE_POST(postId), {
      method: 'POST',
    });
  }

  async incrementTopicViews(topicId: number) {
    return apiRequest(ENDPOINTS.FORUMS.VIEW_TOPIC(topicId), {
      method: 'POST',
    });
  }

  async likeTopic(topicId: number) {
    return apiRequest(ENDPOINTS.FORUMS.LIKE_TOPIC(topicId), {
      method: 'POST',
    });
  }

  async createTopic(topicData: any) {
    return apiRequest(ENDPOINTS.FORUMS.CREATE_TOPIC, {
      method: 'POST',
      body: JSON.stringify(topicData),
    });
  }

  // Submissions
  async getSubmissionsByAssignment(assignmentId: string) {
    return apiRequest(ENDPOINTS.SUBMISSIONS.BY_ASSIGNMENT(assignmentId));
  }

  async gradeSubmission(submissionId: string, gradeData: any) {
    return apiRequest(ENDPOINTS.SUBMISSIONS.GRADE(submissionId), {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  async createSubmission(assignmentId: string, studentId: string, content: string, files: File[]) {
    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('studentId', studentId);
    if (content) {
      formData.append('content', content);
    }
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return apiUpload('/api/submissions', formData);
  }

  async updateSubmission(id: string, submissionData: any) {
    return apiRequest(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(submissionData),
    });
  }

  async deleteSubmission(id: string) {
    return apiRequest(`/submissions/${id}`, {
      method: 'DELETE',
    });
  }

  // Materials upload
  async uploadMaterials(courseId: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return apiUpload(ENDPOINTS.MATERIALS.UPLOAD(courseId), formData);
  }

  async createMessage(messageData: any) {
    return apiRequest(ENDPOINTS.MESSAGES.BASE, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getMessages() {
    return apiRequest(ENDPOINTS.MESSAGES.BASE);
  }

  async toggleMessageStar(messageId: string) {
    return apiRequest(ENDPOINTS.MESSAGES.STAR(messageId), {
      method: 'POST',
    });
  }

  async toggleMessageArchive(messageId: string) {
    return apiRequest(ENDPOINTS.MESSAGES.ARCHIVE(messageId), {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(userId: number) {
    return apiRequest(ENDPOINTS.NOTIFICATIONS.BY_USER(userId));
  }

  async getUnreadCount(userId: number) {
    return apiRequest(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT(userId));
  }

  async markNotificationAsRead(notificationId: number) {
    try {
      return await apiRequest(ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId), {
        method: 'PUT',
      });
    } catch (error) {
      console.warn('Erreur markNotificationAsRead:', error);
      // Retourner une réponse simulée pour éviter l'erreur
      return { success: true };
    }
  }

  async markMessageAsRead(messageId: string) {
    try {
      return await apiRequest(ENDPOINTS.MESSAGES.MARK_READ(messageId), {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Erreur markMessageAsRead:', error);
      return { success: true };
    }
  }

  async getMaterialsByCourse(courseId: string) {
    return apiRequest(ENDPOINTS.MATERIALS.BY_COURSE(courseId));
  }

  async downloadMaterial(materialId: string) {
    return apiRequest(ENDPOINTS.MATERIALS.DOWNLOAD(materialId));
  }

  // Announcements
  async getAnnouncements() {
    return apiRequest(ENDPOINTS.ANNOUNCEMENTS.BASE);
  }

  async getAnnouncementsByAuthor(authorId: string) {
    return apiRequest(ENDPOINTS.ANNOUNCEMENTS.BY_AUTHOR(authorId));
  }

  async createAnnouncement(announcementData: any) {
    return apiRequest(ENDPOINTS.ANNOUNCEMENTS.BASE, {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  }

  async updateAnnouncement(id: string, announcementData: any) {
    return apiRequest(ENDPOINTS.ANNOUNCEMENTS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  }

  async deleteAnnouncement(id: string) {
    return apiRequest(ENDPOINTS.ANNOUNCEMENTS.BY_ID(id), {
      method: 'DELETE',
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