import { apiFetch } from '../lib/api';

export interface DashboardMetrics {
  activeEmployees: number;
  totalSessions: number;
  totalRevenue: string;
  systemHealth: string;
  recentActivity: Array<{
    id: string;
    userName: string;
    formTitle: string;
    status: string;
    startedAt: string;
  }>;
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const res = await apiFetch('/reports/dashboard');
  if (!res.ok) {
    throw new Error('Error al obtener las métricas del dashboard');
  }
  const data = await res.json();
  return data.data;
};
