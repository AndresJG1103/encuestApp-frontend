"use client";

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { getMyCertificates, Certificate } from '../../services/certificateService';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getMyCertificates();
        setCertificates(data.data);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-outline)' }}>Cargando tus certificados...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--color-background)' }}>
      <Sidebar />

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: 'var(--color-on-surface)' }}>Mis Certificaciones</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {certificates.length === 0 ? (
            <p style={{ color: 'var(--color-outline)' }}>Aún no has obtenido ningún certificado.</p>
          ) : (
            certificates.map((cert) => (
              <div key={cert.id} style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-outline-variant)', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-tertiary-container)', color: 'var(--color-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', margin: '0 0 4px 0', color: 'var(--color-on-surface)' }}>{cert.form?.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-outline)', margin: 0 }}>Emitido el {new Date(cert.issuedAt).toLocaleDateString()}</p>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontSize: '11px', color: 'var(--color-outline)', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '16px' }}>
                    Código: {cert.verificationCode}
                  </p>
                  <button 
                    onClick={() => handleDownload(cert.pdfUrl)}
                    style={{ 
                      width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-primary)', 
                      backgroundColor: 'transparent', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' 
                    }}
                  >
                    Ver PDF
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
