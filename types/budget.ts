export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  budgeted: number;
  emoji: string;
}

export interface Transaction {
  id: string;
  categoryId: CategoryId;
  amount: number;
  description: string;
  date: string; // ISO date YYYY-MM-DD
}

export interface MonthData {
  monthKey: string; // "YYYY-MM"
  income: number;
  categories: Category[];
  transactions: Transaction[];
}

export type BudgetMode = 'buildup' | 'full';

export interface AppState {
  onboardingComplete: boolean;
  budgetMode: BudgetMode;
  currentMonthKey: string;
  streak: number;
  lastCheckInDate: string | null; // ISO date YYYY-MM-DD
  wateringCans: number;
  wateringCansResetMonth: string;
  months: Record<string, MonthData>;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Dining', emoji: '🍕', budgeted: 0 },
  { name: 'Groceries', emoji: '🛒', budgeted: 0 },
  { name: 'Fun', emoji: '🎉', budgeted: 0 },
  { name: 'Transport', emoji: '🚌', budgeted: 0 },
  { name: 'Subscriptions', emoji: '📱', budgeted: 0 },
  { name: 'Textbooks', emoji: '📚', budgeted: 0 },
  { name: 'Other', emoji: '📦', budgeted: 0 },
];
