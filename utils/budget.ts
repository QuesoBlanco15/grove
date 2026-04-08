import type { AppState, MonthData } from '@/types/budget';

export type TreeHealth = 'thriving' | 'healthy' | 'wilting' | 'dead';

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCategorySpent(monthData: MonthData, categoryId: string): number {
  return monthData.transactions
    .filter((t) => t.categoryId === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalSpent(monthData: MonthData): number {
  return monthData.transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalBudgeted(monthData: MonthData): number {
  return monthData.categories.reduce((sum, c) => sum + c.budgeted, 0);
}

export function getTreeHealth(monthData: MonthData, streak: number): TreeHealth {
  const budget = getTotalBudgeted(monthData);
  if (budget === 0) return 'healthy';

  const spent = getTotalSpent(monthData);
  const ratio = spent / budget;

  if (ratio > 1) return 'dead';
  if (ratio >= 0.9) return 'wilting';
  if (ratio < 0.75 && streak >= 7) return 'thriving';
  return 'healthy';
}

export function processCheckIn(state: AppState): AppState {
  const today = getTodayDate();

  // Already checked in today
  if (state.lastCheckInDate === today) return state;

  const updated = { ...state, lastCheckInDate: today };

  // First ever check-in
  if (!state.lastCheckInDate) {
    updated.streak = 1;
    return updated;
  }

  // Check if yesterday
  const lastDate = new Date(state.lastCheckInDate + 'T00:00:00');
  const todayDate = new Date(today + 'T00:00:00');
  const diffDays = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    // Consecutive day
    updated.streak = state.streak + 1;
  } else if (diffDays > 1) {
    // Missed day(s)
    if (state.wateringCans > 0) {
      updated.wateringCans = state.wateringCans - 1;
      // Keep streak
    } else {
      updated.streak = 1;
    }
  }

  return updated;
}

export function handleMonthRollover(state: AppState): AppState {
  const currentKey = getCurrentMonthKey();

  if (state.currentMonthKey === currentKey) return state;

  const updated = { ...state, currentMonthKey: currentKey };

  // Reset watering cans for the new month
  if (state.wateringCansResetMonth !== currentKey) {
    updated.wateringCans = 2;
    updated.wateringCansResetMonth = currentKey;
  }

  // Create new month data if it doesn't exist
  if (!updated.months[currentKey]) {
    const prevMonth = state.months[state.currentMonthKey];
    updated.months = {
      ...state.months,
      [currentKey]: {
        monthKey: currentKey,
        income: 0,
        categories: prevMonth
          ? prevMonth.categories.map((c) => ({ ...c, budgeted: c.budgeted }))
          : [],
        transactions: [],
      },
    };
  }

  return updated;
}

export function getMonthDisplayName(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
