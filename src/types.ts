export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Career' | 'Health' | 'Personal' | 'Finance' | 'Productivity' | 'Learning' | 'Other';

export interface Goal {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt?: string | null;
  targetDate?: string;
  notes?: string;
}

export interface GoalsDatabase {
  version: number;
  updatedAt: string;
  motivationalHeading: string;
  motivationalAuthor?: string;
  goals: Goal[];
}

export type FilterStatus = 'all' | 'active' | 'completed';

