import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import type { AppState, Category, Transaction, BudgetMode } from '@/types/budget';
import { loadAppState, saveAppState, clearAllData } from '@/utils/storage';
import { generateId, getCurrentMonthKey, handleMonthRollover, processCheckIn } from '@/utils/budget';

// Actions
type AppAction =
  | { type: 'SET_STATE'; payload: AppState }
  | {
      type: 'COMPLETE_ONBOARDING';
      payload: { income: number; categories: Category[]; budgetMode: BudgetMode };
    }
  | { type: 'ADD_TRANSACTION'; payload: Omit<Transaction, 'id'> }
  | { type: 'UPDATE_INCOME'; payload: number }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'EDIT_CATEGORY'; payload: Category }
  | { type: 'REMOVE_CATEGORY'; payload: string }
  | { type: 'CHECK_IN' }
  | { type: 'USE_WATERING_CAN' }
  | { type: 'SWITCH_TO_FULL_MODE' }
  | { type: 'RESET_DATA' };

interface AppContextValue {
  state: AppState | null;
  loading: boolean;
  dispatch: (action: AppAction) => void;
}

const AppContext = createContext<AppContextValue>({
  state: null,
  loading: true,
  dispatch: () => {},
});

function getCurrentMonth(state: AppState) {
  return state.months[state.currentMonthKey];
}

function withUpdatedMonth(state: AppState, updater: (month: typeof state.months[string]) => typeof state.months[string]): AppState {
  const month = getCurrentMonth(state);
  if (!month) return state;
  return {
    ...state,
    months: {
      ...state.months,
      [state.currentMonthKey]: updater(month),
    },
  };
}

function appReducer(state: AppState | null, action: AppAction): AppState | null {
  if (action.type === 'SET_STATE') return action.payload;
  if (action.type === 'RESET_DATA') return null;
  if (!state) return state;

  switch (action.type) {
    case 'COMPLETE_ONBOARDING': {
      const monthKey = getCurrentMonthKey();
      return {
        ...state,
        onboardingComplete: true,
        budgetMode: action.payload.budgetMode,
        currentMonthKey: monthKey,
        streak: 0,
        lastCheckInDate: null,
        wateringCans: 2,
        wateringCansResetMonth: monthKey,
        months: {
          ...state.months,
          [monthKey]: {
            monthKey,
            income: action.payload.income,
            categories: action.payload.categories,
            transactions: [],
          },
        },
      };
    }

    case 'ADD_TRANSACTION': {
      const transaction: Transaction = {
        ...action.payload,
        id: generateId(),
      };
      return withUpdatedMonth(state, (month) => ({
        ...month,
        transactions: [...month.transactions, transaction],
      }));
    }

    case 'UPDATE_INCOME': {
      return withUpdatedMonth(state, (month) => ({
        ...month,
        income: action.payload,
      }));
    }

    case 'ADD_CATEGORY': {
      const category: Category = {
        ...action.payload,
        id: generateId(),
      };
      return withUpdatedMonth(state, (month) => ({
        ...month,
        categories: [...month.categories, category],
      }));
    }

    case 'EDIT_CATEGORY': {
      return withUpdatedMonth(state, (month) => ({
        ...month,
        categories: month.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      }));
    }

    case 'REMOVE_CATEGORY': {
      return withUpdatedMonth(state, (month) => ({
        ...month,
        categories: month.categories.filter((c) => c.id !== action.payload),
      }));
    }

    case 'CHECK_IN':
      return processCheckIn(state);

    case 'USE_WATERING_CAN':
      if (state.wateringCans <= 0) return state;
      return { ...state, wateringCans: state.wateringCans - 1 };

    case 'SWITCH_TO_FULL_MODE':
      return { ...state, budgetMode: 'full' };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null);
  const [loading, setLoading] = React.useState(true);

  // Load state on mount
  useEffect(() => {
    (async () => {
      const saved = await loadAppState();
      if (saved) {
        // Handle month rollover
        const rolled = handleMonthRollover(saved);
        dispatch({ type: 'SET_STATE', payload: rolled });
      }
      setLoading(false);
    })();
  }, []);

  // Persist state changes
  useEffect(() => {
    if (!loading && state) {
      saveAppState(state);
    }
  }, [state, loading]);

  // Handle reset
  const wrappedDispatch = useCallback(
    (action: AppAction) => {
      if (action.type === 'RESET_DATA') {
        clearAllData();
      }
      dispatch(action);
    },
    []
  );

  return (
    <AppContext.Provider value={{ state, loading, dispatch: wrappedDispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (ctx === undefined) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return ctx;
}

export function useCurrentMonth() {
  const { state } = useAppState();
  if (!state) return null;
  return state.months[state.currentMonthKey] ?? null;
}
