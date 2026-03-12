<<<<<<< HEAD
import { Colors } from "@/constants/themes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
=======
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
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c

  return (
    <Tabs
      screenOptions={{
<<<<<<< HEAD
        headerShown: false,
        tabBarActiveTintColor: Colors.light.mainColorGreen,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEF2F7",
          borderTopWidth: 1,
        },
        sceneStyle: {
          backgroundColor: "#F7F8FA",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
=======
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        sceneStyle: {
          backgroundColor: IsDark
            ? Colors.dark.background
            : Colors.light.background,
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
<<<<<<< HEAD
          title: "Ana Sayfa",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
=======
          title: "Home",
          tabBarIcon: () => (
            <Ionicons
              name="rocket-outline"
              size={24}
              color={Colors.dark.background}
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
            />
          ),
        }}
      />
<<<<<<< HEAD

      <Tabs.Screen
        name="statistics"
        options={{
          title: "Ilerleme",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="achievements"
        options={{
          title: "Rozetler",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "trophy" : "trophy-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="create-habit"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
=======
    </Tabs>
  );
}
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
