import type { Item } from './item';

export type BranchingCondition =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'gte'
  | 'lte';

export interface BranchingRule {
  questionItemId: string;
  condition: BranchingCondition;
  value: string | number;
  goToSectionId: string;
}

export interface Section {
  id: string;
  formId: string;
  title: string;
  order: number;
  branchingRules: BranchingRule[];
  items?: Item[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSectionInput {
  title: string;
  order: number;
  branchingRules?: BranchingRule[];
}

export interface UpdateSectionInput {
  title?: string;
  order?: number;
  branchingRules?: BranchingRule[];
}
