import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Icons
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { ArrowLeft, Lock, LogIn, Mail } from "lucide-react-native";
// Stylesheets
import { authStyles } from "@/assets/stylesheets/authStyles";
import { Colors } from "@/constants/themes";
// src/services
import { authApi } from "@/src/services/api/endpoints/auth";
import { STORAGE_KEYS, storageService } from "@/src/services/storage/";
// ! TEST
import { IsDark } from "@/constants/tempThemeSelector";

const GOOGLE_WEB_CLIENT_ID =
  "118200182956-hp33c7n062acpkgmj05cic1p7hlcfphf.apps.googleusercontent.com";

const GOOGLE_IOS_CLIENT_ID =
  "118200182956-lakjbq4lhagm0ipb2jsh3rafhquqq8l2.apps.googleusercontent.com";

const Login = () => {
  // Languages
  const { t } = useTranslation("auth");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });
  }, []);

  const saveTokensAndRoute = async (data: {
    accessToken: string;
    refreshToken: string;
  }) => {
    // await storageService.clear();
    await storageService.set(STORAGE_KEYS.AUTH.ACCESS_TOKEN, data.accessToken);
    await storageService.set(
      STORAGE_KEYS.AUTH.REFRESH_TOKEN,
      data.refreshToken,
    );
    router.replace("/(tabs)");
    // router.replace("/(onboarding)");
  };

  const loginRequest = async () => {
    try {
      setLoading(true);

      const response = await authApi.login(email, password);

      if (
        response.data?.accessToken &&
        response.data?.refreshToken &&
        response.status === 200
      ) {
        // Auths
        await saveTokensAndRoute(response.data);
      } else
        Alert.alert("Hata", "Bilinmeyen bir hata oluştu", [
          { text: "OK", onPress: () => null },
        ]);
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Hata", "Giris yapilirken bir hata olustu");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken ?? null;

      if (!idToken) {
        Alert.alert("Hata", "Google kimlik tokeni alinamadi.");
        return;
      }

      const response = await authApi.googleLogin(idToken);

      if (response.data?.accessToken && response.data?.refreshToken) {
        await saveTokensAndRoute(response.data);
      } else {
        Alert.alert("Hata", "Google girisi tamamlanamadi.");
      }
    } catch (error: any) {
      console.log("Google login error:", error);

      if (error?.code === statusCodes.SIGN_IN_CANCELLED) return;

      Alert.alert("Hata", "Google ile giris yapilamadi.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        Alert.alert("Hata", "Apple kimlik tokeni alinamadi.");
        return;
      }

      const response = await authApi.appleLogin({
        idToken: credential.identityToken,
        email: credential.email ?? undefined,
        firstName: credential.fullName?.givenName ?? undefined,
        lastName: credential.fullName?.familyName ?? undefined,
      });

      if (response.data?.accessToken && response.data?.refreshToken) {
        await saveTokensAndRoute(response.data);
      } else {
        Alert.alert("Hata", "Apple girisi tamamlanamadi.");
      }
    } catch (error) {
      console.log("Apple login error:", error);
      Alert.alert("Hata", "Apple ile giris yapilamadi.");
    } finally {
      setLoading(false);
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
      <TouchableOpacity onPress={() => router.replace("/(auth)/welcome")}>
        <ArrowLeft size={32} color="#9ca3af" />
      </TouchableOpacity>

      <View style={authStyles.topContainer}>
        <View>
          <View style={{ flexDirection: "row", gap: 16 }}>
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
                  { color: IsDark ? "#ffffff" : "#111827" },
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
          onPress={() => handleGoogleLogin()}
          activeOpacity={0.8}
          style={[
            authStyles.bottomButton,
            { borderColor: IsDark ? "#374151" : "#e5e7eb" },
          ]}
          disabled={loading}
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

        {Platform.OS === "ios" && (
          <TouchableOpacity
            onPress={handleAppleLogin}
            activeOpacity={0.8}
            style={[
              authStyles.bottomButton,
              { borderColor: IsDark ? "#374151" : "#e5e7eb" },
            ]}
            disabled={loading}
          >
            <Text
              style={[
                authStyles.bottomButtonText,
                { color: IsDark ? "#9ca3af" : "#374151" },
              ]}
            >
              {t("withApple")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Login;
