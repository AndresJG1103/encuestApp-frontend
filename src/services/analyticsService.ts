import { apiFetch, extractError } from '../lib/api';
import type {
  DashboardMetrics,
  FormSummary,
  QuestionAnalytics,
  TimeAnalytics,
  UserProgressEntry,
} from '../types';

export type { DashboardMetrics } from '../types';

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const res = await apiFetch('/reports/dashboard');
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener las métricas del dashboard'));
  }
  const data = await res.json();
  return data.data;
};

export const getFormSummary = async (formId: string): Promise<FormSummary> => {
  const res = await apiFetch(`/reports/forms/${formId}/summary`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener el resumen del formulario'));
  }
  const data = await res.json();
  return data.data;
};

export const getQuestionAnalytics = async (formId: string): Promise<QuestionAnalytics[]> => {
  const res = await apiFetch(`/reports/forms/${formId}/questions`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener analíticas de preguntas'));
  }
  const data = await res.json();
  return data.data;
};

export const getUserProgress = async (formId: string): Promise<UserProgressEntry[]> => {
  const res = await apiFetch(`/reports/forms/${formId}/users`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener progreso de usuarios'));
  }
  const data = await res.json();
  return data.data;
};

export const getTimeAnalytics = async (formId: string): Promise<TimeAnalytics> => {
  const res = await apiFetch(`/reports/forms/${formId}/time`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener analíticas de tiempo'));
  }
  const data = await res.json();
  return data.data;
};
