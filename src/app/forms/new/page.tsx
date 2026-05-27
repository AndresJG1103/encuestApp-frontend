"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/Sidebar';
import { createForm } from '../../../services/formService';
import type { FormType } from '../../../types';
import { useNotification } from '../../../context/NotificationContext';

export default function NewFormPage() {
  const router = useRouter();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{ title: string; description: string; type: FormType }>({
    title: '',
    description: '',
    type: 'SURVEY',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      const newForm = await createForm(formData);
      notify('Formulario base creado', 'success');
      // After creating the base form, redirect to the full editor (Stage 4)
      router.push(`/forms/${newForm.id}/edit`);
    } catch (err: any) {
      setError(err.message || 'Error al crear el formulario');
      notify(err.message || 'Error al crear el formulario', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--color-on-surface)' }}>Nuevo Formulario</h1>
          </div>
        </header>

        <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', maxWidth: '600px', backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '16px',
            border: '1px solid var(--color-outline-variant)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-on-surface)' }}>Configuración Inicial</h2>
              <p style={{ color: 'var(--color-outline)', marginBottom: '32px' }}>Define los detalles básicos de tu nueva encuesta o capacitación.</p>

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Título</label>
                  <input 
                    type="text" name="title" required value={formData.title} onChange={handleChange}
                    placeholder="Ej. Encuesta de Clima Laboral 2026"
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Descripción (Opcional)</label>
                  <textarea 
                    name="description" value={formData.description} onChange={handleChange}
                    placeholder="Describe brevemente el objetivo de este formulario..."
                    rows={4}
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', resize: 'vertical', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Tipo de Formulario</label>
                  <select 
                    name="type" value={formData.type} onChange={handleChange}
                    style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-outline)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                  >
                    <option value="SURVEY">Encuesta (Sin puntuación)</option>
                    <option value="TRAINING">Capacitación (Con puntuación y certificado)</option>
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
                        Creando...
                      </>
                    ) : 'Continuar al Editor'}
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
