import { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TreeVisual } from '@/components/TreeVisual';
import { StreakBadge } from '@/components/StreakBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { useAppState, useCurrentMonth } from '@/contexts/AppContext';
import { getTotalSpent, getTotalBudgeted, getTreeHealth, getMonthDisplayName } from '@/utils/budget';
import { GroveColors } from '@/constants/theme';

export default function HomeScreen() {
  const { state, dispatch } = useAppState();
  const month = useCurrentMonth();

  useEffect(() => {
    if (state && state.onboardingComplete) {
      dispatch({ type: 'CHECK_IN' });
    }
  }, [state, dispatch]);

  if (!state || !month) return null;

  const totalSpent = getTotalSpent(month);
  const totalBudget = getTotalBudgeted(month);
  const remaining = totalBudget - totalSpent;
  const health = getTreeHealth(month, state.streak);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.title}>
            {getMonthDisplayName(state.currentMonthKey)}
          </ThemedText>

          <TreeVisual health={health} streak={state.streak} />
          <StreakBadge streak={state.streak} wateringCans={state.wateringCans} />

          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>Budget</ThemedText>
                <ThemedText style={styles.summaryValue}>${totalBudget.toFixed(2)}</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>Spent</ThemedText>
                <ThemedText style={styles.summaryValue}>${totalSpent.toFixed(2)}</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryLabel}>Left</ThemedText>
                <ThemedText
                  style={[styles.summaryValue, remaining < 0 && { color: GroveColors.red }]}
                >
                  ${remaining.toFixed(2)}
                </ThemedText>
              </View>
            </View>
            <ProgressBar spent={totalSpent} total={totalBudget} />
          </View>

          {state.budgetMode === 'buildup' && (
            <View style={styles.buildupCard}>
              <ThemedText style={styles.buildupTitle}>🌱 Building your buffer</ThemedText>
              <ThemedText style={styles.buildupBody}>
                {"Save toward having a full month of income ($"}{month.income.toFixed(2)}{") set aside. "}
                {"Once you're ready, switch to real last-month budgeting!"}
              </ThemedText>
              <Pressable
                style={styles.readyButton}
                onPress={() => dispatch({ type: 'SWITCH_TO_FULL_MODE' })}
              >
                <ThemedText style={styles.readyButtonText}>{"I'm ready — switch now"}</ThemedText>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  title: { fontSize: 24, textAlign: 'center', marginTop: 8 },
  card: {
    marginTop: 24,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: { alignItems: 'center', gap: 4 },
  summaryLabel: { fontSize: 13, opacity: 0.6, fontWeight: '500' },
  summaryValue: { fontSize: 20, fontWeight: '700' },
  buildupCard: {
    marginTop: 20,
    backgroundColor: GroveColors.cream,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  buildupTitle: { fontSize: 17, fontWeight: '700' },
  buildupBody: { fontSize: 14, lineHeight: 20, opacity: 0.8 },
  readyButton: {
    borderWidth: 2,
    borderColor: GroveColors.green,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  readyButtonText: { color: GroveColors.green, fontWeight: '600', fontSize: 15 },
});
