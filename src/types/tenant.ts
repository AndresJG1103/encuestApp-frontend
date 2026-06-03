export type TenantPlan = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface TenantSettings {
  [key: string]: unknown;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  plan?: TenantPlan;
  settings?: TenantSettings;
}

export interface UpdateTenantInput {
  name?: string;
  plan?: TenantPlan;
  settings?: TenantSettings;
}

export interface TenantFilters {
  page?: number;
  limit?: number;
  search?: string;
}
