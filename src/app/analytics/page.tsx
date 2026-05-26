"use client";

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { getForms, Form } from '../../services/formService';
import { apiFetch } from '../../lib/api';

export default function AnalyticsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getForms({ status: 'PUBLISHED' });
        setForms(data.data);
        if (data.data.length > 0) {
          setSelectedFormId(data.data[0].id);
        }
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    if (!selectedFormId) return;
    const fetchSummary = async () => {
      try {
        const res = await apiFetch(`/reports/forms/${selectedFormId}/summary`);
        const data = await res.json();
        setSummary(data.data);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchSummary();
  }, [selectedFormId]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>Cargando analíticas...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: 'var(--color-on-surface)' }}>Análisis de Resultados</h1>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-on-surface-variant)' }}>Seleccionar Formulario</label>
          <select 
            value={selectedFormId} onChange={(e) => setSelectedFormId(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)', width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
          >
            {forms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
          </select>
        </div>

        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-outline)', textTransform: 'uppercase', margin: 0 }}>Total Iniciados</p>
              <h2 style={{ fontSize: '32px', margin: '8px 0', color: 'var(--color-on-surface)' }}>{summary.totalStarts}</h2>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-outline)', textTransform: 'uppercase', margin: 0 }}>Completados</p>
              <h2 style={{ fontSize: '32px', margin: '8px 0', color: 'var(--color-on-surface)' }}>{summary.totalCompletes}</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-primary)', margin: 0 }}>{summary.completionRate}% de tasa</p>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-outline)', textTransform: 'uppercase', margin: 0 }}>Aprobados</p>
              <h2 style={{ fontSize: '32px', margin: '8px 0', color: 'var(--color-on-surface)' }}>{summary.passedCount}</h2>
              <p style={{ fontSize: '14px', color: 'var(--color-tertiary)', margin: 0 }}>{summary.passRate}% de éxito</p>
            </div>
            <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-outline)', textTransform: 'uppercase', margin: 0 }}>Puntaje Promedio</p>
              <h2 style={{ fontSize: '32px', margin: '8px 0', color: 'var(--color-on-surface)' }}>{summary.avgScore?.toFixed(1) || 'N/A'}</h2>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
