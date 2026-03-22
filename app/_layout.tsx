import { HabitProvider } from "@/src/contexts/HabitContext";
import "@/src/services/i18n/i18n";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import "react-native-reanimated";
// Theme
import { Colors } from "@/constants/themes";
import ThemeProvider from "@/src/contexts/ThemeContext";
// Services
import { STORAGE_KEYS, storageService } from "@/src/services/storage";

export default function RootLayout() {
  // Theme
  const [theme, setTheme] = useState<string>("light");

  SystemUI.setBackgroundColorAsync(
    theme === "light" ? Colors.light.background : Colors.dark.background,
  );

  useEffect(() => {
    const getTheme = async () => {
      try {
        const value: any = await storageService.get(
          STORAGE_KEYS.SETTINGS.THEME,
        );
        setTheme(value);
      } catch (error) {
        console.log("(getTheme)", error);
      }
    };

    getTheme();
  }, []);

  return (
    <ThemeProvider>
      <HabitProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor:
                theme === "light"
                  ? Colors.light.background
                  : Colors.dark.background,
            },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/*
           // ! Hatırlatma Mesajı: Sayfalar arası geçişte ufak beyazlık oluşması sorununun çözümü burada:
           // !contentStyle
          */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              animation: "fade",
              contentStyle: {
                backgroundColor:
                  theme === "light"
                    ? Colors.light.background
                    : Colors.dark.background,
              },
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animation: "default",
              contentStyle: {
                backgroundColor:
                  theme === "light"
                    ? Colors.light.background
                    : Colors.dark.background,
              },
            }}
          />

          <Stack.Screen
            name="(onboarding)"
            options={{
              headerShown: false,
              animation: "slide_from_right",
              contentStyle: {
                backgroundColor:
                  theme === "light"
                    ? Colors.light.background
                    : Colors.dark.background,
              },
            }}
          />
        </Stack>

        <StatusBar style={theme === "light" ? "dark" : "light"} />
      </HabitProvider>
    </ThemeProvider>
  );
}
