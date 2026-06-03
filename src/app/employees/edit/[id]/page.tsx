"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { Permissions } from '../../../../lib/permissions';
import { useApi, useAsyncAction } from '../../../../hooks';
import {
  assignRole,
  getUserById,
  removeRole,
  updateUser,
} from '../../../../services/userService';
import type { RoleType, UpdateUserInput } from '../../../../types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageLayout,
  Select,
  Spinner,
} from '../../../../components/ui';

const ALL_ROLES: RoleType[] = [
  'SUPER_ADMIN',
  'TENANT_ADMIN',
  'CREATOR',
  'REVIEWER',
  'RESPONDENT',
];

const extractRoles = (user: any): RoleType[] => {
  if (Array.isArray(user?.roles)) {
    return user.roles.map((r: any) => (typeof r === 'string' ? r : r.role));
  }
  if (Array.isArray(user?.userTenants)) {
    return user.userTenants.map((r: any) => r.role);
  }
  return [];
};

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const { user: authUser } = useAuth();
  const { notify, confirm } = useNotification();
  const userId = params.id as string;

  const { data: emp, loading, error, refetch } = useApi(
    () => getUserById(userId),
    [userId],
  );

  const [form, setForm] = useState<UpdateUserInput>({
    firstName: '',
    lastName: '',
    identityDocument: '',
    isActive: true,
  });

  const [roleToAdd, setRoleToAdd] = useState<RoleType>('RESPONDENT');

  useEffect(() => {
    if (emp) {
      setForm({
        firstName: emp.firstName,
        lastName: emp.lastName,
        identityDocument: emp.identityDocument,
        isActive: emp.isActive,
      });
    }
  }, [emp]);

  const save = useAsyncAction(
    (payload: UpdateUserInput) => updateUser(userId, payload),
    {
      onSuccess: () => {
        notify('Empleado actualizado', 'success');
        refetch();
      },
      onError: (msg) => notify(msg, 'error'),
    },
  );

  const grantRole = useAsyncAction((r: RoleType) => assignRole(userId, r), {
    onSuccess: () => {
      notify('Rol asignado', 'success');
      refetch();
    },
    onError: (msg) => notify(msg, 'error'),
  });

  const revokeRole = useAsyncAction((r: RoleType) => removeRole(userId, r), {
    onSuccess: () => {
      notify('Rol removido', 'success');
      refetch();
    },
    onError: (msg) => notify(msg, 'error'),
  });

  if (!Permissions.manageUsers(authUser)) {
    return (
      <PageLayout title="Editar Empleado">
        <EmptyState icon="lock" title="Acceso denegado" />
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout title="Editar Empleado">
        <Spinner label="Cargando empleado..." />
      </PageLayout>
    );
  }

  if (error || !emp) {
    return (
      <PageLayout title="Editar Empleado">
        <EmptyState icon="error" title="Error" description={error ?? 'No encontrado'} />
      </PageLayout>
    );
  }

  const currentRoles = extractRoles(emp);
  const availableToAdd = ALL_ROLES.filter((r) => !currentRoles.includes(r));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await save.run(form);
  };

  const handleRevoke = async (r: RoleType) => {
    const ok = await confirm(`¿Remover el rol ${r}?`);
    if (!ok) return;
    await revokeRole.run(r);
  };

  return (
    <PageLayout
      title={`${emp.firstName} ${emp.lastName}`}
      actions={
        <Button variant="secondary" icon="arrow_back" onClick={() => router.push('/employees')}>
          Volver
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Datos */}
        <Card>
          <h3 className="text-base font-semibold m-0 mb-4">Información del usuario</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                required
                value={form.firstName ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
              <Input
                label="Apellidos"
                required
                value={form.lastName ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </div>
            <Input
              label="Documento de identidad"
              required
              value={form.identityDocument ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, identityDocument: e.target.value }))}
            />
            <label className="flex items-center gap-3 text-sm font-semibold text-on-surface cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive ?? false}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-5 h-5 cursor-pointer"
              />
              Usuario activo
            </label>

            {save.error && <p className="text-sm text-error m-0">{save.error}</p>}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" loading={save.loading}>
                Guardar cambios
              </Button>
            </div>
          </form>
        </Card>

        {/* Roles */}
        <Card>
          <h3 className="text-base font-semibold m-0 mb-1">Roles asignados</h3>
          <p className="text-sm text-on-surface-variant m-0 mb-4">
            Un usuario puede tener múltiples roles dentro del tenant.
          </p>

          {currentRoles.length === 0 ? (
            <p className="text-sm text-outline m-0 mb-4">Sin roles asignados.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentRoles.map((r) => {
                const isSelfSuperAdmin =
                  r === 'SUPER_ADMIN' && authUser?.sub === userId;
                return (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container"
                  >
                    {r}
                    <button
                      type="button"
                      onClick={() => handleRevoke(r)}
                      disabled={revokeRole.loading || isSelfSuperAdmin}
                      title={
                        isSelfSuperAdmin
                          ? 'No puedes remover tu propio rol SUPER_ADMIN'
                          : 'Remover rol'
                      }
                      className="ml-1 text-on-primary-container hover:text-error bg-transparent border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {availableToAdd.length > 0 ? (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Select
                  label="Asignar rol"
                  value={roleToAdd}
                  onChange={(e) => setRoleToAdd(e.target.value as RoleType)}
                >
                  {availableToAdd.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </div>
              <Button
                icon="add"
                onClick={() => grantRole.run(roleToAdd)}
                loading={grantRole.loading}
              >
                Asignar
              </Button>
            </div>
          ) : (
            <p className="text-xs text-outline m-0">El usuario ya tiene todos los roles.</p>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
