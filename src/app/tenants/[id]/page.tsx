"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { Permissions } from '../../../lib/permissions';
import { useApi, useAsyncAction } from '../../../hooks';
import {
  deleteTenant,
  getTenantById,
  updateTenant,
} from '../../../services/tenantService';
import type { Tenant, TenantPlan } from '../../../types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageLayout,
  Select,
  Spinner,
} from '../../../components/ui';

export default function TenantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { notify, confirm } = useNotification();

  const { data: tenant, loading, error, refetch } = useApi(
    () => getTenantById(id),
    [id],
  );

  const [form, setForm] = useState<{ name: string; plan: TenantPlan }>({
    name: '',
    plan: 'FREE',
  });

  useEffect(() => {
    if (tenant) {
      setForm({ name: tenant.name, plan: tenant.plan });
    }
  }, [tenant]);

  const update = useAsyncAction(
    (payload: { name: string; plan: TenantPlan }) => updateTenant(id, payload),
    {
      onSuccess: () => {
        notify('Tenant actualizado', 'success');
        refetch();
      },
      onError: (msg) => notify(msg, 'error'),
    },
  );

  const remove = useAsyncAction(() => deleteTenant(id), {
    onSuccess: () => {
      notify('Tenant eliminado', 'success');
      router.push('/tenants');
    },
    onError: (msg) => notify(msg, 'error'),
  });

  if (!Permissions.manageTenants(user)) {
    return (
      <PageLayout title="Tenant">
        <EmptyState icon="lock" title="Acceso denegado" />
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout title="Tenant">
        <Spinner label="Cargando tenant..." />
      </PageLayout>
    );
  }

  if (error || !tenant) {
    return (
      <PageLayout title="Tenant">
        <EmptyState icon="error" title="Error" description={error ?? 'No encontrado'} />
      </PageLayout>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await update.run(form);
  };

  const handleDelete = async () => {
    const ok = await confirm(
      `¿Eliminar tenant "${tenant.name}"? Soft-delete: se puede restaurar en DB.`,
    );
    if (!ok) return;
    await remove.run();
  };

  return (
    <PageLayout
      title={tenant.name}
      actions={
        <Button variant="secondary" icon="arrow_back" onClick={() => router.push('/tenants')}>
          Volver
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Detail */}
        <Card>
          <h3 className="text-base font-semibold m-0 mb-4">Información</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-outline m-0">ID</p>
              <p className="font-mono text-xs m-0">{tenant.id}</p>
            </div>
            <div>
              <p className="text-xs text-outline m-0">Slug</p>
              <p className="font-mono m-0">{tenant.slug}</p>
            </div>
            <div>
              <p className="text-xs text-outline m-0">Plan actual</p>
              <Badge tone={tenant.plan === 'ENTERPRISE' ? 'info' : tenant.plan === 'PRO' ? 'success' : 'neutral'}>
                {tenant.plan}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-outline m-0">Creado</p>
              <p className="m-0">{new Date(tenant.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Edit */}
        <Card>
          <h3 className="text-base font-semibold m-0 mb-4">Editar</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <Input
              label="Nombre"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Select
              label="Plan"
              value={form.plan}
              onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value as TenantPlan }))}
            >
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </Select>

            {update.error && <p className="text-sm text-error m-0">{update.error}</p>}

            <div className="flex justify-end">
              <Button type="submit" loading={update.loading}>
                Guardar cambios
              </Button>
            </div>
          </form>
        </Card>

        {/* Danger zone */}
        <Card className="border-error">
          <h3 className="text-base font-semibold m-0 mb-2 text-error">Zona peligrosa</h3>
          <p className="text-sm text-on-surface-variant m-0 mb-4">
            Soft-delete: el tenant deja de ser accesible pero sus datos permanecen en DB.
          </p>
          <Button variant="danger" icon="delete" onClick={handleDelete} loading={remove.loading}>
            Eliminar tenant
          </Button>
        </Card>
      </div>
    </PageLayout>
  );
}
