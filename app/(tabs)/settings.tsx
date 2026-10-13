import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { todos, clearCompleted, clearAll } = useTodos();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completedCount = todos.filter((todo) => todo.completed).length;

  const performAction = async (
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    try {
      await action();
      Alert.alert("Готово", successMessage);
    } catch (error) {
      console.error("Не вдалося виконати дію зі списком:", error);
      Alert.alert("Помилка", "Не вдалося оновити список завдань.");
    }
  };

  const confirmAction = (
    title: string,
    message: string,
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    const onConfirm = () => {
      void performAction(action, successMessage);
    };

    if (Platform.OS === "web") {
      if (globalThis.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: "Скасувати", style: "cancel" },
      { text: "Видалити", style: "destructive", onPress: onConfirm },
    ]);
  };

  const handleThemeToggle = () => {
    void toggleTheme().catch(() => {
      Alert.alert("Помилка", "Не вдалося зберегти вибір теми.");
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>Налаштування</Text>
          <Text style={styles.subtitle}>Персоналізуй свій простір</Text>
        </View>

        <Text style={styles.sectionTitle}>Зовнішній вигляд</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons
                name={isDarkMode ? "moon-outline" : "sunny-outline"}
                size={21}
                color={colors.primary}
              />
            </View>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>
                {isDarkMode ? "Темна тема" : "Світла тема"}
              </Text>
              <Text style={styles.settingDescription}>
                {isDarkMode
                  ? "Комфортний вигляд у темряві"
                  : "Світле та затишне оформлення"}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
              ios_backgroundColor={colors.border}
              accessibilityLabel="Перемкнути світлу або темну тему"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Керування завданнями</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() =>
              confirmAction(
                "Очистити виконані завдання?",
                `Буде видалено ${completedCount} завершених завдань.`,
                clearCompleted,
                "Виконані завдання видалено.",
              )
            }
            disabled={completedCount === 0}
            accessibilityRole="button"
            accessibilityState={{ disabled: completedCount === 0 }}
          >
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={21}
                color={colors.primary}
              />
            </View>
            <View style={styles.settingCopy}>
              <Text
                style={[
                  styles.settingTitle,
                  completedCount === 0 && styles.disabledText,
                ]}
              >
                Очистити виконані
              </Text>
              <Text style={styles.settingDescription}>
                Завершено: {completedCount}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() =>
              confirmAction(
                "Видалити всі завдання?",
                `Буде видалено всі ${todos.length} завдань. Цю дію не можна скасувати.`,
                clearAll,
                "Усі завдання видалено.",
              )
            }
            disabled={todos.length === 0}
            accessibilityRole="button"
            accessibilityState={{ disabled: todos.length === 0 }}
          >
            <View style={[styles.iconBadge, styles.dangerBadge]}>
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.danger}
              />
            </View>
            <View style={styles.settingCopy}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: colors.danger },
                  todos.length === 0 && styles.disabledText,
                ]}
              >
                Видалити всі завдання
              </Text>
              <Text style={styles.settingDescription}>
                Буде видалено: {todos.length}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Про додаток</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.surfaceAlt },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.textMuted}
              />
            </View>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Todo App</Text>
              <Text style={styles.settingDescription}>
                Список справ із турботою про деталі
              </Text>
            </View>
            <Text style={styles.version}>v2.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      width: "100%",
      maxWidth: 680,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingTop: 26,
      paddingBottom: 28,
    },
    heading: {
      marginBottom: 24,
    },
    title: {
      color: colors.text,
      fontSize: 27,
      fontWeight: "800",
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 6,
    },
    sectionTitle: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 10,
      marginTop: 18,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    card: {
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      backgroundColor: colors.surface,
    },
    settingRow: {
      minHeight: 76,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    actionRow: {
      minHeight: 76,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    iconBadge: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
    },
    dangerBadge: {
      backgroundColor: colors.surfaceAlt,
    },
    settingCopy: {
      flex: 1,
    },
    settingTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
    },
    settingDescription: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 4,
    },
    disabledText: {
      opacity: 0.5,
    },
    divider: {
      height: 1,
      marginLeft: 69,
      backgroundColor: colors.border,
    },
    version: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "600",
    },
  });
