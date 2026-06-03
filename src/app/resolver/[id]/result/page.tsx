"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '../../../../components/Sidebar';
import { useApi } from '../../../../hooks';
import { getSessionById } from '../../../../services/responseService';

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const { data: session, loading, error } = useApi(
    () => getSessionById(sessionId),
    [sessionId],
  );

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>
        Cargando resultados...
      </div>
    );
  }

  if (error || !session) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        {error ?? 'Sesión no encontrada.'}
      </div>
    );
  }

  const isTraining = session.form?.type === 'TRAINING';
  const passed = session.passed;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ backgroundColor: 'var(--color-surface-container-lowest)', width: '100%', maxWidth: '600px', borderRadius: '32px', padding: '48px', textAlign: 'center', border: '1px solid var(--color-outline-variant)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '9999px',
            backgroundColor: passed ? 'var(--color-secondary-container)' : 'var(--color-surface-variant)',
            color: passed ? 'var(--color-on-secondary-container)' : 'var(--color-on-surface-variant)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
              {passed ? 'verified' : 'assignment_turned_in'}
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--color-on-surface)' }}>
            {passed ? '¡Felicidades!' : '¡Formulario enviado!'}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--color-on-surface-variant)', marginBottom: '40px', lineHeight: 1.5 }}>
            Has completado con éxito: <br/>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{session.form?.title}</span>
          </p>

          {isTraining && session.score !== null && session.score !== undefined && (
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '20px', padding: '24px', marginBottom: '40px', border: '1px solid var(--color-outline-variant)' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--color-outline)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Tu puntaje</p>
              <h2 style={{ fontSize: '48px', margin: 0, color: passed ? '#10b981' : 'var(--color-on-surface)' }}>{Number(session.score).toFixed(1)}%</h2>
              <p style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 600, color: passed ? '#10b981' : 'var(--color-error)' }}>
                {passed ? 'Has aprobado esta capacitación.' : 'No has alcanzado el puntaje mínimo.'}
              </p>
            </div>
          )}

          {passed && isTraining && (
            <div style={{ backgroundColor: 'var(--color-primary-container)', borderRadius: '16px', padding: '20px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
               <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-on-primary-container)' }}>workspace_premium</span>
               <div>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-on-primary-container)' }}>Certificado disponible</p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-on-primary-container)', opacity: 0.8 }}>Tu certificación ha sido generada y está lista para descargar.</p>
               </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {passed && isTraining && (
              <button
                onClick={() => router.push('/certificates')}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}
              >
                Ver mis certificados
              </button>
            )}
            <button
              onClick={() => router.push('/my-tasks')}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', backgroundColor: 'transparent', color: 'var(--color-on-surface)', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}
            >
              Volver a mis tareas
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
