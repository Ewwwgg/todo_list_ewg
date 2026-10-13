import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "convex/react";
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
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const stats = useQuery(api.todos.getStats);
  const clearCompletedMutation = useMutation(api.todos.clearCompleted);
  const clearAllMutation = useMutation(api.todos.clearAll);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completedCount = stats?.completed ?? 0;
  const totalCount = stats?.total ?? 0;

  const performAction = async (
    action: () => Promise<{ deletedCount: number }>,
    successMessage: (deletedCount: number) => string,
  ) => {
    try {
      const result = await action();
      Alert.alert("Готово", successMessage(result.deletedCount));
    } catch (error) {
      console.error("Не вдалося очистити завдання в Convex:", error);
      Alert.alert("Помилка", "Не вдалося оновити список завдань.");
    }
  };

  const confirmAction = (
    title: string,
    message: string,
    action: () => Promise<{ deletedCount: number }>,
    successMessage: (deletedCount: number) => string,
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

        <Text style={styles.sectionTitle}>Керування хмарними даними</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() =>
              confirmAction(
                "Очистити виконані завдання?",
                `Буде видалено ${completedCount} завершених завдань.`,
                () => clearCompletedMutation({}),
                (count) => `Видалено ${count} виконаних завдань.`,
              )
            }
            disabled={stats === undefined || completedCount === 0}
            accessibilityRole="button"
            accessibilityState={{
              disabled: stats === undefined || completedCount === 0,
            }}
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
                  (stats === undefined || completedCount === 0) &&
                    styles.disabledText,
                ]}
              >
                Очистити виконані
              </Text>
              <Text style={styles.settingDescription}>
                {stats === undefined
                  ? "Завантаження..."
                  : `Завершено: ${completedCount}`}
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
                `Буде видалено всі ${totalCount} завдань. Цю дію не можна скасувати.`,
                () => clearAllMutation({}),
                (count) => `Видалено ${count} завдань.`,
              )
            }
            disabled={stats === undefined || totalCount === 0}
            accessibilityRole="button"
            accessibilityState={{
              disabled: stats === undefined || totalCount === 0,
            }}
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
                  (stats === undefined || totalCount === 0) &&
                    styles.disabledText,
                ]}
              >
                Видалити всі завдання
              </Text>
              <Text style={styles.settingDescription}>
                {stats === undefined
                  ? "Завантаження..."
                  : `Буде видалено: ${totalCount}`}
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
                name="cloud-outline"
                size={22}
                color={colors.textMuted}
              />
            </View>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Todo App</Text>
              <Text style={styles.settingDescription}>
                Синхронізація завдань у реальному часі
              </Text>
            </View>
            <Text style={styles.version}>v4.0.0</Text>
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
