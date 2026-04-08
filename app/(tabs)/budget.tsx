import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CategoryRow } from '@/components/CategoryRow';
import { useAppState, useCurrentMonth } from '@/contexts/AppContext';
import { getCategorySpent, getTotalSpent, getTotalBudgeted, getMonthDisplayName } from '@/utils/budget';

export default function BudgetScreen() {
  const { state } = useAppState();
  const month = useCurrentMonth();

  if (!state || !month) return null;

  const totalSpent = getTotalSpent(month);
  const totalBudget = getTotalBudgeted(month);
  const remaining = totalBudget - totalSpent;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Budget</ThemedText>
          <ThemedText style={styles.subtitle}>
            {getMonthDisplayName(state.currentMonthKey)}
          </ThemedText>
          <ThemedText style={styles.remaining}>
            ${remaining.toFixed(2)} remaining of ${totalBudget.toFixed(2)}
          </ThemedText>
        </View>
        <FlatList
          data={month.categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryRow
              category={item}
              spent={getCategorySpent(month, item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, gap: 4, marginBottom: 8 },
  title: { fontSize: 26 },
  subtitle: { fontSize: 15, opacity: 0.6 },
  remaining: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  list: { paddingBottom: 32 },
  separator: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginHorizontal: 16 },
});
