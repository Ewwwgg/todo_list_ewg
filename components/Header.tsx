import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={styles.iconBadge}>
          <Text style={styles.icon}>📝</Text>
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

const styles = StyleSheet.create({
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
    backgroundColor: "#F9E5DA",
  },
  icon: {
    fontSize: 23,
  },
  title: {
    color: "#382E2A",
    fontSize: 23,
    fontWeight: "700",
    flexShrink: 1,
  },
  subtitle: {
    color: "#8A7770",
    fontSize: 14,
    marginTop: 9,
  },
});
