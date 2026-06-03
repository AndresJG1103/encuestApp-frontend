"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '../../../hooks';
import { verifyCertificate } from '../../../services/certificateService';
import { Badge, Card, EmptyState, Spinner } from '../../../components/ui';

export default function VerifyCertificatePage() {
  const params = useParams();
  const code = params.code as string;

  const { data: cert, loading, error } = useApi(() => verifyCertificate(code), [code]);

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-on-surface m-0">Verificación de Certificado</h1>
          <p className="text-sm text-on-surface-variant m-0">LearnPulse</p>
        </div>

        {loading && <Spinner label="Verificando certificado..." />}

        {!loading && error && (
          <Card>
            <EmptyState
              icon="error"
              title="Certificado inválido"
              description="No se encontró ningún certificado con este código de verificación."
            />
          </Card>
        )}

        {!loading && cert && (
          <Card>
            <div className="flex items-center justify-center mb-4">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>

            <div className="text-center mb-6">
              <Badge tone="success">CERTIFICADO VÁLIDO</Badge>
              <h2 className="text-xl font-bold text-on-surface m-0 mt-3">
                {cert.form?.title ?? 'Capacitación'}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <Row label="Código de verificación" value={cert.verificationCode} mono />
              <Row label="Emitido" value={new Date(cert.issuedAt).toLocaleString()} />
              <Row label="ID del certificado" value={cert.id} mono />
            </div>

            {cert.pdfUrl && (
              <a
                href={cert.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="block mt-6 text-center text-sm font-semibold text-primary hover:underline"
              >
                Ver certificado PDF →
              </a>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 py-2 border-b border-outline-variant last:border-0">
      <span className="text-on-surface-variant">{label}</span>
      <span className={`text-on-surface text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}
