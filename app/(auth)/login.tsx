<<<<<<< HEAD
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import { ArrowLeft, Lock, LogIn, Mail } from "lucide-react-native";
// Components
import Button from "@/components/Button";
import InputField from "@/components/InputField";
=======
import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import { ArrowLeft, LogIn, Mail, Lock } from "lucide-react-native";
// Components
import InputField from "@/components/InputField";
import Button from "@/components/Button";
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
// Stylesheets
import { authStyles } from "@/assets/stylesheets/authStyles";
// Constants
import { Colors } from "@/constants/themes";
// services/api
import { authApi } from "@/src/services/api/endpoints/auth";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Requests
  const loginRequest = async () => {
    try {
      const response = await authApi.login(email, password);
      if (
        response.data.accessToken &&
        response.data.refreshToken &&
        response.status === 200
      )
        Alert.alert("Alert Title", "Giriş başarılı", [
<<<<<<< HEAD
          { text: "OK", onPress: () => router.replace("/(onboarding)") },
=======
          { text: "OK", onPress: () => router.replace("/(tabs)") },
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
        ]);
      else
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
                Tekrar Merhaba!
              </Text>
              <Text style={[authStyles.topSmallText, { color: "#9ca3af" }]}>
                Serini bozmamak için giriş yap.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Body */}
      <InputField
        label="E-posta"
        icon={Mail}
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="ad@ornek.com"
      />
      <InputField
        label="Şifre"
        icon={Lock}
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        showPasswordToggle
      />

      <TouchableOpacity style={authStyles.forgotPasswordContainer}>
        <Text style={authStyles.forgotPasswordText}>Şifremi Unuttum</Text>
      </TouchableOpacity>

      <Button onPress={() => loginRequest()} disabled={!email || !password}>
        Giriş Yap
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
        <Text style={authStyles.bottomLineText}>Veya şununla devam et</Text>
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
            Google ile Giriş Yap
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
            Apple ile Giriş Yap
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
