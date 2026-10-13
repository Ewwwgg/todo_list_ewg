import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
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
      await onEdit(todo.id, trimmed);
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
      await onToggle(todo.id, !todo.completed);
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
      await onDelete(todo.id);
    } catch (error) {
      console.error(error);
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={[styles.container, todo.completed && styles.completedContainer]}>
      <TouchableOpacity
        style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
        onPress={() => void handleToggle()}
        disabled={isUpdating || isEditing}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed, disabled: isUpdating }}
        accessibilityLabel={`Позначити завдання «${todo.text}» як ${
          todo.completed ? "невиконане" : "виконане"
        }`}
      >
        {todo.completed && <Text style={styles.checkmark}>✓</Text>}
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
          accessibilityLabel="Редагувати завдання"
        />
      ) : (
        <Text
          style={[styles.todoText, todo.completed && styles.todoTextCompleted]}
          numberOfLines={3}
        >
          {todo.text}
        </Text>
      )}

      <View style={styles.actions}>
        {isEditing ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => void handleSave()}
            disabled={isUpdating}
            accessibilityRole="button"
            accessibilityLabel="Зберегти зміни"
          >
            <Text style={styles.saveAction}>✓</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setEditText(todo.text);
              setIsEditing(true);
            }}
            disabled={isUpdating}
            accessibilityRole="button"
            accessibilityLabel="Редагувати завдання"
          >
            <Text style={styles.editAction}>✎</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => void handleDelete()}
          disabled={isUpdating}
          accessibilityRole="button"
          accessibilityLabel="Видалити завдання"
        >
          <Text style={styles.deleteAction}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EADBD0",
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: "#FFFEFA",
  },
  completedContainer: {
    backgroundColor: "#F8EEE4",
  },
  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 2,
    borderColor: "#CDAE9B",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: "#D96F57",
    backgroundColor: "#D96F57",
  },
  checkmark: {
    color: "#FFFCF7",
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
  },
  todoText: {
    flex: 1,
    color: "#43352E",
    fontSize: 15,
    lineHeight: 21,
  },
  todoTextCompleted: {
    color: "#A89182",
    textDecorationLine: "line-through",
  },
  editInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#D96F57",
    color: "#43352E",
    fontSize: 15,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 34,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  editAction: {
    color: "#8C6B5B",
    fontSize: 23,
  },
  saveAction: {
    color: "#D96F57",
    fontSize: 21,
    fontWeight: "700",
  },
  deleteAction: {
    color: "#C36D5C",
    fontSize: 27,
    lineHeight: 30,
  },
});
