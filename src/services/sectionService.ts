import { apiFetch } from '../lib/api';

export interface Section {
  id: string;
  formId: string;
  title: string;
  order: number;
  branchingRules: any[];
  items?: Item[];
}

export interface Item {
  id: string;
  sectionId: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'PDF' | 'QUESTION';
  order: number;
  content: any;
}

export const getSectionsByForm = async (formId: string): Promise<Section[]> => {
  const res = await apiFetch(`/forms/${formId}/sections`);
  if (!res.ok) {
    throw new Error('Error al obtener las secciones');
  }
  const data = await res.json();
  return data.data;
};

export const createSection = async (formId: string, sectionData: any): Promise<Section> => {
  const res = await apiFetch(`/forms/${formId}/sections`, {
    method: 'POST',
    body: JSON.stringify(sectionData),
  });

  if (!res.ok) {
    throw new Error('Error al crear la sección');
  }

  const data = await res.json();
  return data.data;
};

export const updateSection = async (id: string, sectionData: any): Promise<Section> => {
  const res = await apiFetch(`/sections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(sectionData),
  });

  if (!res.ok) {
    throw new Error('Error al actualizar la sección');
  }

  const data = await res.json();
  return data.data;
};

export const deleteSection = async (id: string): Promise<void> => {
  const res = await apiFetch(`/sections/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Error al eliminar la sección');
  }
};

export const reorderItems = async (sectionId: string, orderedItemIds: string[]): Promise<void> => {
  const res = await apiFetch(`/sections/${sectionId}/reorder-items`, {
    method: 'PATCH',
    body: JSON.stringify({ orderedItemIds }),
  });

  if (!res.ok) {
    throw new Error('Error al reordenar los ítems');
  }
};
