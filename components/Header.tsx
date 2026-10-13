import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="clipboard-outline" size={22} color={colors.primary} />
        </View>
        <Text style={styles.title}>Мій список завдань</Text>
      </View>
      <Text style={styles.subtitle}>
        {totalCount > 0
          ? `Виконано ${completedCount} з ${totalCount} завдань`
          : "Додайте своє перше завдання"}
      </Text>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 22,
      paddingTop: 24,
      paddingBottom: 18,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconBadge: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 15,
      backgroundColor: colors.primaryLight,
    },
    title: {
      color: colors.text,
      fontSize: 23,
      fontWeight: "700",
      flexShrink: 1,
    },
    subtitle: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 9,
    },
  });
