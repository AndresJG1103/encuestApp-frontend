"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('TENANT_ADMIN') || userRoles.includes('SUPER_ADMIN');
  const isCreator = userRoles.includes('CREATOR');
  const isRespondent = userRoles.includes('RESPONDENT');

  const navItems = [
    { name: 'Inicio', icon: 'dashboard', href: '/', show: true },
    { name: 'Mis Tareas', icon: 'task', href: '/my-tasks', show: isRespondent },
    { name: 'Certificados', icon: 'verified', href: '/certificates', show: isRespondent },
    { name: 'Empleados', icon: 'group', href: '/employees', show: isAdmin },
    { name: 'Formularios', icon: 'description', href: '/forms', show: isAdmin || isCreator },
    { name: 'Analíticas', icon: 'analytics', href: '/analytics', show: isAdmin || isCreator },
    { name: 'Configuración', icon: 'settings', href: '/settings', show: isAdmin },
  ];

  return (
    <aside style={{ 
      width: '280px', 
      backgroundColor: 'var(--color-surface-container-lowest)', 
      borderRight: '1px solid var(--color-outline-variant)', 
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '8px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '9999px', 
          backgroundColor: 'var(--color-primary-container)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'var(--color-on-primary-container)' 
        }}>
          <span className="material-symbols-outlined">domain</span>
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>LearnPulse</h1>
          <p style={{ fontSize: '12px', margin: 0, color: 'var(--color-outline)' }}>SaaS Empresarial</p>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.filter(i => i.show).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: isActive ? 'var(--color-primary-container)' : 'transparent',
                color: isActive ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease'
              }}>
                <span className="material-symbols-outlined" style={{ 
                  fontSize: '22px',
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                }}>{item.icon}</span>
                <span style={{ fontSize: '14px' }}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-outline-variant)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-outline)' }}>
                {isAdmin ? 'Admin' : isCreator ? 'Creador' : 'Respondiente'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeToggle />
            <button 
              onClick={logout}
              title="Cerrar sesión"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', backgroundColor: 'var(--color-surface-container-low)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
