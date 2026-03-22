import { IsDark } from "@/constants/tempThemeSelector";
import { Colors, MyDarkTheme, MyLightTheme } from "@/constants/themes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HabitProvider } from "@/src/context/HabitContext";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import "react-native-reanimated";
import "@/src/services/i18n/i18n";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useColorScheme();

  SystemUI.setBackgroundColorAsync(
    IsDark ? Colors.dark.background : Colors.light.background,
  );

  return (
    <HabitProvider>
      <ThemeProvider value={IsDark ? MyDarkTheme : MyLightTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: IsDark
                ? Colors.dark.background
                : Colors.light.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, animation: "fade" }}
          />

          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />

          <Stack.Screen
            name="(onboarding)"
            options={{ headerShown: false, animation: "slide_from_right" }}
          />
        </Stack>

        <StatusBar style={IsDark ? "light" : "dark"} />
      </ThemeProvider>
    </HabitProvider>
  );
}