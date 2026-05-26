import { apiFetch } from '../lib/api';

export interface ResponseSession {
  id: string;
  formId: string;
  userId: string;
  attempt: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  score?: number;
  passed?: boolean;
  startedAt: string;
  completedAt?: string;
  form?: {
    id: string;
    title: string;
    type: string;
  };
}

export const startSession = async (formId: string): Promise<ResponseSession> => {
  const res = await apiFetch('/responses/start', {
    method: 'POST',
    body: JSON.stringify({ formId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al iniciar la sesión');
  }

  const data = await res.json();
  return data.data;
};

export const submitAnswer = async (sessionId: string, itemId: string, answer: any, timeSpentMs: number = 0): Promise<void> => {
  const res = await apiFetch(`/responses/${sessionId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ itemId, answer, timeSpentMs }),
  });

  if (!res.ok) {
    throw new Error('Error al enviar la respuesta');
  }
};

export const completeSession = async (sessionId: string): Promise<any> => {
  const res = await apiFetch(`/responses/${sessionId}/complete`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Error al completar la sesión');
  }

  const data = await res.json();
  return data.data;
};

export const getMySessions = async (params: { page?: number; limit?: number } = {}): Promise<any> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await apiFetch(`/responses/my?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error('Error al obtener mis sesiones');
  }
  const data = await res.json();
  return data.data;
};
