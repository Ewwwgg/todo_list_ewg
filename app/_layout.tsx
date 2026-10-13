import {
  ConvexProvider,
  ConvexReactClient,
} from "convex/react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const convexClient = convexUrl
  ? new ConvexReactClient(convexUrl, { unsavedChangesWarning: false })
  : null;

function RootNavigator() {
  const { colors, isDarkMode, isReady } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {isReady ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : (
        <View style={[styles.loading, { backgroundColor: colors.bg }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </>
  );
}

function ConvexSetupScreen() {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View style={[styles.setup, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.setupTitle, { color: colors.text }]}>
          Потрібно підключити Convex
        </Text>
        <Text style={[styles.setupText, { color: colors.textMuted }]}>
          Запусти npx convex dev, створи dev deployment та перевір, що
          EXPO_PUBLIC_CONVEX_URL записано у .env.local. Потім перезапусти Expo.
        </Text>
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {convexClient ? (
          <ConvexProvider client={convexClient}>
            <RootNavigator />
          </ConvexProvider>
        ) : (
          <ConvexSetupScreen />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  setup: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  setupTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  setupText: {
    maxWidth: 420,
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});
