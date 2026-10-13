import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeColors } from "@/types";

const THEME_STORAGE_KEY = "@todo_theme_mode";

export const lightColors: ThemeColors = {
  bg: "#F4EBDD",
  surface: "#FFFCF7",
  surfaceAlt: "#FFF9F2",
  text: "#382E2A",
  textMuted: "#8A7770",
  border: "#EAD8C9",
  primary: "#D96F57",
  primaryLight: "#F9E5DA",
  success: "#568266",
  warning: "#BB874B",
  danger: "#C36D5C",
  statusBarStyle: "dark",
};

export const darkColors: ThemeColors = {
  bg: "#211C1B",
  surface: "#2D2523",
  surfaceAlt: "#382C29",
  text: "#FBF1E8",
  textMuted: "#C5AFA2",
  border: "#4B3934",
  primary: "#F19479",
  primaryLight: "#4B302A",
  success: "#8DC39B",
  warning: "#E9B66F",
  danger: "#FF927B",
  statusBarStyle: "light",
};

interface ThemeContextValue {
  colors: ThemeColors;
  isDarkMode: boolean;
  isReady: boolean;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedMode) => {
        if (isActive && savedMode !== null) {
          setIsDarkMode(savedMode === "true");
        }
      })
      .catch((error: unknown) => {
        console.error("Не вдалося завантажити тему:", error);
      })
      .finally(() => {
        if (isActive) {
          setIsReady(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const toggleTheme = useCallback(async () => {
    const nextMode = !isDarkMode;

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, String(nextMode));
      setIsDarkMode(nextMode);
    } catch (error) {
      console.error("Не вдалося зберегти тему:", error);
      throw error;
    }
  }, [isDarkMode]);

  const value = useMemo(
    () => ({
      colors: isDarkMode ? darkColors : lightColors,
      isDarkMode,
      isReady,
      toggleTheme,
    }),
    [isDarkMode, isReady, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme має використовуватися всередині ThemeProvider");
  }
  return context;
}
