import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar } from '@/components/ProgressBar';
import type { Category } from '@/types/budget';

interface CategoryRowProps {
  category: Category;
  spent: number;
  onPress?: () => void;
}

export function CategoryRow({ category, spent, onPress }: CategoryRowProps) {
  const remaining = category.budgeted - spent;

  const content = (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.emoji}>{category.emoji}</ThemedText>
        <ThemedText style={styles.name}>{category.name}</ThemedText>
        <ThemedText style={styles.amount}>
          ${remaining.toFixed(2)} left
        </ThemedText>
      </View>
      <ProgressBar spent={spent} total={category.budgeted} />
      <ThemedText style={styles.detail}>
        ${spent.toFixed(2)} of ${category.budgeted.toFixed(2)}
      </ThemedText>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
  },
  detail: {
    fontSize: 12,
    opacity: 0.6,
  },
});
