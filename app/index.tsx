<<<<<<< HEAD
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Constants
import { Colors } from "@/constants/themes";
import { STORAGE_KEYS, storageService } from "@/src/services/storage/";
=======
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
// Constants
import { Colors } from "@/constants/themes";
import { storageService, STORAGE_KEYS } from "@/src/services/storage/";
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Index = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
<<<<<<< HEAD
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
=======
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c

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
<<<<<<< HEAD
          setIsReady(true);
=======

>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
          return;
        }

        console.log("First Launch çalışmadı.");
        const accessToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.ACCESS_TOKEN,
        );

        const refreshToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.REFRESH_TOKEN,
        );
<<<<<<< HEAD
        const completed = await storageService.get<boolean>(
          STORAGE_KEYS.ONBOARDING.COMPLETED,
        );

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setOnboardingCompleted(!!completed);
=======

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
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
<<<<<<< HEAD
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
=======
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/welcome");
    }
  }, [isReady, accessToken, refreshToken]);

  if (!isReady) return;
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: IsDark
<<<<<<< HEAD
        
=======
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c
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
