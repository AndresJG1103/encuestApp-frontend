"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePaginated } from '../../hooks';
import { getMySessions } from '../../services/responseService';
import type { ResponseSession } from '../../types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  PageLayout,
  Spinner,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Table,
} from '../../components/ui';

const statusTone = (status: string): 'success' | 'warning' | 'neutral' | 'danger' => {
  if (status === 'COMPLETED') return 'success';
  if (status === 'IN_PROGRESS') return 'warning';
  if (status === 'ABANDONED') return 'danger';
  return 'neutral';
};

export default function MySessionsPage() {
  const router = useRouter();
  const list = usePaginated<ResponseSession, Record<string, never>>(getMySessions, {});

  return (
    <PageLayout title="Mis Sesiones">
      <Card padded={false}>
        {list.loading ? (
          <Spinner label="Cargando sesiones..." />
        ) : list.error ? (
          <EmptyState icon="error" title="Error" description={list.error} />
        ) : list.data.length === 0 ? (
          <EmptyState
            icon="history"
            title="Sin sesiones"
            description="Aún no has iniciado ningún formulario."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Formulario</TH>
                <TH>Tipo</TH>
                <TH>Estado</TH>
                <TH className="text-right">Score</TH>
                <TH>Intento</TH>
                <TH>Iniciado</TH>
                <TH className="text-right">Acciones</TH>
              </TR>
            </THead>
            <TBody>
              {list.data.map((s) => (
                <TR key={s.id}>
                  <TD className="font-semibold">{s.form?.title ?? '—'}</TD>
                  <TD>
                    <Badge tone={s.form?.type === 'TRAINING' ? 'info' : 'neutral'}>
                      {s.form?.type ?? '—'}
                    </Badge>
                  </TD>
                  <TD>
                    <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                  </TD>
                  <TD className="text-right">
                    {s.score !== null && s.score !== undefined ? `${Number(s.score).toFixed(1)}%` : '—'}
                  </TD>
                  <TD>#{s.attempt}</TD>
                  <TD className="text-on-surface-variant">
                    {new Date(s.startedAt).toLocaleDateString()}
                  </TD>
                  <TD className="text-right">
                    {s.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="play_arrow"
                        onClick={() => router.push(`/resolver/${s.id}`)}
                      >
                        Continuar
                      </Button>
                    )}
                    {s.status === 'COMPLETED' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="visibility"
                        onClick={() => router.push(`/resolver/${s.id}/result`)}
                      >
                        Ver resultado
                      </Button>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}

        {list.meta && list.meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-outline-variant bg-surface-container-low">
            <p className="text-sm text-on-surface-variant m-0">
              Página {list.meta.page} de {list.meta.totalPages} · {list.meta.total} sesiones
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={list.page === 1}
                onClick={() => list.setPage(list.page - 1)}
              >
                <Icon name="chevron_left" size={18} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={list.page === list.meta.totalPages}
                onClick={() => list.setPage(list.page + 1)}
              >
                <Icon name="chevron_right" size={18} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </PageLayout>
  );
}
