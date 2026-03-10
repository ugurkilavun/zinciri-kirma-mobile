import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "@/constants/themes";
import { useColorScheme } from "@/hooks/use-color-scheme";
// Icons
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        sceneStyle: {
          backgroundColor: "#18b13e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="rocket-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
