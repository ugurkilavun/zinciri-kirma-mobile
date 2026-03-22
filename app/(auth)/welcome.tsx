import React from "react";
import { View, Text } from "react-native";
import { Flame, Link, Unlink } from "lucide-react-native";
import Button from "@/components/Button";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
// Stylesheets
import { styles } from "@/assets/stylesheets/welcomeStyle";
// Constants
import { Colors } from "@/constants/themes";
// Hooks
import { useTheme } from "@/hooks/useTheme";

const Welcome = () => {
  // Languages
  const { t } = useTranslation("welcome");

  // Theme
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      <View style={styles.bodyContainer}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: Colors.light.mainColorGreen },
          ]}
        >
          <Link
            size={80}
            color={
              theme === "light"
                ? Colors.light.background
                : Colors.dark.background
            }
            fill={Colors.light.mainColorGreen}
          />
          {/* <Flame size={80} color={Colors.light.mainColor2} fill={Colors.light.mainColor2} /> */}
        </View>
        <Text style={styles.bodyHeaderText}>{t("title")}</Text>
        <Text
          style={[
            styles.bodyDescText,
            { color: theme === "light" ? "#6b7280" : "#9ca3af" },
          ]}
        >
          {t("description")}
        </Text>
      </View>
      <View style={{ gap: 16, paddingBottom: 32 }}>
        <Button onPress={() => router.replace("/(auth)/register")}>
          {t("signUp")}
        </Button>
        <Button
          variant="outline"
          onPress={() => router.replace("/(auth)/login")}
        >
          {t("login")}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
