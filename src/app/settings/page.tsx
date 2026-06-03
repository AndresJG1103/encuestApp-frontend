"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Permissions } from '../../lib/permissions';
import { useApi, useAsyncAction } from '../../hooks';
import { getTenantById, updateTenant } from '../../services/tenantService';
import type { TenantPlan } from '../../types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  PageLayout,
  Select,
  Spinner,
} from '../../components/ui';

export default function SettingsPage() {
  const { user } = useAuth();
  const { notify } = useNotification();

  const tenantId = user?.tenantId;

  const { data: tenant, loading, error, refetch } = useApi(
    () => (tenantId ? getTenantById(tenantId) : Promise.reject(new Error('Sin tenant'))),
    [tenantId],
  );

  const [form, setForm] = useState<{ name: string; plan: TenantPlan }>({
    name: '',
    plan: 'FREE',
  });

  useEffect(() => {
    if (tenant) setForm({ name: tenant.name, plan: tenant.plan });
  }, [tenant]);

  const update = useAsyncAction(
    (payload: { name: string; plan: TenantPlan }) =>
      tenantId ? updateTenant(tenantId, payload) : Promise.reject(new Error('Sin tenant')),
    {
      onSuccess: () => {
        notify('Configuración actualizada', 'success');
        refetch();
      },
      onError: (msg) => notify(msg, 'error'),
    },
  );

  if (!Permissions.manageTenantSettings(user)) {
    return (
      <PageLayout title="Configuración">
        <EmptyState
          icon="lock"
          title="Acceso denegado"
          description="Solo administradores pueden modificar la configuración."
        />
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout title="Configuración">
        <Spinner label="Cargando..." />
      </PageLayout>
    );
  }

  if (error || !tenant) {
    return (
      <PageLayout title="Configuración">
        <EmptyState icon="error" title="Error" description={error ?? 'Sin datos'} />
      </PageLayout>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await update.run(form);
  };

  return (
    <PageLayout title="Configuración">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <Card>
          <h3 className="text-base font-semibold m-0 mb-4">Tenant actual</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-outline m-0">Slug</p>
              <p className="font-mono m-0">{tenant.slug}</p>
            </div>
            <div>
              <p className="text-xs text-outline m-0">Plan</p>
              <Badge
                tone={tenant.plan === 'ENTERPRISE' ? 'info' : tenant.plan === 'PRO' ? 'success' : 'neutral'}
              >
                {tenant.plan}
              </Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold m-0 mb-4">Editar configuración</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <Input
              label="Nombre del tenant"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Select
              label="Plan"
              value={form.plan}
              onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value as TenantPlan }))}
              hint="Solo SUPER_ADMIN debería cambiar el plan en producción."
            >
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </Select>

            {update.error && <p className="text-sm text-error m-0">{update.error}</p>}

            <div className="flex justify-end">
              <Button type="submit" loading={update.loading}>
                Guardar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
