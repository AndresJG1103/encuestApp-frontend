import type { FormConfig, FormType } from './form';

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface ProgressSnapshot {
  currentSectionIndex: number;
  visitedSectionIds: string[];
  answeredItemIds: string[];
  lastSavedAt: string;
}

export interface ResponseSession {
  id: string;
  formId: string;
  userId: string;
  attempt: number;
  status: SessionStatus;
  score?: number | null;
  passed?: boolean | null;
  progressSnapshot?: ProgressSnapshot;
  startedAt: string;
  completedAt?: string;
  form?: {
    id: string;
    title: string;
    type: FormType;
    config?: FormConfig;
  };
}

export type AnswerPayload =
  | { selected: string[] }
  | { text: string }
  | { value: number | boolean };

export interface ItemResponse {
  id: string;
  sessionId: string;
  itemId: string;
  answer: AnswerPayload;
  isCorrect: boolean | null;
  timeSpentMs: number;
  answeredAt: string;
}

export interface CompleteSessionResult {
  session: ResponseSession;
  score: number | null;
  passed: boolean | null;
  certificateQueued?: boolean;
}
