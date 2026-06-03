import type { JwtUser, RoleType } from '../types';

const includesAny = (userRoles: RoleType[] | undefined, ...required: RoleType[]) =>
  required.some((r) => userRoles?.includes(r) ?? false);

export const Permissions = {
  // ─── Sistema (cross-tenant) ─────────────────────────────────
  manageTenants: (user: JwtUser | null) => includesAny(user?.roles, 'SUPER_ADMIN'),

  // ─── Administración del tenant ──────────────────────────────
  manageUsers: (user: JwtUser | null) =>
    includesAny(user?.roles, 'TENANT_ADMIN', 'SUPER_ADMIN'),

  manageTenantSettings: (user: JwtUser | null) =>
    includesAny(user?.roles, 'TENANT_ADMIN', 'SUPER_ADMIN'),

  // ─── Contenido (forms / assignments) ────────────────────────
  createForms: (user: JwtUser | null) =>
    includesAny(user?.roles, 'CREATOR', 'TENANT_ADMIN', 'SUPER_ADMIN'),

  assignForms: (user: JwtUser | null) =>
    includesAny(user?.roles, 'CREATOR', 'TENANT_ADMIN', 'SUPER_ADMIN'),

  // ─── Analítica ──────────────────────────────────────────────
  viewAnalytics: (user: JwtUser | null) =>
    includesAny(user?.roles, 'REVIEWER', 'CREATOR', 'TENANT_ADMIN', 'SUPER_ADMIN'),

  // ─── Mi trabajo (todos los autenticados) ────────────────────
  completeForms: (user: JwtUser | null) =>
    includesAny(
      user?.roles,
      'RESPONDENT',
      'REVIEWER',
      'CREATOR',
      'TENANT_ADMIN',
      'SUPER_ADMIN',
    ),

  viewCatalog: (user: JwtUser | null) =>
    includesAny(
      user?.roles,
      'RESPONDENT',
      'REVIEWER',
      'CREATOR',
      'TENANT_ADMIN',
      'SUPER_ADMIN',
    ),

  viewMyCertificates: (user: JwtUser | null) =>
    includesAny(
      user?.roles,
      'RESPONDENT',
      'REVIEWER',
      'CREATOR',
      'TENANT_ADMIN',
      'SUPER_ADMIN',
    ),
} as const;

export type Capability = keyof typeof Permissions;

export const can = (user: JwtUser | null, capability: Capability): boolean =>
  Permissions[capability](user);

// Convenience: highest-level label for UI ("Admin", "Creador", etc.)
export const primaryRoleLabel = (user: JwtUser | null): string => {
  const roles = user?.roles ?? [];
  if (roles.includes('SUPER_ADMIN')) return 'Super Admin';
  if (roles.includes('TENANT_ADMIN')) return 'Admin';
  if (roles.includes('CREATOR')) return 'Creador';
  if (roles.includes('REVIEWER')) return 'Revisor';
  if (roles.includes('RESPONDENT')) return 'Respondiente';
  return 'Usuario';
};
