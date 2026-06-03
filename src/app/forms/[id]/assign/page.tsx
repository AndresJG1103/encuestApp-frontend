"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { useNotification } from '../../../../context/NotificationContext';
import { Permissions } from '../../../../lib/permissions';
import { useApi, useAsyncAction } from '../../../../hooks';
import { getFormById } from '../../../../services/formService';
import { getUsers } from '../../../../services/userService';
import {
  createAssignment,
  getAssignments,
  updateAssignment,
} from '../../../../services/assignmentService';
import type {
  Assignment,
  AssignmentStatus,
  User,
} from '../../../../types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  Input,
  PageLayout,
  Select,
  Spinner,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from '../../../../components/ui';

const STATUS_OPTIONS: AssignmentStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED'];

const statusTone = (s: AssignmentStatus): 'neutral' | 'warning' | 'success' | 'danger' => {
  if (s === 'COMPLETED') return 'success';
  if (s === 'IN_PROGRESS') return 'warning';
  if (s === 'EXPIRED') return 'danger';
  return 'neutral';
};

export default function AssignFormPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { notify, confirm } = useNotification();
  const formId = params.id as string;

  const [selectedUserId, setSelectedUserId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ dueDate: string; status: AssignmentStatus }>({
    dueDate: '',
    status: 'PENDING',
  });

  const formQuery = useApi(() => getFormById(formId), [formId]);
  const usersQuery = useApi(() => getUsers({ limit: 100 }), []);
  const assignmentsQuery = useApi(() => getAssignments({ formId, limit: 100 }), [formId]);

  const create = useAsyncAction(createAssignment, {
    onSuccess: () => {
      notify('Asignación creada', 'success');
      setSelectedUserId('');
      setDueDate('');
      assignmentsQuery.refetch();
    },
    onError: (msg) => notify(msg, 'error'),
  });

  const update = useAsyncAction(
    (input: { id: string; dueDate?: string; status?: AssignmentStatus }) =>
      updateAssignment(input.id, { dueDate: input.dueDate, status: input.status }),
    {
      onSuccess: () => {
        notify('Asignación actualizada', 'success');
        setEditingId(null);
        assignmentsQuery.refetch();
      },
      onError: (msg) => notify(msg, 'error'),
    },
  );

  if (!Permissions.assignForms(user)) {
    return (
      <PageLayout title="Asignar">
        <EmptyState icon="lock" title="Acceso denegado" />
      </PageLayout>
    );
  }

  const form = formQuery.data;
  const users = usersQuery.data?.data ?? [];
  const assignments = assignmentsQuery.data?.data ?? [];

  const assignedUserIds = new Set(assignments.map((a) => a.userId));
  const unassignedUsers = users.filter((u: User) => !assignedUserIds.has(u.id));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    await create.run({
      formId,
      userId: selectedUserId,
      dueDate: dueDate || undefined,
    });
  };

  const startEdit = (a: Assignment) => {
    setEditingId(a.id);
    setEditForm({
      dueDate: a.dueDate ? a.dueDate.slice(0, 10) : '',
      status: a.status,
    });
  };

  const saveEdit = async (id: string) => {
    await update.run({
      id,
      dueDate: editForm.dueDate || undefined,
      status: editForm.status,
    });
  };

  return (
    <PageLayout
      title={`Asignar: ${form?.title ?? '...'}`}
      actions={
        <Button variant="secondary" icon="arrow_back" onClick={() => router.push('/forms')}>
          Volver
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Crear nueva */}
        <Card>
          <h3 className="text-base font-semibold m-0 mb-4">Nueva asignación</h3>
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1 min-w-0">
              <Select
                label="Usuario"
                required
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Selecciona un usuario...</option>
                {unassignedUsers.map((u: User) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Input
                type="date"
                label="Vencimiento"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <Button type="submit" icon="add" loading={create.loading} disabled={!selectedUserId}>
              Asignar
            </Button>
          </form>
          {unassignedUsers.length === 0 && users.length > 0 && (
            <p className="text-xs text-outline m-0 mt-3">
              Todos los usuarios ya tienen este formulario asignado.
            </p>
          )}
        </Card>

        {/* Lista existentes */}
        <Card padded={false}>
          <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between">
            <h3 className="text-base font-semibold m-0">
              Asignaciones existentes ({assignments.length})
            </h3>
          </div>

          {assignmentsQuery.loading ? (
            <Spinner label="Cargando..." />
          ) : assignmentsQuery.error ? (
            <EmptyState icon="error" title="Error" description={assignmentsQuery.error} />
          ) : assignments.length === 0 ? (
            <EmptyState
              icon="assignment"
              title="Sin asignaciones"
              description="Aún no has asignado este formulario a nadie."
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Usuario</TH>
                  <TH>Estado</TH>
                  <TH>Vencimiento</TH>
                  <TH>Asignado</TH>
                  <TH className="text-right">Acciones</TH>
                </TR>
              </THead>
              <TBody>
                {assignments.map((a) => {
                  const isEditing = editingId === a.id;
                  return (
                    <TR key={a.id}>
                      <TD>
                        <p className="font-semibold m-0">
                          {a.user?.firstName} {a.user?.lastName}
                        </p>
                        <p className="text-xs text-outline m-0">{a.user?.email}</p>
                      </TD>
                      <TD>
                        {isEditing ? (
                          <select
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                status: e.target.value as AssignmentStatus,
                              }))
                            }
                            className="px-2 py-1 rounded border border-outline-variant bg-surface text-on-surface text-sm"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                        )}
                      </TD>
                      <TD>
                        {isEditing ? (
                          <input
                            type="date"
                            value={editForm.dueDate}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, dueDate: e.target.value }))
                            }
                            className="px-2 py-1 rounded border border-outline-variant bg-surface text-on-surface text-sm"
                          />
                        ) : a.dueDate ? (
                          new Date(a.dueDate).toLocaleDateString()
                        ) : (
                          <span className="text-outline">—</span>
                        )}
                      </TD>
                      <TD className="text-on-surface-variant text-xs">
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                      </TD>
                      <TD className="text-right">
                        {isEditing ? (
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              icon="close"
                              onClick={() => setEditingId(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              icon="check"
                              loading={update.loading}
                              onClick={() => saveEdit(a.id)}
                            >
                              Guardar
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" icon="edit" onClick={() => startEdit(a)}>
                            Editar
                          </Button>
                        )}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
