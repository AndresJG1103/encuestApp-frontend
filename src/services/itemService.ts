import { apiFetch } from '../lib/api';
import { Item } from './sectionService';

export const getItemsBySection = async (sectionId: string): Promise<Item[]> => {
  const res = await apiFetch(`/sections/${sectionId}/items`);
  if (!res.ok) {
    throw new Error('Error al obtener los ítems');
  }
  const data = await res.json();
  return data.data;
};

export const createItem = async (sectionId: string, itemData: any): Promise<Item> => {
  const res = await apiFetch(`/sections/${sectionId}/items`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al crear el ítem');
  }

  const data = await res.json();
  return data.data;
};

export const updateItem = async (id: string, itemData: any): Promise<Item> => {
  const res = await apiFetch(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al actualizar el ítem');
  }

  const data = await res.json();
  return data.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  const res = await apiFetch(`/items/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Error al eliminar el ítem');
  }
};
