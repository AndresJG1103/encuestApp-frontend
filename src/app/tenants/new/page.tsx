"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { Permissions } from '../../../lib/permissions';
import { useAsyncAction } from '../../../hooks';
import { createTenant } from '../../../services/tenantService';
import type { CreateTenantInput, TenantPlan } from '../../../types';
import {
  Button,
  Card,
  EmptyState,
  Input,
  PageLayout,
  Select,
} from '../../../components/ui';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function NewTenantPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notify } = useNotification();

  const [form, setForm] = useState<{ name: string; slug: string; plan: TenantPlan }>({
    name: '',
    slug: '',
    plan: 'FREE',
  });

  const create = useAsyncAction(createTenant, {
    onSuccess: (tenant) => {
      notify('Tenant creado', 'success');
      router.push(`/tenants/${tenant.id}`);
    },
    onError: (msg) => notify(msg, 'error'),
  });

  if (!Permissions.manageTenants(user)) {
    return (
      <PageLayout title="Nuevo Tenant">
        <EmptyState icon="lock" title="Acceso denegado" />
      </PageLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateTenantInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      plan: form.plan,
    };
    await create.run(payload);
  };

  return (
    <PageLayout title="Nuevo Tenant">
      <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        <Card>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <Input
              label="Nombre"
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({
                  ...f,
                  name,
                  slug: f.slug === slugify(f.name) || f.slug === '' ? slugify(name) : f.slug,
                }));
              }}
              placeholder="Acme Corp"
            />
            <Input
              label="Slug"
              required
              hint="Identificador URL único. Solo minúsculas, números y guiones."
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              placeholder="acme-corp"
              pattern="^[a-z0-9-]+$"
            />
            <Select
              label="Plan"
              value={form.plan}
              onChange={(e) =>
                setForm((f) => ({ ...f, plan: e.target.value as TenantPlan }))
              }
            >
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </Select>

            {create.error && (
              <p style={{ fontSize: '13px', color: 'var(--color-error)', margin: 0 }}>
                {create.error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={create.loading}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={create.loading}>
                Crear Tenant
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
