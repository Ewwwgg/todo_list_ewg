import { useEffect, useMemo, useState } from "react";
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
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodoText,
} from "@/services/api";
import type { Todo } from "@/types";

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      setTodos(await getTodos());
    } catch (err) {
      setError(
        "Не вдалося з'єднатися з сервером. Переконайтеся, що json-server запущено (порт 3000).",
      );
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    getTodos()
      .then((data) => {
        if (isActive) {
          setTodos(data);
        }
      })
      .catch((err: unknown) => {
        if (isActive) {
          setError(
            "Не вдалося з'єднатися з сервером. Переконайтеся, що json-server запущено (порт 3000).",
          );
        }
        console.error(err);
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleAdd = async (text: string) => {
    const newTodo = await addTodo(text);
    setTodos((previous) => [...previous, newTodo]);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const updatedTodo = await toggleTodo(id, completed);
    setTodos((previous) =>
      previous.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );
  };

  const handleEdit = async (id: string, text: string) => {
    const updatedTodo = await updateTodoText(id, text);
    setTodos((previous) =>
      previous.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
  };

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Header totalCount={todos.length} completedCount={completedCount} />

          {error && (
            <View style={styles.errorBanner}>
              <View style={styles.errorCopy}>
                <Text style={styles.errorTitle}>⚠️ Помилка з’єднання</Text>
                <Text style={styles.errorDescription}>{error}</Text>
              </View>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => void fetchTodos()}
                accessibilityRole="button"
              >
                <Text style={styles.retryText}>Повторити</Text>
              </TouchableOpacity>
            </View>
          )}

          <TodoForm onAdd={handleAdd} loading={loading} />

          {loading && todos.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D96F57" />
              <Text style={styles.loadingText}>Завантаження завдань...</Text>
            </View>
          ) : (
            <TodoList
              todos={todos}
              refreshing={refreshing}
              onRefresh={() => fetchTodos(true)}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4EBDD",
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  card: {
    flex: 1,
    width: "100%",
    maxWidth: 640,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EAD8C9",
    borderRadius: 24,
    backgroundColor: "#FFFCF7",
    shadowColor: "#6B4B3E",
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
    borderColor: "#F2C6B9",
    backgroundColor: "#FFF2EC",
  },
  errorCopy: {
    flex: 1,
  },
  errorTitle: {
    color: "#A5493A",
    fontSize: 14,
    fontWeight: "700",
  },
  errorDescription: {
    color: "#815A4D",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F8E0D6",
  },
  retryText: {
    color: "#A5493A",
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
    color: "#8A7770",
    fontSize: 14,
  },
});
