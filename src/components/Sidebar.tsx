"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Icon } from './ui';
import { Permissions, primaryRoleLabel } from '../lib/permissions';

interface NavItem {
  name: string;
  icon: string;
  href: string;
  visible: boolean;
}

interface NavGroup {
  label: string;
  visible: boolean;
  items: NavItem[];
}

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const groups: NavGroup[] = [
    {
      label: 'Sistema',
      visible: Permissions.manageTenants(user),
      items: [
        {
          name: 'Tenants',
          icon: 'domain',
          href: '/tenants',
          visible: Permissions.manageTenants(user),
        },
      ],
    },
    {
      label: 'Administración',
      visible: Permissions.manageUsers(user) || Permissions.manageTenantSettings(user),
      items: [
        {
          name: 'Empleados',
          icon: 'group',
          href: '/employees',
          visible: Permissions.manageUsers(user),
        },
        {
          name: 'Configuración',
          icon: 'settings',
          href: '/settings',
          visible: Permissions.manageTenantSettings(user),
        },
      ],
    },
    {
      label: 'Contenido',
      visible: Permissions.createForms(user),
      items: [
        {
          name: 'Formularios',
          icon: 'description',
          href: '/forms',
          visible: Permissions.createForms(user),
        },
      ],
    },
    {
      label: 'Analítica',
      visible: Permissions.viewAnalytics(user),
      items: [
        {
          name: 'Reportes',
          icon: 'analytics',
          href: '/analytics',
          visible: Permissions.viewAnalytics(user),
        },
      ],
    },
    {
      label: 'Mi trabajo',
      visible: true,
      items: [
        { name: 'Inicio', icon: 'dashboard', href: '/', visible: true },
        {
          name: 'Mis tareas',
          icon: 'task',
          href: '/my-tasks',
          visible: Permissions.completeForms(user),
        },
        {
          name: 'Mis sesiones',
          icon: 'history',
          href: '/my-sessions',
          visible: Permissions.completeForms(user),
        },
        {
          name: 'Catálogo',
          icon: 'menu_book',
          href: '/catalog',
          visible: Permissions.viewCatalog(user),
        },
        {
          name: 'Certificados',
          icon: 'verified',
          href: '/certificates',
          visible: Permissions.viewMyCertificates(user),
        },
      ],
    },
  ];

  const visibleGroups = groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.visible) }))
    .filter((g) => g.visible && g.items.length > 0);

  return (
    <aside
      style={{
        width: '280px',
        background: 'var(--color-surface-container-lowest)',
        borderRight: '1px solid var(--color-outline-variant)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 40,
        boxSizing: 'border-box',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '8px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            background: 'var(--color-primary-container)',
            color: 'var(--color-on-primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="domain" size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>
            LearnPulse
          </h1>
          <p style={{ fontSize: '12px', margin: 0, color: 'var(--color-outline)' }}>SaaS Empresarial</p>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {visibleGroups.map((group) => (
          <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-outline)',
                padding: '0 12px',
                margin: '4px 0',
              }}
            >
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    background: isActive ? 'var(--color-primary-container)' : 'transparent',
                    color: isActive ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <Icon name={item.icon} size={22} filled={isActive} />
                  <span style={{ fontSize: '14px' }}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-outline-variant)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                background: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {(user?.firstName?.charAt(0) || user?.email?.charAt(0) || user?.sub?.charAt(0) || 'U').toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-on-surface)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={displayName(user)}
              >
                {displayName(user)}
              </p>
              <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-outline)' }}>
                {primaryRoleLabel(user)}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <ThemeToggle />
            <button
              onClick={logout}
              title="Cerrar sesión"
              style={{
                background: 'var(--color-surface-container-low)',
                color: 'var(--color-error)',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

const displayName = (user: { firstName?: string; lastName?: string; email?: string } | null) => {
  if (!user) return 'Usuario';
  const full = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  if (full) return full;
  if (user.email) return user.email;
  return 'Usuario';
};
