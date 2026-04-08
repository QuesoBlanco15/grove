import { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AmountInput } from '@/components/AmountInput';
import { useAppState, useCurrentMonth } from '@/contexts/AppContext';
import { getTodayDate } from '@/utils/budget';
import { GroveColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AddTransactionScreen() {
  const { dispatch } = useAppState();
  const month = useCurrentMonth();
  const textColor = useThemeColor({}, 'text');

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(getTodayDate());

  if (!month) return null;

  const handleAdd = () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      Alert.alert('Oops', 'Enter an amount greater than zero.');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Oops', 'Pick a category for this transaction.');
      return;
    }

    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        categoryId: selectedCategoryId,
        amount: numAmount,
        description: description.trim() || 'Untitled',
        date,
      },
    });

    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategoryId(null);
    setDate(getTodayDate());
    Alert.alert('Added!', 'Transaction logged.');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <ThemedText type="title" style={styles.title}>Add Transaction</ThemedText>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Amount</ThemedText>
              <AmountInput value={amount} onChangeText={setAmount} large />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>What was it for?</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. Coffee with friends"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Category</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chips}>
                  {month.categories.map((cat) => (
                    <Pressable
                      key={cat.id}
                      style={[
                        styles.chip,
                        selectedCategoryId === cat.id && styles.chipSelected,
                      ]}
                      onPress={() => setSelectedCategoryId(cat.id)}
                    >
                      <ThemedText style={styles.chipEmoji}>{cat.emoji}</ThemedText>
                      <ThemedText
                        style={[
                          styles.chipText,
                          selectedCategoryId === cat.id && styles.chipTextSelected,
                        ]}
                      >
                        {cat.name}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.field}>
              <ThemedText style={styles.label}>Date</ThemedText>
              <TextInput
                style={[styles.input, { color: textColor }]}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>

          <Pressable style={styles.button} onPress={handleAdd}>
            <ThemedText style={styles.buttonText}>Add Transaction</ThemedText>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },
  flex: { flex: 1 },
  scroll: { paddingTop: 16, paddingBottom: 24, gap: 20 },
  title: { fontSize: 26 },
  field: { gap: 8 },
  label: { fontSize: 15, fontWeight: '600' },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    borderColor: GroveColors.green,
    backgroundColor: GroveColors.cream,
  },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 14, fontWeight: '500' },
  chipTextSelected: { color: GroveColors.green },
  button: {
    backgroundColor: GroveColors.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
