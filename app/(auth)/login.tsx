import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
// Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import { ArrowLeft, Lock, LogIn, Mail } from "lucide-react-native";
// Components
import Button from "@/components/Button";
import InputField from "@/components/InputField";
// Stylesheets
import { authStyles } from "@/assets/stylesheets/authStyles";
// Constants
import { Colors } from "@/constants/themes";
// src/services
import { STORAGE_KEYS, storageService } from "@/src/services/storage/";
import { authApi } from "@/src/services/api/endpoints/auth";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Login = () => {
  // Languages
  const { t } = useTranslation("auth");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Requests
  const loginRequest = async () => {
    try {
      const response = await authApi.login(email, password);
      console.log(response.status);
      console.log(response.data);
      if (
        response.data.accessToken &&
        response.data.refreshToken &&
        response.status === 200
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

        router.replace("/(tabs)");
      } else
        Alert.alert("Hata", "Bilinmeyen bir hata oluştu", [
          { text: "OK", onPress: () => null },
        ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={[
        authStyles.safeAreaView,
        {
          backgroundColor: IsDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      {/* Back */}
      <TouchableOpacity onPress={() => router.replace("/(auth)/welcome")}>
        <ArrowLeft size={32} color="#9ca3af" />
      </TouchableOpacity>

      {/* Top */}
      <View style={authStyles.topContainer}>
        <View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/*  { backgroundColor: IsDark ? "#10b9811a" : "#ecfdf5" }, */}
            <View
              style={[
                authStyles.top,
                { backgroundColor: IsDark ? "#10b9811a" : "#f1ffe7" },
              ]}
            >
              <LogIn size={32} color={Colors.light.mainColorGreen} />
            </View>
            <View>
              <Text
                style={[
                  authStyles.topStrongText,
                  {
                    color: IsDark ? "#ffffff" : "#111827",
                  },
                ]}
              >
                {t("login.title")}
              </Text>
              <Text style={[authStyles.topSmallText, { color: "#9ca3af" }]}>
                {t("login.description")}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Body */}
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

      <TouchableOpacity style={authStyles.forgotPasswordContainer}>
        <Text style={authStyles.forgotPasswordText}>
          {t("login.forgotPassword")}
        </Text>
      </TouchableOpacity>

      <Button onPress={() => loginRequest()} disabled={!email || !password}>
        {t("login.login")}
      </Button>

      {/* Bottom */}
      <View style={authStyles.bottomContainer}>
        <View
          style={[
            authStyles.bottomLine,
            {
              backgroundColor: IsDark ? "#1f2937" : "#f3f4f6",
            },
          ]}
        />
        <Text style={authStyles.bottomLineText}>{t("continueWith")}</Text>
        <View
          style={[
            authStyles.bottomLine,
            {
              backgroundColor: IsDark ? "#1f2937" : "#f3f4f6",
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
            { borderColor: IsDark ? "#374151" : "#e5e7eb" },
          ]}
        >
          <AntDesign
            name="google"
            size={24}
            color={IsDark ? "#9ca3af" : "#374151"}
          />
          <Text
            style={[
              authStyles.bottomButtonText,
              { color: IsDark ? "#9ca3af" : "#374151" },
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
            { borderColor: IsDark ? "#374151" : "#e5e7eb" },
          ]}
        >
          <AntDesign
            name="apple"
            size={24}
            color={IsDark ? "#9ca3af" : "#374151"}
          />
          <Text
            style={[
              authStyles.bottomButtonText,
              { color: IsDark ? "#9ca3af" : "#374151" },
            ]}
          >
            {t("withApple")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
