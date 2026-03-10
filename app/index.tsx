// import useState from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect } from "react";
// Constants
import { Colors } from "@/constants/themes";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Index = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: IsDark ? "#111827" : "#ffffff" }}
    >
      <View
        style={{
          backgroundColor: IsDark ? "#111827" : "#ffffff",
          paddingTop: 50 * 5,
        }}
      >
        <ActivityIndicator size="large" color={Colors.dark.mainColor2} />
      </View>
    </SafeAreaView>
  );
};

export default Index;
