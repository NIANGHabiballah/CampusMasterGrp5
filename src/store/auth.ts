import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  studentId?: string;
  department?: string;
}

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Système',
    email: 'admin@campus.fr',
    password: 'password',
    role: 'ADMIN',
    avatar: '/avatars/admin.jpg',
    department: 'Administration',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'Prof. Jean',
    lastName: 'Martin',
    email: 'prof@campus.fr',
    password: 'password',
    role: 'TEACHER',
    avatar: '/avatars/teacher.jpg',
    department: 'Informatique',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'etudiant@campus.fr',
    password: 'password',
    role: 'STUDENT',
    avatar: '/avatars/student.jpg',
    studentId: 'M2-2024-001',
    department: 'Informatique',
    semester: 'S1 2024',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Role permissions mapping
const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: [
    'manage_users',
    'manage_courses',
    'manage_assignments',
    'view_analytics',
    'manage_system',
    'moderate_content'
  ],
  TEACHER: [
    'create_courses',
    'manage_own_courses',
    'create_assignments',
    'grade_assignments',
    'view_students',
    'send_messages'
  ],
  STUDENT: [
    'view_courses',
    'submit_assignments',
    'view_grades',
    'send_messages',
    'download_materials'
  ]
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user = mockUsers.find(u => u.email === email && u.password === password);
          
          if (!user) {
            set({ isLoading: false });
            return false;
          }

          if (!user.isActive) {
            set({ isLoading: false });
            throw new Error('Compte désactivé');
          }

          const { password: _, ...userWithoutPassword } = user;
          const token = `mock-token-${user.id}-${Date.now()}`;
          
          set({
            user: {
              ...userWithoutPassword,
              lastLogin: new Date().toISOString()
            },
            token,
            isAuthenticated: true,
            isLoading: false
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          const existingUser = mockUsers.find(u => u.email === userData.email);
          if (existingUser) {
            throw new Error('Email déjà utilisé');
          }

          const newUser: User = {
            id: `user-${Date.now()}`,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
            studentId: userData.studentId,
            department: userData.department,
            isActive: userData.role === 'STUDENT', // Students need approval
            createdAt: new Date().toISOString()
          };

          // Add to mock database
          mockUsers.push({ ...newUser, password: userData.password });
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) return false;

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
          
          return true;
        } catch (error) {
          return false;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { user } = get();
        if (!user) return false;

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockUser = mockUsers.find(u => u.id === user.id);
          if (!mockUser || mockUser.password !== currentPassword) {
            throw new Error('Mot de passe actuel incorrect');
          }

          mockUser.password = newPassword;
          return true;
        } catch (error) {
          throw error;
        }
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        
        const permissions = rolePermissions[user.role] || [];
        return permissions.includes(permission);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);