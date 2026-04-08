import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GroveColors } from '@/constants/theme';

export default function OnboardingWelcome() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <ThemedText style={styles.tree}>🌳</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Welcome to Grove
          </ThemedText>
          <ThemedText style={styles.body}>
            Grove helps you budget using a simple idea: spend this month only
            what you earned last month.
          </ThemedText>
          <ThemedText style={styles.body}>
            No surprises. No guessing. Just a clear plan based on money you
            already have.
          </ThemedText>
          <ThemedText style={styles.body}>
            Along the way, you&apos;ll grow a tree that reflects your budgeting
            habits. Stay on track and watch it thrive!
          </ThemedText>
        </View>
        <Pressable style={styles.button} onPress={() => router.push('/(onboarding)/ready-check')}>
          <ThemedText style={styles.buttonText}>{"Let's get started"}</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  tree: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    backgroundColor: GroveColors.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
