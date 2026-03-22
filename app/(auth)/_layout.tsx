import { Colors } from "@/constants/themes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";
// Hooks
import { useTheme } from "@/hooks/useTheme";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  // Theme
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: { display: "none" },
        sceneStyle: {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
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
