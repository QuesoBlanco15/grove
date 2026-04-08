import { View, TextInput, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { GroveColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  large?: boolean;
}

export function AmountInput({ value, onChangeText, placeholder = '0', large = false }: AmountInputProps) {
  const textColor = useThemeColor({}, 'text');

  const handleChange = (text: string) => {
    // Allow only numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    onChangeText(cleaned);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.prefix, large && styles.prefixLarge]}>$</ThemedText>
      <TextInput
        style={[styles.input, large && styles.inputLarge, { color: textColor }]}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GroveColors.greenLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  prefix: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 4,
  },
  prefixLarge: {
    fontSize: 32,
  },
  input: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  inputLarge: {
    fontSize: 32,
  },
});
