import { apiFetch, extractError } from '../lib/api';
import type {
  CreateFormInput,
  Form,
  FormFilters,
  PaginatedResult,
  UpdateFormInput,
} from '../types';

export type { Form } from '../types';

export const getForms = async (params: FormFilters = {}): Promise<PaginatedResult<Form>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.type) queryParams.append('type', params.type);
  if (params.status) queryParams.append('status', params.status);

  const res = await apiFetch(`/forms?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener los formularios'));
  }
  const data = await res.json();
  return data.data;
};

export const createForm = async (formData: CreateFormInput): Promise<Form> => {
  const res = await apiFetch('/forms', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al crear el formulario'));
  }

  const data = await res.json();
  return data.data;
};

export const getFormById = async (id: string): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener el formulario'));
  }
  const data = await res.json();
  return data.data;
};

export const updateForm = async (id: string, formData: UpdateFormInput): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al actualizar el formulario'));
  }

  const data = await res.json();
  return data.data;
};

export const publishForm = async (id: string): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}/publish`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al publicar el formulario'));
  }

  const data = await res.json();
  return data.data;
};

export const duplicateForm = async (id: string): Promise<Form> => {
  const res = await apiFetch(`/forms/${id}/duplicate`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al duplicar el formulario'));
  }

  const data = await res.json();
  return data.data;
};

export const archiveForm = async (id: string): Promise<void> => {
  const res = await apiFetch(`/forms/${id}/archive`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al archivar el formulario'));
  }
};

export const deleteForm = async (id: string): Promise<void> => {
  const res = await apiFetch(`/forms/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al eliminar el formulario'));
  }
};
