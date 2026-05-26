"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { notify } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password, tenantSlug });
      notify('Bienvenido de nuevo', 'success');
    } catch (err: any) {
      const msg = err.message || 'Error al iniciar sesión. Verifica tus datos.';
      setError(msg);
      notify(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] p-4" style={{ width: '100vw', minHeight: '100vh' }}>
      <div className="card shadow-lg bg-[var(--color-surface-container-lowest)]" style={{ width: '100%', maxWidth: '448px', padding: '32px', borderRadius: '16px' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Bienvenido</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-2">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] p-3 rounded-md mb-4 text-sm border border-[var(--color-error)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="tenantSlug">
              Organización (Tenant Slug)
            </label>
            <input
              id="tenantSlug"
              type="text"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-on-surface)]"
              required
              placeholder="Ej. mi-empresa"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-on-surface)]"
              required
              placeholder="tu@correo.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-on-surface)]"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-4 disabled:opacity-70 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
