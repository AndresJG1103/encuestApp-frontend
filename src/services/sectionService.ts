import { apiFetch, extractError } from '../lib/api';
import type {
  CreateSectionInput,
  Section,
  UpdateSectionInput,
} from '../types';

export type { Section } from '../types';
export type { Item } from '../types';

export const getSectionsByForm = async (formId: string): Promise<Section[]> => {
  const res = await apiFetch(`/forms/${formId}/sections`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener las secciones'));
  }
  const data = await res.json();
  return data.data;
};

export const createSection = async (
  formId: string,
  sectionData: CreateSectionInput,
): Promise<Section> => {
  const res = await apiFetch(`/forms/${formId}/sections`, {
    method: 'POST',
    body: JSON.stringify(sectionData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al crear la sección'));
  }

  const data = await res.json();
  return data.data;
};

export const updateSection = async (
  id: string,
  sectionData: UpdateSectionInput,
): Promise<Section> => {
  const res = await apiFetch(`/sections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(sectionData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al actualizar la sección'));
  }

  const data = await res.json();
  return data.data;
};

export const deleteSection = async (id: string): Promise<void> => {
  const res = await apiFetch(`/sections/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al eliminar la sección'));
  }
};

export const reorderItems = async (
  sectionId: string,
  orderedItemIds: string[],
): Promise<void> => {
  const res = await apiFetch(`/sections/${sectionId}/reorder-items`, {
    method: 'PATCH',
    body: JSON.stringify({ orderedItemIds }),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al reordenar los ítems'));
  }
};
