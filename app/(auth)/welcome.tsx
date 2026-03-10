import React from "react";
import { View, Text } from "react-native";
import { Flame } from "lucide-react-native";
import Button from "@/components/Button";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/assets/stylesheets/welcomeStyle";
import { Colors } from "@/constants/themes";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";
import { StatusBar } from "expo-status-bar";

const Welcome = () => {
  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        { backgroundColor: IsDark ? "#111827" : "#ffffff" },
      ]}
    >
      <StatusBar style={IsDark ? "light": "dark" } />
      <View style={styles.bodyContainer}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: Colors.light.mainColor2 },
          ]}
        >
          <Flame size={80} color="#fff" fill="#fff" />
          {/* <Flame size={80} color={Colors.light.mainColor2} fill={Colors.light.mainColor2} /> */}
        </View>
        <Text style={styles.bodyHeaderText}>Zinciri Kırma</Text>
        <Text
          style={[
            styles.bodyDescText,
            { color: IsDark ? "#9ca3af" : "#6b7280" },
          ]}
        >
          Her gün biraz daha iyiye.{"\n"}Alışkanlıklarını oyunlaştır.
        </Text>
      </View>
      <View style={{ gap: 16, paddingBottom: 32 }}>
        <Button onPress={() => router.replace("/(auth)/login")}>
          Hemen Başla
        </Button>
        <Button
          variant="outline"
          onPress={() => router.replace("/(auth)/login")}
        >
          Zaten Hesabım Var
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
