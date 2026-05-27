import { apiFetch, extractError } from '../lib/api';
import type { Certificate, PaginatedResult, PaginationParams } from '../types';

export type { Certificate } from '../types';

export const getMyCertificates = async (
  params: PaginationParams = {},
): Promise<PaginatedResult<Certificate>> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await apiFetch(`/certificates/my?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener mis certificados'));
  }
  const data = await res.json();
  return data.data;
};

export const downloadCertificate = async (id: string): Promise<Certificate> => {
  const res = await apiFetch(`/certificates/${id}/download`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al descargar el certificado'));
  }
  const data = await res.json();
  return data.data;
};

export const verifyCertificate = async (code: string): Promise<Certificate> => {
  const res = await apiFetch(`/certificates/verify/${code}`);
  if (!res.ok) {
    throw new Error(await extractError(res, 'Certificado no válido'));
  }
  const data = await res.json();
  return data.data;
};
