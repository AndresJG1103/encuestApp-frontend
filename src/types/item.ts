export type ItemType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'PDF' | 'QUESTION';

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'OPEN_TEXT'
  | 'SCALE'
  | 'BOOLEAN'
  | 'RATING';

export interface QuestionContent {
  questionType: QuestionType;
  text: string;
  required?: boolean;
  options?: string[];
  correctAnswers?: string[];
  points?: number;
  scaleMin?: number;
  scaleMax?: number;
  explanation?: string;
}

export interface MediaContent {
  text?: string;
  imageUrl?: string;
  url?: string;
  alt?: string;
  caption?: string;
  duration?: number;
}

// Permissive content shape — back stores JSONB, narrowing happens per-component
// Use QuestionContent / MediaContent as type-guard targets when needed.
export type ItemContent = Record<string, any>;

export interface Item {
  id: string;
  sectionId: string;
  type: ItemType;
  order: number;
  content: ItemContent;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemInput {
  type: ItemType | string;
  order: number;
  content: ItemContent;
}

export interface UpdateItemInput {
  order?: number;
  content?: ItemContent;
}

export const isQuestionContent = (c: ItemContent): c is QuestionContent =>
  typeof c?.questionType === 'string';
