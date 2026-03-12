import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Constants
import { Colors } from "@/constants/themes";
import { STORAGE_KEYS, storageService } from "@/src/services/storage/";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Index = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

  // useEffect(s)
  useEffect(() => {
    const checkSession = async () => {
      try {
        // await storageService.clear();
        const firstLaunch = await storageService.get<boolean>(
          STORAGE_KEYS.AUTH.FIRST_LAUNCH,
        );

        if (firstLaunch === null) {
          console.log("First Launch çalıştı!");

          // First launch
          await storageService.set<boolean>(
            STORAGE_KEYS.AUTH.FIRST_LAUNCH,
            false,
          );

          // Theme
          await storageService.set<string>(
            STORAGE_KEYS.SETTINGS.THEME,
            "light",
          );
          setIsReady(true);
          return;
        }

        console.log("First Launch çalışmadı.");
        const accessToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.ACCESS_TOKEN,
        );

        const refreshToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.REFRESH_TOKEN,
        );
        const completed = await storageService.get<boolean>(
          STORAGE_KEYS.ONBOARDING.COMPLETED,
        );

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setOnboardingCompleted(!!completed);
      } catch (error) {
        console.error("Session kontrol hatası:", error);
      } finally {
        setIsReady(true);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (accessToken && refreshToken) {
      if (onboardingCompleted) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(onboarding)");
      }
    } else {
      router.replace("/(auth)/welcome");
    }
  }, [isReady, accessToken, refreshToken, onboardingCompleted]);

  if (!isReady) return null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: IsDark
        
          ? Colors.dark.background
          : Colors.dark.background,
      }}
    >
      <View
        style={{
          paddingTop: 50 * 5,
        }}
      >
        <ActivityIndicator size="large" color={Colors.dark.mainColorGreen} />
      </View>
    </SafeAreaView>
  );
};

export default Index;
