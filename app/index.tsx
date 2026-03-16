import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";
// src/services
import { STORAGE_KEYS, storageService } from "@/src/services/storage/";

const Index = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] =
    useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      // storageService.clear();

      try {
        const firstLaunch = await storageService.get<boolean>(
          STORAGE_KEYS.AUTH.FIRST_LAUNCH,
        );

        if (firstLaunch === null) {
          // First Launch
          await storageService.set<boolean>(
            STORAGE_KEYS.AUTH.FIRST_LAUNCH,
            false,
          );

          // Theme
          await storageService.set<string>(
            STORAGE_KEYS.SETTINGS.THEME,
            "light",
          );

          // Language
          await storageService.set<string>(
            STORAGE_KEYS.SETTINGS.LANGUAGE,
            "en",
          );

          setIsReady(true);
          return;
        }

        const storedAccessToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.ACCESS_TOKEN,
        );

        const storedRefreshToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.REFRESH_TOKEN,
        );

        const completed = await storageService.get<boolean>(
          STORAGE_KEYS.ONBOARDING.COMPLETED,
        );

        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setOnboardingCompleted(!!completed);
      } catch (error) {
        console.error("Session kontrol hatasi:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    console.log(accessToken);
    if (accessToken && refreshToken) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/welcome");
    }
  }, [isReady, accessToken, refreshToken, onboardingCompleted]);

  if (!isReady) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: IsDark
            ? Colors.dark.background
            : Colors.light.background,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color={
              IsDark ? Colors.dark.mainColorGreen : Colors.light.mainColorGreen
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

export default Index;
