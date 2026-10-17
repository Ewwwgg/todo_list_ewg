import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

type IconName = ComponentProps<typeof Ionicons>["name"];

export function AuthLayout({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
              <Ionicons name={icon} size={42} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthField({
  icon,
  ...inputProps
}: { icon: IconName } & TextInputProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.field,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Ionicons
        name={icon}
        size={21}
        color={colors.textMuted}
        style={styles.fieldIcon}
      />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
    </View>
  );
}

export function AuthButton({
  label,
  icon,
  loading,
  onPress,
}: {
  label: string;
  icon: IconName;
  loading: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.primary },
        loading && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Ionicons name={icon} size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export function AuthFooter({
  text,
  linkLabel,
  onPress,
}: {
  text: string;
  linkLabel: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.footer}>
      <Text style={[styles.footerText, { color: colors.textMuted }]}>
        {text}{" "}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.footerLink, { color: colors.primary }]}>
          {linkLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const authFormStyle = { gap: 14 } as const;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: { alignItems: "center", marginBottom: 32 },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 4,
  },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center" },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  fieldIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16 },
  button: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  footerText: { fontSize: 15 },
  footerLink: { fontSize: 15, fontWeight: "700" },
});
