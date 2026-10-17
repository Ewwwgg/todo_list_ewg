import { ConvexAuthProvider } from "@convex-dev/auth/react";
import {
  ConvexReactClient,
  useConvexAuth,
} from "convex/react";
import * as SecureStore from "expo-secure-store";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Platform,
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

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function Splash() {
  const { colors } = useTheme();

  return (
    <View style={[styles.loading, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function RootNavigator() {
  const { colors, isDarkMode, isReady } = useTheme();
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (!isReady || isLoading) {
    return <Splash />;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
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
          Запусти npx convex login, а потім npx convex dev
          --configure=new --dev-deployment=cloud. CLI створить deployment і
          запише EXPO_PUBLIC_CONVEX_URL у .env.local.
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
          <ConvexAuthProvider
            client={convexClient}
            storage={Platform.OS === "web" ? undefined : secureStorage}
          >
            <RootNavigator />
          </ConvexAuthProvider>
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
