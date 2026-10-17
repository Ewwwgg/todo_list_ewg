import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import {
  AuthButton,
  AuthField,
  AuthFooter,
  AuthLayout,
  authFormStyle,
} from "@/components/AuthForm";

export default function SignInScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі поля!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("flow", "signIn");
      await signIn("password", formData);
    } catch {
      Alert.alert("Помилка входу", "Невірний email або пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      icon="checkmark-circle"
      title="Todo App"
      subtitle="Увійдіть у свій персональний простір завдань"
    >
      <View style={authFormStyle}>
        <AuthField
          icon="mail-outline"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <AuthField
          icon="lock-closed-outline"
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AuthButton
          label="Увійти"
          icon="log-in-outline"
          loading={isLoading}
          onPress={() => void handleSignIn()}
        />
      </View>
      <AuthFooter
        text="Немає облікового запису?"
        linkLabel="Зареєструватися"
        onPress={() => router.push("/sign-up")}
      />
    </AuthLayout>
  );
}
