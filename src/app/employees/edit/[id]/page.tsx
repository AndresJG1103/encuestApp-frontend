"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '../../../../components/Sidebar';
import { getUserById, updateUser } from '../../../../services/userService';
import { useNotification } from '../../../../context/NotificationContext';

export default function EditEmployeePage() {
  const router = useRouter();
  const { notify } = useNotification();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identityDocument: '',
    isActive: true
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(userId);
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          identityDocument: user.identityDocument,
          isActive: user.isActive
        });
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateUser(userId, formData);
      notify('Empleado actualizado con éxito', 'success');
      router.push('/employees');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el empleado');
      notify(err.message || 'Error al actualizar el empleado', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 2s linear infinite', color: 'var(--color-primary)' }}>sync</span>
            <p style={{ color: 'var(--color-outline)' }}>Cargando datos del empleado...</p>
          </div>
        </main>
      </div>
    );
  }

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
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Editar Empleado</h1>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', maxWidth: '600px', backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '16px',
            border: '1px solid var(--color-outline-variant)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-on-surface)' }}>Información del Usuario</h2>
              <p style={{ color: 'var(--color-outline)', marginBottom: '32px' }}>Modifica los campos necesarios para actualizar el perfil.</p>

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
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Apellidos</label>
                    <input 
                      type="text" name="lastName" required value={formData.lastName} onChange={handleChange}
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Documento de Identidad</label>
                  <input 
                    type="text" name="identityDocument" required value={formData.identityDocument} onChange={handleChange}
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <input 
                    type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isActive" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)', cursor: 'pointer' }}>
                    Usuario Activo
                  </label>
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
                    disabled={saving}
                    style={{ 
                      flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                      backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: 600, 
                      cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    {saving ? (
                      <>
                        <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
                        Guardando...
                      </>
                    ) : 'Guardar Cambios'}
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
