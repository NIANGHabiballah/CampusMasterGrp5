import { create } from 'zustand';

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalAssignments: number;
  averageGrade: number;
  submissionRate: number;
  activeUsers: number;
  pendingApprovals: number;
}

interface GradeDistribution {
  range: string;
  count: number;
  percentage: number;
}

interface ActivityData {
  date: string;
  logins: number;
  submissions: number;
  downloads: number;
}

interface CoursePerformance {
  courseId: string;
  courseName: string;
  averageGrade: number;
  submissionRate: number;
  studentCount: number;
}

interface DashboardState {
  stats: DashboardStats;
  gradeDistribution: GradeDistribution[];
  activityData: ActivityData[];
  coursePerformance: CoursePerformance[];
  isLoading: boolean;
  error: string | null;
  
  fetchDashboardData: () => Promise<void>;
  fetchActivityData: (period: '7d' | '30d' | '90d') => Promise<void>;
  fetchCoursePerformance: () => Promise<void>;
}

// Mock data generators
const generateActivityData = (days: number): ActivityData[] => {
  const data: ActivityData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      logins: Math.floor(Math.random() * 50) + 20,
      submissions: Math.floor(Math.random() * 15) + 5,
      downloads: Math.floor(Math.random() * 30) + 10
    });
  }
  
  return data;
};

const mockStats: DashboardStats = {
  totalStudents: 156,
  totalCourses: 12,
  totalAssignments: 48,
  averageGrade: 14.2,
  submissionRate: 87.5,
  activeUsers: 142,
  pendingApprovals: 8
};

const mockGradeDistribution: GradeDistribution[] = [
  { range: '0-5', count: 3, percentage: 2.1 },
  { range: '6-8', count: 12, percentage: 8.4 },
  { range: '9-11', count: 28, percentage: 19.6 },
  { range: '12-14', count: 45, percentage: 31.5 },
  { range: '15-17', count: 38, percentage: 26.6 },
  { range: '18-20', count: 17, percentage: 11.9 }
];

const mockCoursePerformance: CoursePerformance[] = [
  {
    courseId: '1',
    courseName: 'React Avancé',
    averageGrade: 15.2,
    submissionRate: 92.3,
    studentCount: 28
  },
  {
    courseId: '2',
    courseName: 'Node.js Backend',
    averageGrade: 13.8,
    submissionRate: 85.7,
    studentCount: 25
  },
  {
    courseId: '3',
    courseName: 'Base de Données',
    averageGrade: 14.5,
    submissionRate: 88.9,
    studentCount: 30
  },
  {
    courseId: '4',
    courseName: 'Architecture Logicielle',
    averageGrade: 13.2,
    submissionRate: 82.1,
    studentCount: 22
  }
];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: mockStats,
  gradeDistribution: mockGradeDistribution,
  activityData: generateActivityData(7),
  coursePerformance: mockCoursePerformance,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate some dynamic data
      const updatedStats = {
        ...mockStats,
        activeUsers: Math.floor(Math.random() * 20) + 130,
        submissionRate: Math.floor(Math.random() * 10) + 85,
        averageGrade: Math.round((Math.random() * 2 + 13) * 10) / 10
      };
      
      set({ 
        stats: updatedStats,
        gradeDistribution: mockGradeDistribution,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Erreur lors du chargement des statistiques',
        isLoading: false 
      });
    }
  },

  fetchActivityData: async (period: '7d' | '30d' | '90d') => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const activityData = generateActivityData(days);
      
      set({ 
        activityData,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Erreur lors du chargement des données d\'activité',
        isLoading: false 
      });
    }
  },

  fetchCoursePerformance: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Add some variation to the data
      const updatedPerformance = mockCoursePerformance.map(course => ({
        ...course,
        averageGrade: Math.round((course.averageGrade + (Math.random() - 0.5) * 2) * 10) / 10,
        submissionRate: Math.round((course.submissionRate + (Math.random() - 0.5) * 10) * 10) / 10
      }));
      
      set({ 
        coursePerformance: updatedPerformance,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Erreur lors du chargement des performances des cours',
        isLoading: false 
      });
    }
  }
}));

// Export types for use in components
export type { DashboardStats, GradeDistribution, ActivityData, CoursePerformance };