export type RoleType =
  | 'SUPER_ADMIN'
  | 'TENANT_ADMIN'
  | 'CREATOR'
  | 'REVIEWER'
  | 'RESPONDENT';

export interface JwtUser {
  sub: string;
  tenantId: string;
  roles: RoleType[];
  jti: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  iat: number;
  exp: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface RegisterPayload {
  tenantSlug: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  identityDocument: string;
  role?: RoleType;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
