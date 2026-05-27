"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Permissions } from '../../lib/permissions';
import { usePaginated, useAsyncAction } from '../../hooks';
import { deleteTenant, getTenants } from '../../services/tenantService';
import type { Tenant, TenantFilters } from '../../types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  PageLayout,
  Spinner,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from '../../components/ui';

export default function TenantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notify, confirm } = useNotification();

  const list = usePaginated<Tenant, TenantFilters>(getTenants, {});

  const removeAction = useAsyncAction(deleteTenant, {
    onSuccess: () => {
      notify('Tenant eliminado', 'success');
      list.refetch();
    },
    onError: (msg) => notify(msg, 'error'),
  });

  if (!Permissions.manageTenants(user)) {
    return (
      <PageLayout title="Tenants">
        <EmptyState
          icon="lock"
          title="Acceso denegado"
          description="Solo SUPER_ADMIN puede gestionar tenants."
        />
      </PageLayout>
    );
  }

  const handleDelete = async (tenant: Tenant) => {
    const ok = await confirm(
      `¿Eliminar tenant "${tenant.name}"? Esta acción es soft-delete.`,
    );
    if (!ok) return;
    await removeAction.run(tenant.id);
  };

  return (
    <PageLayout
      title="Tenants"
      actions={
        <Button icon="add" onClick={() => router.push('/tenants/new')}>
          Nuevo Tenant
        </Button>
      }
    >
      <Card padded={false}>
        {list.loading ? (
          <Spinner label="Cargando tenants..." />
        ) : list.error ? (
          <EmptyState icon="error" title="Error" description={list.error} />
        ) : list.data.length === 0 ? (
          <EmptyState
            icon="domain"
            title="Sin tenants"
            description="Crea el primer tenant del sistema."
            action={
              <Button icon="add" onClick={() => router.push('/tenants/new')}>
                Crear Tenant
              </Button>
            }
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Nombre</TH>
                <TH>Slug</TH>
                <TH>Plan</TH>
                <TH>Creado</TH>
                <TH className="text-right">Acciones</TH>
              </TR>
            </THead>
            <TBody>
              {list.data.map((t) => (
                <TR key={t.id}>
                  <TD>
                    <p className="font-semibold m-0">{t.name}</p>
                  </TD>
                  <TD className="font-mono text-xs">{t.slug}</TD>
                  <TD>
                    <Badge
                      tone={t.plan === 'ENTERPRISE' ? 'info' : t.plan === 'PRO' ? 'success' : 'neutral'}
                    >
                      {t.plan}
                    </Badge>
                  </TD>
                  <TD className="text-on-surface-variant">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </TD>
                  <TD className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="edit"
                        onClick={() => router.push(`/tenants/${t.id}`)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="delete"
                        onClick={() => handleDelete(t)}
                        loading={removeAction.loading}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}

        {list.meta && list.meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-outline-variant bg-surface-container-low">
            <p className="text-sm text-on-surface-variant m-0">
              Página {list.meta.page} de {list.meta.totalPages} · {list.meta.total} tenants
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={list.page === 1}
                onClick={() => list.setPage(list.page - 1)}
              >
                <Icon name="chevron_left" size={18} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={list.page === list.meta.totalPages}
                onClick={() => list.setPage(list.page + 1)}
              >
                <Icon name="chevron_right" size={18} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </PageLayout>
  );
}
