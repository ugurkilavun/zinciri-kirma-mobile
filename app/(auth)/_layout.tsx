import { Colors } from "@/constants/themes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  // 111827
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: { display: "none" },
        sceneStyle: {
          backgroundColor: IsDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      }}
    >
      <Tabs.Screen
        name="welcome"
        options={{
          title: "Welcome",
          animation: "fade",
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          animation: "fade", // "shift" | "fade"
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: "Register",
          animation: "fade",
        }}
      />
    </Tabs>
  );
}
