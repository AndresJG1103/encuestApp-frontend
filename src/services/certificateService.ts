import { apiFetch } from '../lib/api';

export interface Certificate {
  id: string;
  formId: string;
  userId: string;
  issuedAt: string;
  pdfUrl: string;
  verificationCode: string;
  form?: {
    title: string;
  };
}

export const getMyCertificates = async (params: { page?: number; limit?: number } = {}): Promise<any> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await apiFetch(`/certificates/my?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error('Error al obtener mis certificados');
  }
  const data = await res.json();
  return data.data;
};

export const downloadCertificate = async (id: string): Promise<Certificate> => {
  const res = await apiFetch(`/certificates/${id}/download`);
  if (!res.ok) {
    throw new Error('Error al descargar el certificado');
  }
  const data = await res.json();
  return data.data;
};
