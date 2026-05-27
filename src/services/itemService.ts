import { apiFetch, extractError } from '../lib/api';
import type { CreateItemInput, Item, UpdateItemInput } from '../types';

export type { Item } from '../types';

export const getItemsBySection = async (sectionId: string): Promise<Item[]> => {
  const res = await apiFetch(`/sections/${sectionId}/items`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener los ítems'));
  }
  const data = await res.json();
  return data.data;
};

export const createItem = async (sectionId: string, itemData: CreateItemInput): Promise<Item> => {
  const res = await apiFetch(`/sections/${sectionId}/items`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al crear el ítem'));
  }

  const data = await res.json();
  return data.data;
};

export const updateItem = async (id: string, itemData: UpdateItemInput): Promise<Item> => {
  const res = await apiFetch(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al actualizar el ítem'));
  }

  const data = await res.json();
  return data.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  const res = await apiFetch(`/items/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al eliminar el ítem'));
  }
};
