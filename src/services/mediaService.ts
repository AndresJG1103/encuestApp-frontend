import { apiFetch, extractError } from '../lib/api';
import type { PresignedUrlResponse } from '../types';

export type { PresignedUrlResponse } from '../types';

export const getPresignedUrl = async (
  fileName: string,
  mimeType: string,
  sizeBytes: number,
): Promise<PresignedUrlResponse> => {
  const res = await apiFetch('/media/presigned-url', {
    method: 'POST',
    body: JSON.stringify({ fileName, mimeType, sizeBytes }),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al obtener URL de subida'));
  }

  const data = await res.json();
  return data.data;
};

export const confirmUpload = async (assetId: string): Promise<void> => {
  const res = await apiFetch('/media/confirm', {
    method: 'POST',
    body: JSON.stringify({ assetId }),
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al confirmar la subida del archivo'));
  }
};

export const deleteMedia = async (assetId: string): Promise<void> => {
  const res = await apiFetch(`/media/${assetId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(await extractError(res, 'Error al eliminar el archivo'));
  }
};

export const uploadFile = async (file: File): Promise<string> => {
  const { uploadUrl, fileKey, assetId } = await getPresignedUrl(file.name, file.type, file.size);

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('Error al subir el archivo a S3');
  }

  await confirmUpload(assetId);
  return fileKey;
};
