import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useMemo, type ComponentProps } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";

type IconName = ComponentProps<typeof Ionicons>["name"];

export default function StatsScreen() {
  const { colors } = useTheme();
  const stats = useQuery(api.todos.getStats);
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (stats === undefined) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.subtitle}>Завантаження статистики...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const cards: {
    label: string;
    value: number | string;
    icon: IconName;
    tint: string;
    color: string;
  }[] = [
    {
      label: "Всього завдань",
      value: stats.total,
      icon: "list-outline",
      tint: colors.primaryLight,
      color: colors.primary,
    },
    {
      label: "Активні",
      value: stats.active,
      icon: "time-outline",
      tint: colors.surfaceAlt,
      color: colors.warning,
    },
    {
      label: "Виконані",
      value: stats.completed,
      icon: "checkmark-done-outline",
      tint: colors.surfaceAlt,
      color: colors.success,
    },
    {
      label: "Прогрес",
      value: `${stats.percentage}%`,
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
            Аналітика завдань у реальному часі
          </Text>
        </View>

        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.label} style={styles.statCard}>
              <View style={[styles.iconBadge, { backgroundColor: card.tint }]}>
                <Ionicons name={card.icon} size={21} color={card.color} />
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeading}>
            <View>
              <Text style={styles.progressTitle}>Загальний прогрес</Text>
              <Text style={styles.progressSubtitle}>
                {stats.completed} із {stats.total} завдань виконано
              </Text>
            </View>
            <Text style={styles.progressPercent}>{stats.percentage}%</Text>
          </View>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: stats.percentage }}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${stats.percentage}%` },
              ]}
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
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
  });
