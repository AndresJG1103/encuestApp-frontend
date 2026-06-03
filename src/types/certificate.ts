export interface Certificate {
  id: string;
  sessionId?: string;
  formId: string;
  userId: string;
  issuedAt: string;
  pdfUrl: string;
  verificationCode: string;
  form?: {
    title: string;
  };
}
