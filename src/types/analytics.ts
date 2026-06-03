export interface RecentActivityEntry {
  id: string;
  userName: string;
  formTitle: string;
  status: string;
  startedAt: string;
}

export interface DashboardMetrics {
  activeEmployees: number;
  totalSessions: number;
  totalRevenue: string;
  systemHealth: string;
  recentActivity: RecentActivityEntry[];
}

export interface FormSummary {
  total: number;
  completed: number;
  passed: number;
  avgScore: number;
}

export interface QuestionAnalytics {
  itemId: string;
  correctCount: number;
  incorrectCount: number;
  totalAnswers: number;
}

export interface UserProgressEntry {
  userId: string;
  status: string;
  score: number | null;
  completedAt: string | null;
}

export interface TimeAnalytics {
  avgTimeMs: number;
  abandonedCount: number;
  completedCount: number;
}
