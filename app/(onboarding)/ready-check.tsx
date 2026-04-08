import { useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AmountInput } from '@/components/AmountInput';
import { GroveColors } from '@/constants/theme';

export default function ReadyCheck() {
  const router = useRouter();
  const [hasBuffer, setHasBuffer] = useState<boolean | null>(null);
  const [income, setIncome] = useState('');

  const canContinue = income.length > 0 && parseFloat(income) > 0;

  const handleContinue = () => {
    const mode = hasBuffer ? 'full' : 'buildup';
    router.push({
      pathname: '/(onboarding)/categories',
      params: { income, budgetMode: mode },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <ThemedText type="title" style={styles.title}>
              Quick question
            </ThemedText>
            <ThemedText style={styles.body}>
              Do you already have a full month of income saved up and ready to use as
              this month&apos;s budget?
            </ThemedText>

            <View style={styles.choices}>
              <Pressable
                style={[styles.choice, hasBuffer === true && styles.choiceSelected]}
                onPress={() => setHasBuffer(true)}
              >
                <ThemedText style={styles.choiceEmoji}>✅</ThemedText>
                <ThemedText style={[styles.choiceText, hasBuffer === true && styles.choiceTextSelected]}>
                  {"Yes, I'm ready!"}
                </ThemedText>
                <ThemedText style={styles.choiceDetail}>
                  {"I have last month's income set aside"}
                </ThemedText>
              </Pressable>

              <Pressable
                style={[styles.choice, hasBuffer === false && styles.choiceSelected]}
                onPress={() => setHasBuffer(false)}
              >
                <ThemedText style={styles.choiceEmoji}>🌱</ThemedText>
                <ThemedText style={[styles.choiceText, hasBuffer === false && styles.choiceTextSelected]}>
                  Not yet
                </ThemedText>
                <ThemedText style={styles.choiceDetail}>
                  {"I'll build up to it — help me save toward a one-month buffer"}
                </ThemedText>
              </Pressable>
            </View>

            {hasBuffer !== null && (
              <View style={styles.incomeSection}>
                <ThemedText style={styles.label}>
                  {hasBuffer
                    ? 'How much did you earn last month?'
                    : "What's your expected monthly income?"}
                </ThemedText>
                <AmountInput value={income} onChangeText={setIncome} large />
                {!hasBuffer && (
                  <ThemedText style={styles.hint}>
                    {"We'll help you save toward having $"}{income || '0'}{" set aside. "}
                    {"Once you have a full month's buffer, you can switch to real"}
                    last-month budgeting!
                  </ThemedText>
                )}
              </View>
            )}
          </ScrollView>

          {canContinue && (
            <Pressable style={styles.button} onPress={handleContinue}>
              <ThemedText style={styles.buttonText}>Set up categories</ThemedText>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },
  flex: { flex: 1 },
  scroll: { paddingTop: 40, paddingBottom: 24, gap: 20 },
  title: { fontSize: 26 },
  body: { fontSize: 16, lineHeight: 24, opacity: 0.8 },
  choices: { gap: 12 },
  choice: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  choiceSelected: {
    borderColor: GroveColors.green,
    backgroundColor: GroveColors.cream,
  },
  choiceEmoji: { fontSize: 24 },
  choiceText: { fontSize: 17, fontWeight: '600' },
  choiceTextSelected: { color: GroveColors.green },
  choiceDetail: { fontSize: 14, opacity: 0.6 },
  incomeSection: { gap: 12 },
  label: { fontSize: 16, fontWeight: '600' },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
    color: GroveColors.green,
  },
  button: {
    backgroundColor: GroveColors.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
