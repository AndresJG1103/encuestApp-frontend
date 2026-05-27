export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
  assetId: string;
}

export interface MediaAsset {
  id: string;
  tenantId: string;
  uploadedById: string;
  fileKey: string;
  mimeType: string;
  sizeBytes: number;
  confirmed: boolean;
  createdAt: string;
}
