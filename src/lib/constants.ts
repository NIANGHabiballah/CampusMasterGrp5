// Routes constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  ASSIGNMENTS: '/assignments',
  GRADES: '/grades',
  MESSAGES: '/messages',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  NOTIFICATIONS: '/notifications',
  FORUMS: '/forums'
} as const;

// User roles
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER', 
  ADMIN: 'ADMIN'
} as const;

// Assignment status
export const ASSIGNMENT_STATUS = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED',
  LATE: 'LATE'
} as const;

// Message tags
export const MESSAGE_TAGS = {
  URGENT: 'urgent',
  ANNONCE: 'annonce',
  PROJET: 'projet',
  QUESTION: 'question',
  FEEDBACK: 'feedback',
  NOUVEAU: 'nouveau'
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  ASSIGNMENT: 'assignment',
  GRADE: 'grade',
  MESSAGE: 'message',
  ANNOUNCEMENT: 'announcement'
} as const;

// Course material types
export const MATERIAL_TYPES = {
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  LINK: 'LINK',
  IMAGE: 'IMAGE'
} as const;

// User status
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED'
} as const;

// Grade thresholds
export const GRADE_THRESHOLDS = {
  EXCELLENT: 16,
  GOOD: 14,
  AVERAGE: 12,
  POOR: 10
} as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  ASSIGNMENT: 10 * 1024 * 1024, // 10MB
  MATERIAL: 50 * 1024 * 1024 // 50MB
} as const;

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ARCHIVES: ['application/zip', 'application/x-rar-compressed']
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile'
  },
  COURSES: '/api/courses',
  ASSIGNMENTS: '/api/assignments',
  MESSAGES: '/api/messages',
  USERS: '/api/users',
  NOTIFICATIONS: '/api/notifications'
} as const;