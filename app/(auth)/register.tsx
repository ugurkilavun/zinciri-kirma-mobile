import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  ArrowLeft,
  Lock,
  Mail,
  Rocket,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react-native";
// Components
import Button from "@/components/Button";
import InputField from "@/components/InputField";
// Stylesheets
import { authStyles } from "@/assets/stylesheets/authStyles";
// Constants
import { Colors } from "@/constants/themes";
// src/services
import { authApi } from "@/src/services/api/endpoints/auth";
import { STORAGE_KEYS, storageService } from "@/src/services/storage/";
// Hooks
import { useTheme } from "@/hooks/useTheme";

const Register = () => {
  // Languages
  const { t } = useTranslation("auth");

  // Theme
  const { theme } = useTheme();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const registerRequest = async () => {
    try {
      setLoading(true);

      const response = await authApi.register(name, email, password);
      console.log(response.status);
      console.log(response.data);

      if (
        response.data?.accessToken &&
        response.data?.refreshToken &&
        response.status === 201
      ) {
        // Auths
        await storageService.set<string>(
          STORAGE_KEYS.AUTH.ACCESS_TOKEN,
          response.data.accessToken,
        );

        await storageService.set<string>(
          STORAGE_KEYS.AUTH.REFRESH_TOKEN,
          response.data.refreshToken,
        );

        router.replace("/(onboarding)");
      } else {
        Alert.alert("Hata", "Bilinmeyen bir hata oluştu", [
          { text: "OK", onPress: () => null },
        ]);
      }
    } catch (error) {
      console.log("Register error:", error);
      Alert.alert("Hata", "Kayit olurken bir hata olustu", [
        { text: "OK", onPress: () => null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        authStyles.safeAreaView,
        {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/welcome")}
        style={{ backgroundColor: "transparent" }}
      >
        <ArrowLeft size={32} color="#9ca3af" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={authStyles.topContainer}>
          <View>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <View
                style={[
                  authStyles.top,
                  {
                    backgroundColor:
                      theme === "light" ? "#f1ffe7" : "#10b9811a",
                  },
                ]}
              >
                <UserPlus size={32} color="#5EC72D" strokeWidth={2} />
              </View>
              <View>
                <Text
                  style={[
                    authStyles.topStrongText,
                    {
                      color: theme === "light" ? "#111827" : "#ffffff",
                    },
                  ]}
                >
                  {t("register.title")}
                </Text>
                <Text style={[authStyles.topSmallText, { color: "#9ca3af" }]}>
                  {t("register.description")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <InputField
          label={t("name")}
          icon={User}
          type="name"
          value={name}
          onChange={setName}
          placeholder={t("namePlaceholder")}
        />
        <InputField
          label={t("email")}
          icon={Mail}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={t("emailPlaceholder")}
        />
        <InputField
          label={t("password")}
          icon={Lock}
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          showPasswordToggle
        />

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            padding: 16,
            backgroundColor: theme === "light" ? "#ecfdf5" : "#1F2A37",
            borderRadius: 16,
            marginTop: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme === "light" ? "#d1fae5" : "#374151",
          }}
        >
          <Sparkles
            size={20}
            color={theme === "light" ? "#10b981" : "#34D399"}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: theme === "light" ? "#047857" : "#D1FAE5",
            }}
          >
            {t("register.notification")}
          </Text>
        </View>

        <Button
          onPress={() => registerRequest()}
          disabled={!name || !email || !password || loading}
          icon={Rocket}
        >
          {t("register.signUp")}
        </Button>

        <View style={authStyles.bottomContainer}>
          <View
            style={[
              authStyles.bottomLine,
              {
                backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
              },
            ]}
          />
          <Text style={authStyles.bottomLineText}>{t("continueWith")}</Text>
          <View
            style={[
              authStyles.bottomLine,
              {
                backgroundColor: theme === "light" ? "#f3f4f6" : "#1f2937",
              },
            ]}
          />
        </View>

        <View style={authStyles.bottomLoginOptionContainer}>
          <TouchableOpacity
            onPress={() => null}
            activeOpacity={0.8}
            style={[
              authStyles.bottomButton,
              { borderColor: theme === "light" ? "#e5e7eb" : "#374151" },
            ]}
          >
            <AntDesign
              name="google"
              size={24}
              color={theme === "light" ? "#374151" : "#9ca3af"}
            />
            <Text
              style={[
                authStyles.bottomButtonText,
                { color: theme === "light" ? "#374151" : "#9ca3af" },
              ]}
            >
              {t("withGoogle")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => null}
            activeOpacity={0.8}
            style={[
              authStyles.bottomButton,
              { borderColor: theme === "light" ? "#e5e7eb" : "#374151" },
            ]}
          >
            <AntDesign
              name="apple"
              size={24}
              color={theme === "light" ? "#374151" : "#9ca3af"}
            />
            <Text
              style={[
                authStyles.bottomButtonText,
                { color: theme === "light" ? "#374151" : "#9ca3af" },
              ]}
            >
              {t("withApple")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
