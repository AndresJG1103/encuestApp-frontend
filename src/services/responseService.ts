import { apiFetch, extractError } from '../lib/api';
import type {
  AnswerPayload,
  CompleteSessionResult,
  PaginatedResult,
  PaginationParams,
  ResponseSession,
} from '../types';

export type { ResponseSession } from '../types';

export const startSession = async (formId: string): Promise<ResponseSession> => {
  const res = await apiFetch('/responses/start', {
    method: 'POST',
    body: JSON.stringify({ formId }),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al iniciar la sesión'));
  }

  const data = await res.json();
  return data.data;
};

export const getSessionById = async (sessionId: string): Promise<ResponseSession> => {
  const res = await apiFetch(`/responses/${sessionId}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener la sesión'));
  }
  const data = await res.json();
  return data.data;
};

export const submitAnswer = async (
  sessionId: string,
  itemId: string,
  answer: AnswerPayload,
  timeSpentMs: number = 0,
): Promise<void> => {
  const res = await apiFetch(`/responses/${sessionId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ itemId, answer, timeSpentMs }),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al enviar la respuesta'));
  }
};

export const completeSession = async (sessionId: string): Promise<CompleteSessionResult> => {
  const res = await apiFetch(`/responses/${sessionId}/complete`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al completar la sesión'));
  }

  const data = await res.json();
  return data.data;
};

export const getMySessions = async (
  params: PaginationParams = {},
): Promise<PaginatedResult<ResponseSession>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await apiFetch(`/responses/my?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener mis sesiones'));
  }
  const data = await res.json();
  return data.data;
};
