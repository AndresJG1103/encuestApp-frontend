import { apiFetch, extractError } from '../lib/api';
import type {
  CreateUserInput,
  PaginatedResult,
  RoleType,
  UpdateUserInput,
  User,
  UserFilters,
} from '../types';

export type { PaginatedResult, User } from '../types';

export const getUsers = async (params: UserFilters = {}): Promise<PaginatedResult<User>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);

  const res = await apiFetch(`/users?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener la lista de usuarios'));
  }
  const data = await res.json();
  return data.data;
};

export const createUser = async (userData: CreateUserInput): Promise<User> => {
  const res = await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al crear el usuario'));
  }

  const data = await res.json();
  return data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await apiFetch(`/users/${id}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener el usuario'));
  }
  const data = await res.json();
  return data.data;
};

export const updateUser = async (id: string, userData: UpdateUserInput): Promise<User> => {
  const res = await apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al actualizar el usuario'));
  }

  const data = await res.json();
  return data.data;
};

export const assignRole = async (userId: string, role: RoleType): Promise<void> => {
  const res = await apiFetch(`/users/${userId}/roles`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al asignar el rol'));
  }
};

export const removeRole = async (userId: string, role: RoleType): Promise<void> => {
  const res = await apiFetch(`/users/${userId}/roles/${role}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al remover el rol'));
  }
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  const res = await apiFetch(`/users/${id}/toggle-status`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al cambiar el estado del usuario'));
  }

  const data = await res.json();
  return data.data;
};
