import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: Todo["_id"]) => Promise<void>;
  onDelete: (id: Todo["_id"]) => Promise<void>;
  onEdit: (id: Todo["_id"], text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }
    if (trimmed === todo.text) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onEdit(todo._id, trimmed);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Помилка", "Не вдалося оновити текст завдання.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggle(todo._id);
    } catch (error) {
      console.error(error);
      Alert.alert("Помилка", "Не вдалося оновити статус завдання.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      await onDelete(todo._id);
    } catch (error) {
      console.error(error);
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View
      style={[styles.container, todo.isCompleted && styles.completedContainer]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => void handleToggle()}
        disabled={isUpdating || isEditing}
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: todo.isCompleted,
          disabled: isUpdating,
        }}
        accessibilityLabel={`Позначити завдання «${todo.text}» як ${
          todo.isCompleted ? "невиконане" : "виконане"
        }`}
      >
        <Ionicons
          name={todo.isCompleted ? "checkmark-circle" : "ellipse-outline"}
          size={25}
          color={todo.isCompleted ? colors.success : colors.textMuted}
        />
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={editText}
          onChangeText={setEditText}
          onSubmitEditing={() => void handleSave()}
          returnKeyType="done"
          autoFocus
          maxLength={120}
          editable={!isUpdating}
          selectionColor={colors.primary}
          accessibilityLabel="Редагувати завдання"
        />
      ) : (
        <Text
          style={[
            styles.todoText,
            todo.isCompleted && styles.todoTextCompleted,
          ]}
          numberOfLines={3}
        >
          {todo.text}
        </Text>
      )}

      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => void handleSave()}
              disabled={isUpdating}
              accessibilityRole="button"
              accessibilityLabel="Зберегти зміни"
            >
              <Ionicons
                name="checkmark-outline"
                size={21}
                color={colors.success}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
              disabled={isUpdating}
              accessibilityRole="button"
              accessibilityLabel="Скасувати редагування"
            >
              <Ionicons name="close-outline" size={21} color={colors.textMuted} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setEditText(todo.text);
                setIsEditing(true);
              }}
              disabled={isUpdating}
              accessibilityRole="button"
              accessibilityLabel={`Редагувати: ${todo.text}`}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => void handleDelete()}
              disabled={isUpdating}
              accessibilityRole="button"
              accessibilityLabel={`Видалити: ${todo.text}`}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.danger}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      minHeight: 66,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.surface,
    },
    completedContainer: {
      backgroundColor: colors.surfaceAlt,
    },
    checkbox: {
      width: 30,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    todoText: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
      lineHeight: 21,
    },
    todoTextCompleted: {
      color: colors.textMuted,
      textDecorationLine: "line-through",
    },
    editInput: {
      flex: 1,
      minWidth: 0,
      minHeight: 40,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      color: colors.text,
      fontSize: 15,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      width: 32,
      height: 38,
      alignItems: "center",
      justifyContent: "center",
    },
  });
