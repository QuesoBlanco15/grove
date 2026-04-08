import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { GroveColors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import type { TreeHealth } from '@/utils/budget';

interface TreeVisualProps {
  health: TreeHealth;
  streak: number;
}

const CANOPY_COLORS: Record<TreeHealth, string> = {
  thriving: GroveColors.green,
  healthy: GroveColors.greenLight,
  wilting: GroveColors.amber,
  dead: '#8B7355',
};

const CANOPY_SIZES: Record<TreeHealth, number> = {
  thriving: 140,
  healthy: 120,
  wilting: 110,
  dead: 90,
};

export function TreeVisual({ health, streak }: TreeVisualProps) {
  const canopyColor = CANOPY_COLORS[health];
  const canopySize = CANOPY_SIZES[health];

  const pulseStyle = useAnimatedStyle(() => {
    if (health !== 'thriving') return { transform: [{ scale: 1 }] };
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.05, { duration: 2000 }),
              withTiming(1, { duration: 2000 })
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  const droopStyle = useAnimatedStyle(() => {
    if (health !== 'wilting') return { transform: [{ rotate: '0deg' }] };
    return {
      transform: [{ rotate: withTiming('3deg', { duration: 1000 }) }],
    };
  });

  const treeEmoji = health === 'dead' ? '🥀' : health === 'thriving' ? '✨' : '';

  return (
    <View style={styles.container}>
      <Animated.View style={[droopStyle]}>
        <Animated.View style={[pulseStyle, styles.treeWrapper]}>
          {/* Canopy */}
          <View
            style={[
              styles.canopy,
              {
                backgroundColor: canopyColor,
                width: canopySize,
                height: canopySize,
                borderRadius: canopySize / 2,
              },
            ]}
          >
            {health === 'thriving' && streak > 0 && (
              <ThemedText style={styles.streakLabel}>🌟</ThemedText>
            )}
          </View>
          {/* Trunk */}
          <View style={styles.trunk} />
        </Animated.View>
      </Animated.View>
      {treeEmoji ? (
        <ThemedText style={styles.statusEmoji}>{treeEmoji}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  treeWrapper: {
    alignItems: 'center',
  },
  canopy: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trunk: {
    width: 20,
    height: 40,
    backgroundColor: GroveColors.bark,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginTop: -4,
  },
  streakLabel: {
    fontSize: 28,
  },
  statusEmoji: {
    fontSize: 20,
    marginTop: 8,
  },
});
