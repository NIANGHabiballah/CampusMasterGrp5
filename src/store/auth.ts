import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { apiService } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
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
      isHydrated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await apiService.login(email, password);
          
          const user: User = {
            id: response.user.id.toString(),
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            role: response.user.role as UserRole,
            isActive: response.user.status === 'ACTIVE',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true });
        
        try {
          await apiService.register(userData);
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
          const updatedUser = { ...user, ...data };
          set({ user: updatedUser });
          return true;
        } catch (error) {
          return false;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          // TODO: Implement with backend API
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
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      }
    }
  )
);