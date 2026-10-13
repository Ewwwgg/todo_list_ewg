export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: number;
}

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryLight: string;
  success: string;
  warning: string;
  danger: string;
  statusBarStyle: "light" | "dark";
}
