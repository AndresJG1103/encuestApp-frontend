import type { Section } from './section';

export type FormType = 'SURVEY' | 'TRAINING';
export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface FormConfig {
  sequential?: boolean;
  allowSkip?: boolean;
  passingScore?: number;
  maxAttempts?: number;
  timeLimit?: number;
  shuffleQuestions?: boolean;
  showResultsAfter?: boolean;
  certificateOnPass?: boolean;
}

export interface Form {
  id: string;
  tenantId?: string;
  createdById?: string;
  title: string;
  description?: string;
  type: FormType;
  status: FormStatus;
  config: FormConfig;
  version: number;
  parentFormId?: string | null;
  createdAt: string;
  updatedAt: string;
  sections?: Section[];
  createdBy?: { id: string; firstName: string; lastName: string };
}

export interface CreateFormInput {
  title: string;
  description?: string;
  type: FormType;
  config?: FormConfig;
}

export interface UpdateFormInput {
  title?: string;
  description?: string;
  config?: FormConfig;
}

export interface FormFilters {
  page?: number;
  limit?: number;
  type?: FormType;
  status?: FormStatus;
}
