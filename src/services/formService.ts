import { apiFetch } from '../lib/api';
import { PaginatedResult } from './userService';

export interface Form {
  id: string;
  title: string;
  description?: string;
  type: 'SURVEY' | 'TRAINING';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  config: any;
  createdAt: string;
  updatedAt: string;
}

export const getForms = async (params: { page?: number; limit?: number; type?: string; status?: string } = {}): Promise<PaginatedResult<Form>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.type) queryParams.append('type', params.type);
  if (params.status) queryParams.append('status', params.status);

  const res = await apiFetch(`/forms?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error('Error al obtener los formularios');
  }
  const data = await res.json();
  return data.data;
};

export const createForm = async (formData: any): Promise<Form> => {
  const res = await apiFetch('/forms', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al crear el formulario');
  }

  const data = await res.json();
  return data.data;
};

export const getFormById = async (id: string): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}`);
  if (!res.ok) {
    throw new Error('Error al obtener el formulario');
  }
  const data = await res.json();
  return data.data;
};

export const updateForm = async (id: string, formData: any): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al actualizar el formulario');
  }

  const data = await res.json();
  return data.data;
};

export const publishForm = async (id: string): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}/publish`, {
    method: 'POST',
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al publicar el formulario');
  }

  const data = await res.json();
  return data.data;
};

export const duplicateForm = async (id: string): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}/duplicate`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Error al duplicar el formulario');
  }

  const data = await res.json();
  return data.data;
};

export const deleteForm = async (id: string): Promise<void> => {
  const res = await apiFetch(`/forms/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Error al eliminar el formulario');
  }
};
