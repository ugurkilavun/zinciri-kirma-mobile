import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Icons
import { Plus } from "lucide-react-native";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
// Colors
import { Colors } from "@/constants/themes";

const CreateHabitButton = ({ onPress }: { onPress: any }) => {
  return (
    <TouchableOpacity
      style={styles.createHabitButtonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.createHabitButtonInner}>
        <Plus size={28} strokeWidth={3} color={"#fff"} />
      </View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, focused }) => (
            <Octicons
              name={focused ? "home-fill" : "home"}
              size={22}
              color={color}
            />
          ),
        }}
      />

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
        name="create-habit"
        // component={CreateHabitScreen}
        options={{
          tabBarButton: (props) => (
            <CreateHabitButton onPress={props.onPress} />
          ),
          tabBarLabel: () => null,
        }}
      />

      <Tabs.Screen
        name="achievements"
        options={{href:null,}}
        // options={{
        //   title: "Rozetler",
        //   tabBarIcon: ({ color, focused }) => (
        //     <Ionicons
        //       name={focused ? "trophy" : "trophy-outline"}
        //       size={22}
        //       color={color}
        //     />
        //   ),
        // }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <Octicons
              name={focused ? "person-fill" : "person"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Sıralama",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "trophy" : "trophy-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* TAB BAR'DA GÖZÜKMESİN */}
      <Tabs.Screen name="calendar" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createHabitButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  createHabitButtonInner: {
    backgroundColor: Colors.light.mainColorGreen,
    position: "absolute",
    top: -18,
    width: 60,
    height: 57,
    borderRadius: 18,
    borderBottomWidth: 5,
    borderBottomColor: Colors.light.borderBottomColorGreen,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    // ios
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // android
    elevation: 6,
  },
});
