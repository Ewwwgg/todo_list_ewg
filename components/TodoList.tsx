import Ionicons from "@expo/vector-icons/Ionicons";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { Todo } from "@/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoList({
  todos,
  refreshing,
  onRefresh,
  onToggle,
  onDelete,
  onEdit,
}: TodoListProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <FlatList
      style={styles.list}
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoItem
          todo={item}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyBadge}>
            <Ionicons name="list-outline" size={27} color={colors.primary} />
          </View>
          <Text style={styles.emptyText}>
            Список завдань порожній. Додайте нове завдання!
          </Text>
        </View>
      }
      contentContainerStyle={[
        styles.listContent,
        todos.length === 0 && styles.emptyListContent,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void onRefresh()}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      }
    />
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 22,
      paddingBottom: 24,
    },
    emptyListContent: {
      flexGrow: 1,
    },
    separator: {
      height: 10,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 32,
    },
    emptyBadge: {
      width: 58,
      height: 58,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      marginBottom: 14,
    },
    emptyText: {
      maxWidth: 270,
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
    },
  });
