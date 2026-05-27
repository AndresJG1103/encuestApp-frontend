import { apiFetch, extractError } from '../lib/api';
import type {
  Assignment,
  AssignmentStatus,
  CreateAssignmentInput,
  PaginatedResult,
  PaginationParams,
  UpdateAssignmentInput,
} from '../types';

export interface AssignmentFilters extends PaginationParams {
  formId?: string;
  userId?: string;
  status?: AssignmentStatus;
}

export type { Assignment } from '../types';

export const createAssignment = async (
  assignmentData: CreateAssignmentInput,
): Promise<Assignment> => {
  const res = await apiFetch('/assignments', {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al crear la asignación'));
  }

  const data = await res.json();
  return data.data;
};

export const getAssignments = async (
  params: AssignmentFilters = {},
): Promise<PaginatedResult<Assignment>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.formId) queryParams.append('formId', params.formId);
  if (params.userId) queryParams.append('userId', params.userId);
  if (params.status) queryParams.append('status', params.status);

  const res = await apiFetch(`/assignments?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener las asignaciones'));
  }
  const data = await res.json();
  return data.data;
};

export const updateAssignment = async (
  id: string,
  input: UpdateAssignmentInput,
): Promise<Assignment> => {
  const res = await apiFetch(`/assignments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al actualizar la asignación'));
  }
  const data = await res.json();
  return data.data;
};

export const getMyAssignments = async (
  params: PaginationParams = {},
): Promise<PaginatedResult<Assignment>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await apiFetch(`/assignments/my?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener mis asignaciones'));
  }
  const data = await res.json();
  return data.data;
};
