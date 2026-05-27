import type { RoleType } from './auth';

export interface UserRoleEntry {
  role: RoleType;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identityDocument: string;
  isActive: boolean;
  roles?: UserRoleEntry[];
  userTenants?: UserRoleEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  identityDocument: string;
  roles: RoleType[];
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  identityDocument?: string;
  isActive?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
}
