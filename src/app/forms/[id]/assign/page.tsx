"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '../../../../components/Sidebar';
import { getFormById, Form } from '../../../../services/formService';
import { getUsers, User } from '../../../../services/userService';
import { createAssignment } from '../../../../services/assignmentService';
import { useNotification } from '../../../../context/NotificationContext';

export default function AssignFormPage() {
  const router = useRouter();
  const { notify } = useNotification();
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formData, usersData] = await Promise.all([
          getFormById(formId),
          getUsers({ limit: 100 })
        ]);
        setForm(formData);
        setUsers(usersData.data);
      } catch (err: any) {
        notify(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [formId]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setAssigning(true);
    try {
      await createAssignment({
        formId,
        userId: selectedUser,
        dueDate: dueDate || undefined
      });
      notify('Formulario asignado correctamente', 'success');
      router.push('/forms');
    } catch (err: any) {
      notify(err.message, 'error');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>Cargando...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ 
          height: '72px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-outline-variant)',
          display: 'flex', alignItems: 'center', padding: '0 32px'
        }}>
           <button 
            onClick={() => router.back()} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px', color: 'var(--color-on-surface)', display: 'flex', alignItems: 'center' }}
           >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-on-surface)', margin: 0 }}>Asignar Formulario: {form?.title}</h1>
        </header>

        <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--color-surface-container-lowest)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Seleccionar Usuario</label>
                <select 
                  required value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                >
                  <option value="">Seleccione un usuario...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Fecha de Vencimiento (Opcional)</label>
                <input 
                  type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)', backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={assigning}
                style={{ 
                  padding: '14px', borderRadius: '12px', border: 'none',
                  backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: 600, 
                  cursor: assigning ? 'not-allowed' : 'pointer', opacity: assigning ? 0.7 : 1
                }}
              >
                {assigning ? 'Asignando...' : 'Confirmar Asignación'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
