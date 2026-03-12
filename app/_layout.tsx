<<<<<<< HEAD
import { IsDark } from "@/constants/tempThemeSelector";
import { Colors, MyDarkTheme, MyLightTheme } from "@/constants/themes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HabitProvider } from "@/src/context/HabitContext";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import "react-native-reanimated";
=======
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as SystemUI from "expo-system-ui";
import { Colors, MyLightTheme, MyDarkTheme } from "@/constants/themes";

// !TEST
import { IsDark } from "@/constants/tempThemeSelector";
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
<<<<<<< HEAD
  useColorScheme();

=======
  const colorScheme = useColorScheme();
  // expo-system-ui enables you to interact with UI elements that fall outside of the React tree.
  // Specifically the root view background color, and locking the user interface style globally on Android.
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
  SystemUI.setBackgroundColorAsync(
    IsDark ? Colors.dark.background : Colors.light.background,
  );

  return (
<<<<<<< HEAD
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
=======
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
      </Stack>
      <StatusBar style={IsDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
