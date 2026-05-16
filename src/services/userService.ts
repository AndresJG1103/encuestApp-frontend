import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identityDocument: string;
  isActive: boolean;
  userTenants: Array<{
    role: string;
  }>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

export const getUsers = async (params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResult<User>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);

  const res = await apiFetch(`/users?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error('Error al obtener la lista de usuarios');
  }
  const data = await res.json();
  return data.data;
};

export const createUser = async (userData: any): Promise<User> => {
  const res = await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al crear el usuario');
  }

  const data = await res.json();
  return data.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await apiFetch(`/users/${id}`);
  if (!res.ok) {
    throw new Error('Error al obtener el usuario');
  }
  const data = await res.json();
  return data.data;
};

export const updateUser = async (id: string, userData: any): Promise<User> => {
  const res = await apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Error al actualizar el usuario');
  }

  const data = await res.json();
  return data.data;
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  const res = await apiFetch(`/users/${id}/toggle-status`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Error al cambiar el estado del usuario');
  }

  const data = await res.json();
  return data.data;
};
