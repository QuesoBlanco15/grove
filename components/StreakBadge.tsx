import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface StreakBadgeProps {
  streak: number;
  wateringCans: number;
}

export function StreakBadge({ streak, wateringCans }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <ThemedText style={styles.text}>🔥 {streak} day streak</ThemedText>
      </View>
      <View style={styles.badge}>
        <ThemedText style={styles.text}>
          🚿 {wateringCans} freeze{wateringCans !== 1 ? 's' : ''} left
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
