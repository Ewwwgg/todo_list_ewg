import { useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(trimmed);
      setText("");
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
      Alert.alert("Помилка", "Не вдалося створити завдання.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !text.trim() || loading || isSubmitting;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Що потрібно зробити?"
        placeholderTextColor="#9698a8"
        value={text}
        onChangeText={setText}
        onSubmitEditing={() => void handleSubmit()}
        returnKeyType="done"
        editable={!loading && !isSubmitting}
        maxLength={120}
        accessibilityLabel="Нове завдання"
      />
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={() => void handleSubmit()}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel="Додати завдання"
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "…" : "Додати"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    borderWidth: 1,
    borderColor: "#e7e8ef",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#25263a",
    fontSize: 15,
    backgroundColor: "#fff",
  },
  button: {
    minWidth: 82,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#6366f1",
  },
  buttonDisabled: {
    backgroundColor: "#a5a6ed",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
