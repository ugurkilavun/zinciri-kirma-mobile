import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
// Icons
import Ionicons from "@expo/vector-icons/Ionicons";
// Colors
import { Colors } from "@/constants/themes";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        sceneStyle: {
          backgroundColor: IsDark
            ? Colors.dark.background
            : Colors.light.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <Ionicons
              name="rocket-outline"
              size={24}
              color={Colors.dark.background}
            />
          ),
        }}
      />
    </Tabs>
  );
}
