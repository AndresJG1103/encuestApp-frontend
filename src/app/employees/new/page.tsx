"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/Sidebar';
import { createUser } from '../../../services/userService';
import type { RoleType } from '../../../types';
import { useNotification } from '../../../context/NotificationContext';

export default function NewEmployeePage() {
  const router = useRouter();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    identityDocument: string;
    password: string;
    role: RoleType;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    identityDocument: '',
    password: '',
    role: 'RESPONDENT',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { role, ...submitData } = formData;
      await createUser({
        ...submitData,
        roles: [role] 
      });
      notify('Empleado creado correctamente', 'success');
      router.push('/employees');
    } catch (err: any) {
      setError(err.message || 'Error al crear el empleado');
      notify(err.message || 'Error al crear el empleado', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Header */}
        <header style={{ 
          height: '72px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline-variant)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => router.back()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface)', display: 'flex', alignItems: 'center' }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Nuevo Empleado</h1>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', maxWidth: '600px', backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '16px',
            border: '1px solid var(--color-outline-variant)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-on-surface)' }}>Información Personal</h2>
              <p style={{ color: 'var(--color-outline)', marginBottom: '32px' }}>Completa los datos para dar de alta a un nuevo colaborador.</p>

              {error && (
                <div style={{ 
                  padding: '16px', backgroundColor: 'var(--color-error-container)', 
                  color: 'var(--color-on-error-container)', borderRadius: '8px', marginBottom: '24px',
                  display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px'
                }}>
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Nombre</label>
                    <input 
                      type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                      placeholder="Ej. Juan"
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Apellidos</label>
                    <input 
                      type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                      placeholder="Ej. Pérez García"
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Correo Electrónico</label>
                  <input 
                    type="email" name="email" required value={formData.email} onChange={handleChange}
                    placeholder="juan.perez@empresa.com"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Documento de Identidad</label>
                  <input 
                    type="text" name="identityDocument" required value={formData.identityDocument} onChange={handleChange}
                    placeholder="DNI, NIE o Pasaporte"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Contraseña Temporal</label>
                  <input 
                    type="password" name="password" required value={formData.password} onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Rol en la Plataforma</label>
                  <select 
                    name="role" value={formData.role} onChange={handleChange}
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  >
                    <option value="RESPONDENT">Empleado (Encuestado)</option>
                    <option value="CREATOR">Creador (Encuestas/Formación)</option>
                    <option value="REVIEWER">Revisor (Analista)</option>
                    <option value="TENANT_ADMIN">Administrador de Organización</option>
                  </select>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => router.back()}
                    style={{ 
                      flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--color-outline)',
                      backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                      flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                      backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: 600, 
                      cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
                        Guardando...
                      </>
                    ) : 'Crear Empleado'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
