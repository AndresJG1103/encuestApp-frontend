import { apiFetch } from '../lib/api';
import { PaginatedResult } from './userService';

export interface Assignment {
  id: string;
  formId: string;
  userId: string;
  dueDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  form?: {
    title: string;
    type: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const createAssignment = async (assignmentData: any): Promise<Assignment> => {
  const res = await apiFetch('/assignments', {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al crear la asignación');
  }

  const data = await res.json();
  return data.data;
};

export const getMyAssignments = async (params: { page?: number; limit?: number } = {}): Promise<PaginatedResult<Assignment>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await apiFetch(`/assignments/my?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error('Error al obtener mis asignaciones');
  }
  const data = await res.json();
  return data.data;
};
