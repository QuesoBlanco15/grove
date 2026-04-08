import { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AmountInput } from '@/components/AmountInput';
import { useAppState, useCurrentMonth } from '@/contexts/AppContext';
import { GroveColors } from '@/constants/theme';

export default function SettingsScreen() {
  const { state, dispatch } = useAppState();
  const month = useCurrentMonth();
  const router = useRouter();

  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeValue, setIncomeValue] = useState('');

  if (!state || !month) return null;

  const handleUpdateIncome = () => {
    const val = parseFloat(incomeValue);
    if (val > 0) {
      dispatch({ type: 'UPDATE_INCOME', payload: val });
    }
    setEditingIncome(false);
  };

  const handleAddCategory = () => {
    Alert.prompt('New Category', 'Enter category name:', (name) => {
      if (!name?.trim()) return;
      dispatch({
        type: 'ADD_CATEGORY',
        payload: { name: name.trim(), emoji: '📌', budgeted: 0 },
      });
    });
  };

  const handleRemoveCategory = (id: string, name: string) => {
    Alert.alert('Remove category', `Remove "${name}"? Transactions in this category will remain.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => dispatch({ type: 'REMOVE_CATEGORY', payload: id }) },
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset everything?',
      'This will delete all your data and return to onboarding. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESET_DATA' });
            router.replace('/(onboarding)');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.title}>Settings</ThemedText>

          {/* Income Section */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Monthly Income</ThemedText>
            {editingIncome ? (
              <View style={styles.editRow}>
                <View style={styles.editInput}>
                  <AmountInput value={incomeValue} onChangeText={setIncomeValue} />
                </View>
                <Pressable style={styles.saveBtn} onPress={handleUpdateIncome}>
                  <ThemedText style={styles.saveBtnText}>Save</ThemedText>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.inlineRow}
                onPress={() => {
                  setIncomeValue(String(month.income));
                  setEditingIncome(true);
                }}
              >
                <ThemedText style={styles.incomeDisplay}>${month.income.toFixed(2)}</ThemedText>
                <ThemedText style={styles.editLabel}>Tap to edit</ThemedText>
              </Pressable>
            )}
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Categories</ThemedText>
            {month.categories.map((cat) => (
              <View key={cat.id} style={styles.catRow}>
                <ThemedText style={styles.catEmoji}>{cat.emoji}</ThemedText>
                <ThemedText style={styles.catName}>{cat.name}</ThemedText>
                <ThemedText style={styles.catBudget}>${cat.budgeted.toFixed(2)}</ThemedText>
                <Pressable onPress={() => handleRemoveCategory(cat.id, cat.name)}>
                  <ThemedText style={styles.removeText}>✕</ThemedText>
                </Pressable>
              </View>
            ))}
            <Pressable style={styles.addBtn} onPress={handleAddCategory}>
              <ThemedText style={styles.addText}>+ Add category</ThemedText>
            </Pressable>
          </View>

          {/* Build-up Mode Switch */}
          {state.budgetMode === 'buildup' && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Budget Mode</ThemedText>
              <ThemedText style={styles.modeBody}>
                {"You're in build-up mode. Once you have a full month of income saved, switch to"}
                real last-month budgeting.
              </ThemedText>
              <Pressable
                style={styles.switchBtn}
                onPress={() => {
                  Alert.alert(
                    'Switch to full mode?',
                    "This means you'll budget this month using only what you earned last month.",
                    [
                      { text: 'Not yet', style: 'cancel' },
                      { text: 'Switch', onPress: () => dispatch({ type: 'SWITCH_TO_FULL_MODE' }) },
                    ]
                  );
                }}
              >
                <ThemedText style={styles.switchBtnText}>Switch to last-month budgeting</ThemedText>
              </Pressable>
            </View>
          )}

          {/* Reset */}
          <View style={styles.section}>
            <Pressable style={styles.resetBtn} onPress={handleReset}>
              <ThemedText style={styles.resetText}>Reset all data</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },
  title: { fontSize: 26, marginBottom: 24 },
  section: { marginBottom: 32, gap: 12 },
  sectionTitle: { fontSize: 18 },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
  },
  incomeDisplay: { fontSize: 22, fontWeight: '700' },
  editLabel: { fontSize: 13, opacity: 0.5 },
  editRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  editInput: { flex: 1 },
  saveBtn: {
    backgroundColor: GroveColors.green,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  catEmoji: { fontSize: 20 },
  catName: { fontSize: 15, fontWeight: '500', flex: 1 },
  catBudget: { fontSize: 14, opacity: 0.6 },
  removeText: { fontSize: 16, opacity: 0.4, paddingHorizontal: 8 },
  addBtn: { paddingVertical: 4 },
  addText: { color: GroveColors.green, fontWeight: '600', fontSize: 15 },
  modeBody: { fontSize: 14, lineHeight: 20, opacity: 0.7 },
  switchBtn: {
    borderWidth: 2,
    borderColor: GroveColors.green,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchBtnText: { color: GroveColors.green, fontWeight: '600', fontSize: 15 },
  resetBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetText: { color: GroveColors.red, fontWeight: '600', fontSize: 16 },
});
