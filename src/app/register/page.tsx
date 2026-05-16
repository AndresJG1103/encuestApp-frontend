"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    tenantSlug: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    identityDocument: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta. Verifica tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[var(--color-surface-container-low)] py-12 p-4" style={{ width: '100vw', minHeight: '100vh' }}>
      <div className="card shadow-lg bg-white" style={{ width: '100%', maxWidth: '600px', padding: '32px', borderRadius: '8px' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">Crear Cuenta</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-2">Únete a nuestra plataforma</p>
        </div>

        {error && (
          <div className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] p-3 rounded-md mb-4 text-sm">
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
              value={formData.tenantSlug}
              onChange={handleChange}
              className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
              required
              placeholder="Ej. mi-empresa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="firstName">
                Nombres
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
                required
                placeholder="Juan"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="lastName">
                Apellidos
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
                required
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="identityDocument">
              Documento de Identidad
            </label>
            <input
              id="identityDocument"
              type="text"
              value={formData.identityDocument}
              onChange={handleChange}
              className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
              required
              placeholder="Ej. 12345678"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
              required
              placeholder="tu@correo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
                required
                placeholder="••••••••"
                minLength={8}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]" htmlFor="confirmPassword">
                Confirmar
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border border-[var(--color-outline-variant)] rounded p-2 focus:outline-none focus:border-[var(--color-primary)] bg-white"
                required
                placeholder="••••••••"
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary mt-4 disabled:opacity-70 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
