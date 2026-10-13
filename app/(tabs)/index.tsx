import { useMemo } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

export default function TasksScreen() {
  const { colors } = useTheme();
  const {
    todos,
    loading,
    refreshing,
    error,
    refreshTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
  } = useTodos();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Header totalCount={todos.length} completedCount={completedCount} />

          {error && (
            <View style={styles.errorBanner}>
              <View style={styles.errorCopy}>
                <Text style={styles.errorTitle}>Помилка з’єднання</Text>
                <Text style={styles.errorDescription}>{error}</Text>
              </View>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => void refreshTodos()}
                accessibilityRole="button"
                accessibilityLabel="Повторити завантаження"
              >
                <Text style={styles.retryText}>Повторити</Text>
              </TouchableOpacity>
            </View>
          )}

          <TodoForm onAdd={addTodo} loading={loading} />

          {loading && todos.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Завантаження завдань...</Text>
            </View>
          ) : (
            <TodoList
              todos={todos}
              refreshing={refreshing}
              onRefresh={() => refreshTodos(true)}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={updateTodoText}
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
    errorBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginHorizontal: 22,
      marginBottom: 16,
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.danger,
      backgroundColor: colors.surfaceAlt,
    },
    errorCopy: {
      flex: 1,
    },
    errorTitle: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: "700",
    },
    errorDescription: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 4,
    },
    retryButton: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.primaryLight,
    },
    retryText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
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
