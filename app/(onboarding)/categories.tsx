import { useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GroveColors } from '@/constants/theme';
import { useAppState } from '@/contexts/AppContext';
import { generateId } from '@/utils/budget';
import { DEFAULT_CATEGORIES, type Category, type BudgetMode } from '@/types/budget';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CategoriesSetup() {
  const { income: incomeStr, budgetMode } = useLocalSearchParams<{ income: string; budgetMode: BudgetMode }>();
  const income = parseFloat(incomeStr) || 0;
  const router = useRouter();
  const { dispatch } = useAppState();
  const textColor = useThemeColor({}, 'text');

  const [categories, setCategories] = useState<Category[]>(
    DEFAULT_CATEGORIES.map((c) => ({ ...c, id: generateId() }))
  );

  const totalAllocated = categories.reduce((sum, c) => sum + c.budgeted, 0);
  const remaining = income - totalAllocated;

  const updateBudget = (id: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, budgeted: amount } : c)));
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const addCategory = () => {
    Alert.prompt('New Category', 'Enter category name:', (name) => {
      if (!name?.trim()) return;
      setCategories((prev) => [
        ...prev,
        { id: generateId(), name: name.trim(), emoji: '📌', budgeted: 0 },
      ]);
    });
  };

  const handleFinish = () => {
    if (remaining < 0) {
      Alert.alert('Over budget', "You've allocated more than your income. Adjust your categories.");
      return;
    }
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: {
        income,
        categories,
        budgetMode: budgetMode ?? 'buildup',
      },
    });
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Set your budget
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Split ${income.toFixed(2)} across your categories
            </ThemedText>
            <View style={[styles.remainingBadge, remaining < 0 && styles.remainingOver]}>
              <ThemedText style={[styles.remainingText, remaining < 0 && { color: GroveColors.red }]}>
                ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'left to assign' : 'over budget'}
              </ThemedText>
            </View>
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
                <ThemedText style={styles.catName}>{item.name}</ThemedText>
                <View style={styles.inputWrap}>
                  <ThemedText style={styles.dollar}>$</ThemedText>
                  <TextInput
                    style={[styles.catInput, { color: textColor }]}
                    value={item.budgeted > 0 ? String(item.budgeted) : ''}
                    onChangeText={(v) => updateBudget(item.id, v)}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                </View>
                <Pressable onPress={() => removeCategory(item.id)} style={styles.removeBtn}>
                  <ThemedText style={styles.removeText}>✕</ThemedText>
                </Pressable>
              </View>
            )}
            ListFooterComponent={
              <Pressable style={styles.addBtn} onPress={addCategory}>
                <ThemedText style={styles.addText}>+ Add category</ThemedText>
              </Pressable>
            }
          />

          <Pressable
            style={[styles.button, remaining < 0 && styles.buttonDisabled]}
            onPress={handleFinish}
          >
            <ThemedText style={styles.buttonText}>Start budgeting</ThemedText>
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
  header: { paddingTop: 40, gap: 8, marginBottom: 16 },
  title: { fontSize: 26 },
  subtitle: { fontSize: 16, opacity: 0.7 },
  remainingBadge: {
    backgroundColor: GroveColors.cream,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  remainingOver: { backgroundColor: '#FEE2E2' },
  remainingText: { fontSize: 15, fontWeight: '600', color: GroveColors.green },
  list: { paddingBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  emoji: { fontSize: 20 },
  catName: { fontSize: 15, fontWeight: '500', flex: 1 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 100,
  },
  dollar: { fontSize: 15, marginRight: 2 },
  catInput: { fontSize: 15, flex: 1 },
  removeBtn: { padding: 6 },
  removeText: { fontSize: 16, opacity: 0.4 },
  addBtn: { paddingVertical: 12 },
  addText: { fontSize: 15, color: GroveColors.green, fontWeight: '600' },
  button: {
    backgroundColor: GroveColors.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
