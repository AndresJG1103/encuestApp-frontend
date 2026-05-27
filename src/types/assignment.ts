import type { FormType } from './form';

export type AssignmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export interface Assignment {
  id: string;
  formId: string;
  userId: string;
  assignedById?: string;
  dueDate?: string;
  status: AssignmentStatus;
  createdAt?: string;
  updatedAt?: string;
  form?: {
    id?: string;
    title: string;
    type: FormType;
    status?: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAssignmentInput {
  formId: string;
  userId: string;
  dueDate?: string;
}

export interface UpdateAssignmentInput {
  dueDate?: string;
  status?: AssignmentStatus;
}
