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

export default function SignUpScreen() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Помилка", "Будь ласка, заповніть усі обов'язкові поля!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Помилка", "Паролі не співпадають!");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Помилка", "Пароль має містити мінімум 8 символів!");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("flow", "signUp");
      await signIn("password", formData);
    } catch {
      Alert.alert(
        "Помилка реєстрації",
        "Не вдалося створити профіль. Можливо, такий email вже використовується.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      icon="person-add"
      title="Новий акаунт"
      subtitle="Створіть профіль для збереження ваших списків справ"
    >
      <View style={authFormStyle}>
        <AuthField
          icon="person-outline"
          placeholder="Ваше ім'я"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Пароль (мін. 8 символів)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AuthField
          icon="shield-checkmark-outline"
          placeholder="Підтвердження пароля"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <AuthButton
          label="Зареєструватися"
          icon="checkmark-done-outline"
          loading={isLoading}
          onPress={() => void handleSignUp()}
        />
      </View>
      <AuthFooter
        text="Вже маєте акаунт?"
        linkLabel="Увійти"
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/sign-in"))}
      />
    </AuthLayout>
  );
}
