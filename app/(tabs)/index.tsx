import { useMutation, useQuery } from "convex/react";
import { useMemo } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";
import type { Todo } from "@/types";

export default function TasksScreen() {
  const { colors } = useTheme();
  const todos = useQuery(api.todos.getTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completedCount =
    todos?.filter((todo) => todo.isCompleted).length ?? 0;

  const handleAdd = async (text: string) => {
    await createTodo({ text });
  };

  const handleToggle = async (id: Todo["_id"]) => {
    await toggleTodo({ id });
  };

  const handleEdit = async (id: Todo["_id"], text: string) => {
    await updateTodo({ id, text });
  };

  const handleDelete = async (id: Todo["_id"]) => {
    await deleteTodo({ id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Header
            totalCount={todos?.length ?? 0}
            completedCount={completedCount}
          />

          <TodoForm onAdd={handleAdd} loading={todos === undefined} />

          {todos === undefined ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Синхронізація з Convex...</Text>
            </View>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    keyboardView: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingTop: 12,
    },
    card: {
      flex: 1,
      width: "100%",
      maxWidth: 640,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      backgroundColor: colors.surface,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 2,
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    loadingText: {
      color: colors.textMuted,
      fontSize: 14,
    },
  });
