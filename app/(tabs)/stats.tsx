import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, type ComponentProps } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

type IconName = ComponentProps<typeof Ionicons>["name"];

export default function StatsScreen() {
  const { colors } = useTheme();
  const { todos } = useTodos();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const progress =
    todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  const stats: {
    label: string;
    value: number | string;
    icon: IconName;
    tint: string;
    color: string;
  }[] = [
    {
      label: "Всього завдань",
      value: todos.length,
      icon: "list-outline",
      tint: colors.primaryLight,
      color: colors.primary,
    },
    {
      label: "Активні",
      value: activeCount,
      icon: "time-outline",
      tint: colors.surfaceAlt,
      color: colors.warning,
    },
    {
      label: "Виконані",
      value: completedCount,
      icon: "checkmark-done-outline",
      tint: colors.surfaceAlt,
      color: colors.success,
    },
    {
      label: "Прогрес",
      value: `${progress}%`,
      icon: "trending-up-outline",
      tint: colors.primaryLight,
      color: colors.primary,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>Статистика</Text>
          <Text style={styles.subtitle}>
            Твій прогрес у виконанні завдань
          </Text>
        </View>

        <View style={styles.grid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.iconBadge, { backgroundColor: stat.tint }]}>
                <Ionicons name={stat.icon} size={21} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeading}>
            <View>
              <Text style={styles.progressTitle}>Загальний прогрес</Text>
              <Text style={styles.progressSubtitle}>
                {completedCount} із {todos.length} завдань виконано
              </Text>
            </View>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: progress }}
          >
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
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
      marginBottom: 22,
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
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: 12,
    },
    statCard: {
      width: "48%",
      minHeight: 145,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      backgroundColor: colors.surface,
    },
    iconBadge: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      marginBottom: 13,
    },
    statValue: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "800",
    },
    statLabel: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
    },
    progressCard: {
      marginTop: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      backgroundColor: colors.surface,
    },
    progressHeading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    progressTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
    },
    progressSubtitle: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
    },
    progressPercent: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: "800",
    },
    progressTrack: {
      height: 10,
      overflow: "hidden",
      borderRadius: 5,
      backgroundColor: colors.surfaceAlt,
    },
    progressFill: {
      height: "100%",
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
  });
