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
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Register = () => {
  // Languages
  const { t } = useTranslation("auth");

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
          backgroundColor: IsDark
            ? Colors.dark.background
            : Colors.light.background,
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
                  Aramiza Katil!
                </Text>
                <Text style={[authStyles.topSmallText, { color: "#9ca3af" }]}>
                  Yolculuga baslamak icin kaydol.
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
          placeholder="Adiniz Soyadiniz"
        />
        <InputField
          label={t("email")}
          icon={Mail}
          type="email"
          value={email}
          onChange={setEmail}
          placeholder={t("namePlaceholder")}
        />
        <InputField
          label="Sifre"
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
            backgroundColor: IsDark ? "#1F2A37" : "#ecfdf5",
            borderRadius: 16,
            marginTop: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: IsDark ? "#374151" : "#d1fae5",
          }}
        >
          <Sparkles size={20} color={IsDark ? "#34D399" : "#10b981"} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: IsDark ? "#D1FAE5" : "#047857",
            }}
          >
            1M+ kisi zinciri kirmiyor!
          </Text>
        </View>

        <Button
          onPress={() => registerRequest()}
          disabled={!name || !email || !password || loading}
          icon={Rocket}
        >
          Hesap Olustur
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
          <Text style={authStyles.bottomLineText}>Veya sununla devam et</Text>
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
              Google ile Giris Yap
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
              Apple ile Giris Yap
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
