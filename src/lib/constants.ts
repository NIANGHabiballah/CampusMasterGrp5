// Constantes de l'application CampusMaster
export const APP_NAME = "CampusMaster";
export const APP_DESCRIPTION = "Plateforme pédagogique avancée pour étudiants de Master 2";

// Rôles utilisateurs
export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
} as const;

// Routes de l'application
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
  ADMIN: '/admin'
} as const;

// Couleurs du thème bleu académique
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  }
} as const;