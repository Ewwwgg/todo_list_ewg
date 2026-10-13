import Constants from "expo-constants";
import { Platform } from "react-native";
import type { Todo } from "@/types";

const getBaseUrl = (): string => {
  if (Platform.OS === "web") {
    return "http://localhost:3000";
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host) {
      return `http://${host}:3000`;
    }
  }

  return Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000";
};

const API_URL = `${getBaseUrl()}/todos`;

const getErrorDescription = (response: Response): string =>
  response.statusText || String(response.status);

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Помилка завантаження: ${getErrorDescription(response)}`);
  }
  return response.json();
};

export const addTodo = async (text: string): Promise<Todo> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      completed: false,
      createdAt: Date.now(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Помилка додавання: ${getErrorDescription(response)}`);
  }
  return response.json();
};

export const toggleTodo = async (
  id: string,
  completed: boolean,
): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error(
      `Помилка оновлення статусу: ${getErrorDescription(response)}`,
    );
  }
  return response.json();
};

export const updateTodoText = async (
  id: string,
  text: string,
): Promise<Todo> => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(
      `Помилка оновлення тексту: ${getErrorDescription(response)}`,
    );
  }
  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Помилка видалення: ${getErrorDescription(response)}`);
  }
};
