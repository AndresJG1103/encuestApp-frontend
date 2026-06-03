import { apiFetch, extractError } from '../lib/api';
import type {
  CreateTenantInput,
  PaginatedResult,
  Tenant,
  TenantFilters,
  UpdateTenantInput,
} from '../types';

export type { Tenant } from '../types';

export const getTenants = async (
  params: TenantFilters = {},
): Promise<PaginatedResult<Tenant>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);

  const res = await apiFetch(`/tenants?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener los tenants'));
  }
  const data = await res.json();
  return data.data;
};

export const getTenantById = async (id: string): Promise<Tenant> => {
  const res = await apiFetch(`/tenants/${id}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener el tenant'));
  }
  const data = await res.json();
  return data.data;
};

export const createTenant = async (input: CreateTenantInput): Promise<Tenant> => {
  const res = await apiFetch('/tenants', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al crear el tenant'));
  }
  const data = await res.json();
  return data.data;
};

export const updateTenant = async (
  id: string,
  input: UpdateTenantInput,
): Promise<Tenant> => {
  const res = await apiFetch(`/tenants/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al actualizar el tenant'));
  }
  const data = await res.json();
  return data.data;
};

export const deleteTenant = async (id: string): Promise<void> => {
  const res = await apiFetch(`/tenants/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al eliminar el tenant'));
  }
};
