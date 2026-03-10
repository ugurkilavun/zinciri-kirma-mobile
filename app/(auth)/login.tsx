import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft, LogIn, Mail, Lock } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
// Components
import InputField from "@/components/InputField";
import Button from "@/components/Button";
// Styles
import { styles } from "@/assets/stylesheets/loginStyles";
import { router } from "expo-router";
// Constants
import { Colors } from "@/constants/themes";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        { backgroundColor: IsDark ? "#111827" : "#ffffff" },
      ]}
    >
      {/* Top */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => router.replace("/(auth)/welcome")}>
          <ArrowLeft size={32} color={Colors.light.mainColor2} />
        </TouchableOpacity>

        <View style={{ marginTop: 32 }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/*  { backgroundColor: IsDark ? "#10b9811a" : "#ecfdf5" }, */}
            <View
              style={[
                styles.top,
                { backgroundColor: IsDark ? "#10b9811a" : "#f1ffe7" },
              ]}
            >
              <LogIn size={32} color={Colors.light.mainColor2} />
            </View>
            <View>
              <Text
                style={[
                  styles.topStrongText,
                  {
                    color: IsDark ? "#ffffff" : "#111827",
                  },
                ]}
              >
                Tekrar Merhaba!
              </Text>
              <Text style={[styles.topSmallText, { color: "#9ca3af" }]}>
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

      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
      </TouchableOpacity>

      <Button
        onPress={() => router.replace("/(tabs)")}
        disabled={!email || !password}
      >
        Giriş Yap
      </Button>

      {/* Bottom */}
      <View style={styles.bottomContainer}>
        <View
          style={[
            styles.bottomLine,
            {
              backgroundColor: IsDark ? "#1f2937" : "#f3f4f6",
            },
          ]}
        />
        <Text style={styles.bottomLineText}>Veya şununla devam et</Text>
        <View
          style={[
            styles.bottomLine,
            {
              backgroundColor: IsDark ? "#1f2937" : "#f3f4f6",
            },
          ]}
        />
      </View>

      <View style={styles.bottomLoginOptionContainer}>
        <TouchableOpacity
          onPress={() => null}
          activeOpacity={0.8}
          style={[
            styles.bottomButton,
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
              styles.bottomButtonText,
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
            styles.bottomButton,
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
              styles.bottomButtonText,
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
