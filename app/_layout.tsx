import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as SystemUI from "expo-system-ui";
import { Colors, MyLightTheme, MyDarkTheme } from "@/constants/themes";

// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // expo-system-ui enables you to interact with UI elements that fall outside of the React tree.
  // Specifically the root view background color, and locking the user interface style globally on Android.
  SystemUI.setBackgroundColorAsync(
    IsDark ? Colors.dark.background : Colors.light.background,
  );

  return (
    <ThemeProvider value={IsDark ? MyDarkTheme : MyLightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={IsDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
