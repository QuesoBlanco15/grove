import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider, useAppState } from '@/contexts/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { state, loading } = useAppState();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (!state || !state.onboardingComplete) {
      if (!inOnboarding) router.replace('/(onboarding)');
    } else {
      if (inOnboarding) router.replace('/(tabs)');
    }
  }, [state, loading, router, segments]);

  return (
    <Stack>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AppProvider>
    </ThemeProvider>
  );
}
