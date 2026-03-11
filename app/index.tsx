import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
// Constants
import { Colors } from "@/constants/themes";
import { storageService, STORAGE_KEYS } from "@/src/services/storage/";
// !TEST
import { IsDark } from "@/constants/tempThemeSelector";

const Index = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

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

          return;
        }

        console.log("First Launch çalışmadı.");
        const accessToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.ACCESS_TOKEN,
        );

        const refreshToken = await storageService.get<string>(
          STORAGE_KEYS.AUTH.REFRESH_TOKEN,
        );

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
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
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/welcome");
    }
  }, [isReady, accessToken, refreshToken]);

  if (!isReady) return;

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
