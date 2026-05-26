"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/Sidebar';
import { getMyAssignments, Assignment } from '../../services/assignmentService';
import { startSession } from '../../services/responseService';
import { useNotification } from '../../context/NotificationContext';

export default function MyTasksPage() {
  const router = useRouter();
  const { notify } = useNotification();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getMyAssignments();
        setAssignments(data.data);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStartForm = async (formId: string) => {
    try {
      const session = await startSession(formId);
      router.push(`/resolver/${session.id}`);
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>Cargando tus tareas...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: 'var(--color-on-surface)' }}>Mis Tareas Pendientes</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {assignments.length === 0 ? (
            <p style={{ color: 'var(--color-outline)' }}>No tienes tareas asignadas en este momento.</p>
          ) : (
            assignments.map((assignment) => (
              <div key={assignment.id} style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  {assignment.form?.type}
                </span>
                <h3 style={{ fontSize: '20px', margin: '8px 0', color: 'var(--color-on-surface)' }}>{assignment.form?.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-outline)', marginBottom: '24px' }}>
                  Vence: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'Sin fecha límite'}
                </p>
                <button 
                  onClick={() => handleStartForm(assignment.formId)}
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none', 
                    backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: 600, cursor: 'pointer' 
                  }}
                >
                  {assignment.status === 'IN_PROGRESS' ? 'Continuar' : 'Comenzar'}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
