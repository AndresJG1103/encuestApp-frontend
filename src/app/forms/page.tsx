"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { getForms, Form, publishForm, duplicateForm, deleteForm } from '../../services/formService';
import { PaginatedResult } from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';

export default function FormsPage() {
  const router = useRouter();
  const { notify, confirm } = useNotification();
  const [data, setData] = useState<PaginatedResult<Form> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const result = await getForms({ page, limit: 10 });
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los formularios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [page]);

  const handlePublish = async (id: string) => {
    const ok = await confirm('¿Estás seguro de que quieres publicar este formulario? Una vez publicado, los cambios generarán una nueva versión.');
    if (!ok) return;
    try {
      await publishForm(id);
      notify('Formulario publicado', 'success');
      fetchForms();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateForm(id);
      notify('Formulario duplicado', 'success');
      fetchForms();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm('¿Estás seguro de que quieres eliminar este formulario?');
    if (!ok) return;
    try {
      await deleteForm(id);
      notify('Formulario eliminado', 'success');
      fetchForms();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 32px', height: '64px', backgroundColor: 'var(--color-surface)', 
          opacity: 0.98, backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-outline-variant)',
          position: 'sticky', top: 0, zIndex: 30
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-on-surface)' }}>Gestión de Formularios</h2>
          <button 
            onClick={() => router.push('/forms/new')}
            style={{ 
              backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
              padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
            Nueva Encuesta / Capacitación
          </button>
        </header>

        <div style={{ padding: '32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface-variant)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 24px' }}>Título</th>
                  <th style={{ padding: '16px 24px' }}>Tipo</th>
                  <th style={{ padding: '16px 24px' }}>Estado</th>
                  <th style={{ padding: '16px 24px' }}>Versión</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>
                      Cargando formularios...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-error)' }}>
                      {error}
                    </td>
                  </tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>
                      No se encontraron formularios.
                    </td>
                  </tr>
                ) : (
                  data?.data.map((form) => (
                    <tr key={form.id} style={{ borderBottom: '1px solid var(--color-outline-variant)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-on-surface)' }}>{form.title}</p>
                          {form.description && <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-outline)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{form.description}</p>}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                          backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)'
                        }}>
                          {form.type}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                          backgroundColor: form.status === 'PUBLISHED' ? 'var(--color-secondary-container)' : form.status === 'DRAFT' ? 'var(--color-surface-variant)' : 'var(--color-surface-container-high)',
                          color: form.status === 'PUBLISHED' ? 'var(--color-on-secondary-container)' : form.status === 'DRAFT' ? 'var(--color-on-surface-variant)' : 'var(--color-outline)'
                        }}>
                          {form.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                        v{form.version}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => router.push(`/forms/${form.id}/edit`)}
                            title="Editar"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          {form.status === 'DRAFT' && (
                            <button 
                              onClick={() => handlePublish(form.id)}
                              title="Publicar"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', padding: '4px' }}
                            >
                              <span className="material-symbols-outlined">publish</span>
                            </button>
                          )}
                          {form.status === 'PUBLISHED' && (
                            <button 
                              onClick={() => router.push(`/forms/${form.id}/assign`)}
                              title="Asignar"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-tertiary)', padding: '4px' }}
                            >
                              <span className="material-symbols-outlined">assignment_ind</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleDuplicate(form.id)}
                            title="Duplicar"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', padding: '4px' }}
                          >
                            <span className="material-symbols-outlined">content_copy</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(form.id)}
                            title="Eliminar"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: '4px' }}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
