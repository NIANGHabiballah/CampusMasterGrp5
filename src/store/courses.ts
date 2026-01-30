import { create } from 'zustand';
import { apiService } from '@/services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface CourseState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const courses = await apiService.getCourses();
      set({ courses, isLoading: false });
    } catch (error) {
      set({ error: 'Erreur lors du chargement des cours', isLoading: false });
    }
  },
}));