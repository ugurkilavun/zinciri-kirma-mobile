import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Icons
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  ArrowLeft,
  LogIn,
  User,
  Mail,
  Lock,
  UserPlus,
  Sparkles,
  Rocket,
} from "lucide-react-native";
// Components
import InputField from "@/components/InputField";
import Button from "@/components/Button";
// Stylesheets
import { authStyles } from "@/assets/stylesheets/authStyles";
// Constants
import { Colors } from "@/constants/themes";
// /services/api
import { authApi } from "@/src/services/api/endpoints/auth";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Requests
  const registerRequest = async () => {
    try {
      const response = await authApi.register(name, email, password);
      console.log(response.status);
      if (
        response.data.accessToken &&
        response.data.refreshToken &&
        response.status === 201
      )
        Alert.alert("Alert Title", "Kayıt başarılı.", [
          { text: "OK", onPress: () => router.replace("/(tabs)") },
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
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/welcome")}
        style={{ backgroundColor: "none" }}
      >
        <ArrowLeft size={32} color="#9ca3af" />
      </TouchableOpacity>

      {/* ScrollView  */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top */}
        <View style={authStyles.topContainer}>
          <View>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <View
                style={[
                  authStyles.top,
                  { backgroundColor: IsDark ? "#10b9811a" : "#f1ffe7" },
                ]}
              >
                <UserPlus size={32} color="#5EC72D" strokeWidth={2} />
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
                  Aramıza Katıl!
                </Text>
                <Text style={[authStyles.topSmallText, { color: "#9ca3af" }]}>
                  Yolculuğa başlamak için kaydol.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Body */}
        <InputField
          label="Ad Soyad"
          icon={User}
          type="name"
          value={name}
          onChange={setName}
          placeholder="Adınız Soyadınız"
        />
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

        {/* 1M+ Notification */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            padding: 16,
            backgroundColor: IsDark ? "#1F2A37" : "#ecfdf5",
            borderRadius: 16,
            marginTop: 16,
            marginBottom: 20,
            // marginVertical: 24,
            borderWidth: 1,
            borderColor: IsDark ? "#374151" : "#d1fae5",
          }}
        >
          <Sparkles size={20} color={IsDark ? "#34D399" : "#10b981"} />
          {/* Dark'ta daha açık yeşil ikon */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: IsDark ? "#D1FAE5" : "#047857",
            }}
          >
            1M+ kişi zinciri kırmıyor!
          </Text>
        </View>

        <Button
          onPress={() => registerRequest()}
          disabled={!name || !email || !password}
          icon={Rocket}
        >
          Hesap Oluştur
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
