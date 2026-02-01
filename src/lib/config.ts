export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
    APPROVE: (id: string) => `/api/users/${id}/approve`,
    SUSPEND: (id: string) => `/api/users/${id}/suspend`,
  },
  COURSES: {
    BASE: '/api/courses',
    BY_ID: (id: string) => `/api/courses/${id}`,
    STUDENTS: (id: string) => `/api/courses/${id}/students`,
    MATERIALS: (id: string) => `/api/courses/${id}/materials`,
  },
  ASSIGNMENTS: {
    BASE: '/api/assignments',
    BY_ID: (id: string) => `/api/assignments/${id}`,
    SUBMIT: (id: string) => `/api/assignments/${id}/submit`,
    GRADE: (id: string, submissionId: string) => `/api/assignments/${id}/submissions/${submissionId}/grade`,
  },
  MESSAGES: {
    BASE: '/api/messages',
    BY_ID: (id: string) => `/api/messages/${id}`,
    MARK_READ: (id: string) => `/api/messages/${id}/mark-read`,
    STAR: (id: string) => `/api/messages/${id}/star`,
    ARCHIVE: (id: string) => `/api/messages/${id}/archive`,
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    BY_USER: (userId: number) => `/api/notifications/user/${userId}`,
    UNREAD_COUNT: (userId: number) => `/api/notifications/user/${userId}/unread-count`,
    MARK_READ: (id: number) => `/api/notifications/${id}/mark-read`,
  },
  FORUMS: {
    BASE: '/api/forums',
    TOPICS: (forumId: number) => `/api/forums/${forumId}/topics`,
    TOPIC_BY_ID: (topicId: number) => `/api/topics/${topicId}`,
    POSTS: (topicId: number) => `/api/topics/${topicId}/posts`,
    CREATE_TOPIC: '/api/forums/topics',
    CREATE_POST: (topicId: number) => `/api/topics/${topicId}/posts`,
    LIKE_POST: (postId: number) => `/api/topics/posts/${postId}/like`,
    LIKE_TOPIC: (topicId: number) => `/api/topics/${topicId}/like`,
    VIEW_TOPIC: (topicId: number) => `/api/topics/${topicId}/view`,
  },
  SUBMISSIONS: {
    BASE: '/api/submissions',
    BY_ASSIGNMENT: (assignmentId: string) => `/api/submissions/assignment/${assignmentId}`,
    GRADE: (submissionId: string) => `/api/submissions/${submissionId}/grade`,
  },
  MATERIALS: {
    UPLOAD: (courseId: string) => `/api/materials/upload/${courseId}`,
  },
};