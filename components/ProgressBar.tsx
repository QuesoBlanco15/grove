import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GroveColors } from '@/constants/theme';

interface ProgressBarProps {
  spent: number;
  total: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ spent, total, color, height = 8 }: ProgressBarProps) {
  const ratio = total > 0 ? Math.min(spent / total, 1.5) : 0;
  const barColor = color ?? (ratio > 1 ? GroveColors.red : ratio > 0.9 ? GroveColors.amber : GroveColors.greenLight);

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${Math.min(ratio * 100, 100)}%`, { duration: 500 }),
  }));

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View style={[styles.fill, { backgroundColor: barColor, height }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: 4,
  },
});
