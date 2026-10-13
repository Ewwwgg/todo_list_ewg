import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  getTodos,
  toggleTodo as toggleTodoRequest,
  updateTodoText as updateTodoTextRequest,
} from "@/services/api";
import type { Todo } from "@/types";

const SERVER_ERROR_MESSAGE =
  "Не вдалося з'єднатися із сервером. Переконайтеся, що json-server запущено на порту 3000.";

interface TodoContextValue {
  todos: Todo[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refreshTodos: (isRefresh?: boolean) => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  updateTodoText: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  clearAll: () => Promise<void>;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTodos = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      setTodos(await getTodos());
    } catch (requestError) {
      setError(SERVER_ERROR_MESSAGE);
      console.error("Не вдалося завантажити завдання:", requestError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    getTodos()
      .then((data) => {
        if (isActive) {
          setTodos(data);
        }
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setError(SERVER_ERROR_MESSAGE);
        }
        console.error("Не вдалося завантажити завдання:", requestError);
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

  const addTodo = useCallback(async (text: string) => {
    const newTodo = await createTodoRequest(text);
    setTodos((current) => [...current, newTodo]);
  }, []);

  const toggleTodo = useCallback(
    async (id: string, completed: boolean) => {
      const updatedTodo = await toggleTodoRequest(id, completed);
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? updatedTodo : todo)),
      );
    },
    [],
  );

  const updateTodoText = useCallback(async (id: string, text: string) => {
    const updatedTodo = await updateTodoTextRequest(id, text);
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? updatedTodo : todo)),
    );
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    await deleteTodoRequest(id);
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }, []);

  const removeTodos = useCallback(
    async (items: Todo[]) => {
      if (items.length === 0) {
        return;
      }

      try {
        await Promise.all(items.map((todo) => deleteTodoRequest(todo.id)));
      } catch (requestError) {
        await refreshTodos();
        throw requestError;
      }

      const removedIds = new Set(items.map((todo) => todo.id));
      setTodos((current) =>
        current.filter((todo) => !removedIds.has(todo.id)),
      );
    },
    [refreshTodos],
  );

  const clearCompleted = useCallback(async () => {
    await removeTodos(todos.filter((todo) => todo.completed));
  }, [removeTodos, todos]);

  const clearAll = useCallback(async () => {
    await removeTodos(todos);
  }, [removeTodos, todos]);

  const value = useMemo(
    () => ({
      todos,
      loading,
      refreshing,
      error,
      refreshTodos,
      addTodo,
      toggleTodo,
      updateTodoText,
      deleteTodo,
      clearCompleted,
      clearAll,
    }),
    [
      todos,
      loading,
      refreshing,
      error,
      refreshTodos,
      addTodo,
      toggleTodo,
      updateTodoText,
      deleteTodo,
      clearCompleted,
      clearAll,
    ],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos(): TodoContextValue {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos має використовуватися всередині TodoProvider");
  }
  return context;
}
