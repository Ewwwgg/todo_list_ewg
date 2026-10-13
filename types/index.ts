import type { Doc } from "@/convex/_generated/dataModel";

export type Todo = Doc<"todos">;

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
