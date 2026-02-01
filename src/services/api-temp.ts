import { API_CONFIG } from '@/lib/config';

// Service API temporaire qui simule le back-end
class ApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async login(email: string, password: string) {
    await this.delay(500);
    
    // Simulation des utilisateurs
    const users = [
      { id: 1, email: 'admin@campus.sn', password: 'password', role: 'ADMIN', firstName: 'Admin', lastName: 'User', status: 'ACTIVE' },
      { id: 2, email: 'prof@campus.sn', password: 'password', role: 'TEACHER', firstName: 'Prof', lastName: 'Teacher', status: 'ACTIVE' },
      { id: 3, email: 'etudiant@campus.sn', password: 'password', role: 'STUDENT', firstName: 'Étudiant', lastName: 'Student', status: 'ACTIVE' }
    ];
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      token: `temp-token-${user.id}-${Date.now()}`
    };
  }

  async register(userData: any) {
    await this.delay(500);
    return { success: true, message: 'User registered successfully' };
  }

  async getUsers() {
    await this.delay(300);
    return [
      { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@campus.sn', role: 'ADMIN', status: 'ACTIVE' },
      { id: 2, firstName: 'Prof', lastName: 'Teacher', email: 'prof@campus.sn', role: 'TEACHER', status: 'ACTIVE' },
      { id: 3, firstName: 'Étudiant', lastName: 'Student', email: 'etudiant@campus.sn', role: 'STUDENT', status: 'ACTIVE' }
    ];
  }

  async updateUser(id: string, userData: any) {
    await this.delay(300);
    return { id, ...userData };
  }

  async deleteUser(id: string) {
    await this.delay(300);
    return { success: true };
  }

  async getCourses() {
    await this.delay(300);
    return [
      { id: 1, title: 'React Avancé', description: 'Cours React avancé', teacher: { id: 2, firstName: 'Prof', lastName: 'Teacher' } },
      { id: 2, title: 'Node.js Backend', description: 'Développement backend', teacher: { id: 2, firstName: 'Prof', lastName: 'Teacher' } }
    ];
  }

  async createCourse(courseData: any) {
    await this.delay(300);
    return { id: Date.now(), ...courseData };
  }

  async updateCourse(id: string, courseData: any) {
    await this.delay(300);
    return { id, ...courseData };
  }

  async deleteCourse(id: string) {
    await this.delay(300);
    return { success: true };
  }

  async getAssignments() {
    await this.delay(300);
    return [
      { id: 1, title: 'TP React', description: 'Travaux pratiques React', dueDate: '2024-12-31' },
      { id: 2, title: 'Projet Final', description: 'Projet de fin de module', dueDate: '2024-12-31' }
    ];
  }

  async createAssignment(assignmentData: any) {
    await this.delay(300);
    return { id: Date.now(), ...assignmentData };
  }

  async updateAssignment(id: string, assignmentData: any) {
    await this.delay(300);
    return { id, ...assignmentData };
  }

  async deleteAssignment(id: string) {
    await this.delay(300);
    return { success: true };
  }

  async getMessages() {
    await this.delay(300);
    return [
      { id: 1, subject: 'Bienvenue', content: 'Message de bienvenue', sender: 'Admin', isRead: false },
      { id: 2, subject: 'Cours annulé', content: 'Le cours de demain est annulé', sender: 'Prof', isRead: true }
    ];
  }

  async createMessage(messageData: any) {
    await this.delay(300);
    return { id: Date.now(), ...messageData };
  }

  async toggleMessageStar(messageId: string) {
    await this.delay(200);
    return { success: true };
  }

  async toggleMessageArchive(messageId: string) {
    await this.delay(200);
    return { success: true };
  }

  async markMessageAsRead(messageId: string) {
    await this.delay(200);
    return { success: true };
  }

  async getNotifications(userId: number) {
    await this.delay(300);
    return [
      { id: 1, title: 'Nouveau cours', message: 'Un nouveau cours a été ajouté', isRead: false },
      { id: 2, title: 'Devoir à rendre', message: 'N\'oubliez pas le devoir pour demain', isRead: true }
    ];
  }

  async getUnreadCount(userId: number) {
    await this.delay(200);
    return { count: 3 };
  }

  async markNotificationAsRead(notificationId: number) {
    await this.delay(200);
    return { success: true };
  }

  // Méthodes pour les autres endpoints
  async getForums() {
    await this.delay(300);
    return [{ id: 1, name: 'Forum Général', description: 'Discussions générales' }];
  }

  async getTopicsByForum(forumId: number) {
    await this.delay(300);
    return [{ id: 1, title: 'Sujet de test', replies: 5, views: 20 }];
  }

  async getTopicById(topicId: number) {
    await this.delay(300);
    return { id: topicId, title: 'Sujet de test', content: 'Contenu du sujet' };
  }

  async getPostsByTopic(topicId: number) {
    await this.delay(300);
    return [{ id: 1, content: 'Premier post', author: 'User' }];
  }

  async createPost(postData: any) {
    await this.delay(300);
    return { id: Date.now(), ...postData };
  }

  async likePost(postId: number) {
    await this.delay(200);
    return { success: true };
  }

  async incrementTopicViews(topicId: number) {
    await this.delay(200);
    return { success: true };
  }

  async likeTopic(topicId: number) {
    await this.delay(200);
    return { success: true };
  }

  async createTopic(topicData: any) {
    await this.delay(300);
    return { id: Date.now(), ...topicData };
  }

  async getSubmissionsByAssignment(assignmentId: string) {
    await this.delay(300);
    return [{ id: 1, studentName: 'Étudiant Test', submittedAt: new Date().toISOString() }];
  }

  async gradeSubmission(submissionId: string, gradeData: any) {
    await this.delay(300);
    return { id: submissionId, ...gradeData };
  }

  async createSubmission(submissionData: any) {
    await this.delay(300);
    return { id: Date.now(), ...submissionData };
  }

  async updateSubmission(id: string, submissionData: any) {
    await this.delay(300);
    return { id, ...submissionData };
  }

  async deleteSubmission(id: string) {
    await this.delay(300);
    return { success: true };
  }

  async uploadMaterials(courseId: string, files: File[]) {
    await this.delay(1000);
    return { success: true, files: files.map(f => ({ name: f.name, size: f.size })) };
  }
}

export const apiService = new ApiService();

// Export des méthodes individuelles pour compatibilité
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