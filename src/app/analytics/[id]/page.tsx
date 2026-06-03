"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Permissions } from '../../../lib/permissions';
import { useApi } from '../../../hooks';
import { getFormById } from '../../../services/formService';
import {
  getFormSummary,
  getQuestionAnalytics,
  getTimeAnalytics,
  getUserProgress,
} from '../../../services/analyticsService';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageLayout,
  Spinner,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from '../../../components/ui';

type TabKey = 'summary' | 'questions' | 'users' | 'time';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'summary', label: 'Resumen', icon: 'summarize' },
  { key: 'questions', label: 'Preguntas', icon: 'help' },
  { key: 'users', label: 'Usuarios', icon: 'group' },
  { key: 'time', label: 'Tiempo', icon: 'schedule' },
];

export default function FormAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>('summary');

  const form = useApi(() => getFormById(id), [id]);

  if (!Permissions.viewAnalytics(user)) {
    return (
      <PageLayout title="Analítica">
        <EmptyState icon="lock" title="Acceso denegado" />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={form.data?.title ?? 'Analítica'}
      actions={
        <Button variant="secondary" icon="arrow_back" onClick={() => router.push('/analytics')}>
          Volver
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex gap-2 border-b border-outline-variant">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer bg-transparent ${
                tab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'summary' && <SummaryTab formId={id} />}
        {tab === 'questions' && <QuestionsTab formId={id} />}
        {tab === 'users' && <UsersTab formId={id} />}
        {tab === 'time' && <TimeTab formId={id} />}
      </div>
    </PageLayout>
  );
}

function SummaryTab({ formId }: { formId: string }) {
  const { data, loading, error } = useApi(() => getFormSummary(formId), [formId]);
  if (loading) return <Spinner label="Cargando resumen..." />;
  if (error) return <EmptyState icon="error" title="Error" description={error} />;
  if (!data) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Metric label="Sesiones totales" value={data.total} />
      <Metric label="Completadas" value={data.completed} />
      <Metric label="Aprobadas" value={data.passed} />
      <Metric label="Promedio" value={`${data.avgScore?.toFixed?.(1) ?? 0}%`} />
    </div>
  );
}

function QuestionsTab({ formId }: { formId: string }) {
  const { data, loading, error } = useApi(() => getQuestionAnalytics(formId), [formId]);
  if (loading) return <Spinner label="Cargando preguntas..." />;
  if (error) return <EmptyState icon="error" title="Error" description={error} />;
  if (!data || data.length === 0) {
    return <EmptyState icon="help" title="Sin respuestas" description="Aún no hay respuestas para este formulario." />;
  }
  return (
    <Card padded={false}>
      <Table>
        <THead>
          <TR>
            <TH>Item ID</TH>
            <TH className="text-right">Correctas</TH>
            <TH className="text-right">Incorrectas</TH>
            <TH className="text-right">Total</TH>
            <TH className="text-right">% acierto</TH>
          </TR>
        </THead>
        <TBody>
          {data.map((q) => {
            const acc = q.totalAnswers > 0 ? (q.correctCount / q.totalAnswers) * 100 : 0;
            return (
              <TR key={q.itemId}>
                <TD className="font-mono text-xs">{q.itemId.slice(0, 8)}…</TD>
                <TD className="text-right">{q.correctCount}</TD>
                <TD className="text-right">{q.incorrectCount}</TD>
                <TD className="text-right">{q.totalAnswers}</TD>
                <TD className="text-right">
                  <Badge tone={acc >= 70 ? 'success' : acc >= 40 ? 'warning' : 'danger'}>
                    {acc.toFixed(1)}%
                  </Badge>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </Card>
  );
}

function UsersTab({ formId }: { formId: string }) {
  const { data, loading, error } = useApi(() => getUserProgress(formId), [formId]);
  if (loading) return <Spinner label="Cargando usuarios..." />;
  if (error) return <EmptyState icon="error" title="Error" description={error} />;
  if (!data || data.length === 0) {
    return <EmptyState icon="group" title="Sin progreso" description="Nadie ha iniciado este formulario." />;
  }
  return (
    <Card padded={false}>
      <Table>
        <THead>
          <TR>
            <TH>Usuario</TH>
            <TH>Estado</TH>
            <TH className="text-right">Score</TH>
            <TH>Completado</TH>
          </TR>
        </THead>
        <TBody>
          {data.map((u) => (
            <TR key={u.userId}>
              <TD className="font-mono text-xs">{u.userId.slice(0, 8)}…</TD>
              <TD>
                <Badge tone={u.status === 'COMPLETED' ? 'success' : 'neutral'}>{u.status}</Badge>
              </TD>
              <TD className="text-right">{u.score !== null ? `${u.score.toFixed(1)}%` : '—'}</TD>
              <TD>{u.completedAt ? new Date(u.completedAt).toLocaleString() : '—'}</TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}

function TimeTab({ formId }: { formId: string }) {
  const { data, loading, error } = useApi(() => getTimeAnalytics(formId), [formId]);
  if (loading) return <Spinner label="Cargando tiempos..." />;
  if (error) return <EmptyState icon="error" title="Error" description={error} />;
  if (!data) return null;
  const minutes = data.avgTimeMs > 0 ? (data.avgTimeMs / 1000 / 60).toFixed(1) : '0';
  return (
    <div className="grid grid-cols-3 gap-4">
      <Metric label="Tiempo promedio" value={`${minutes} min`} />
      <Metric label="Completados" value={data.completedCount} />
      <Metric label="Abandonados" value={data.abandonedCount} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <p className="text-xs text-outline uppercase tracking-wider m-0 mb-2">{label}</p>
      <p className="text-3xl font-bold text-on-surface m-0">{value}</p>
    </Card>
  );
}
