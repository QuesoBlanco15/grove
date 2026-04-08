import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppState } from '@/types/budget';

const STORAGE_KEY = '@grove/app-state';

export async function loadAppState(): Promise<AppState | null> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  if (!json) return null;
  return JSON.parse(json) as AppState;
}

export async function saveAppState(state: AppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
