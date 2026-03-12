import { router } from "expo-router";
import {
    BookOpen,
    Brain,
    Clock3,
    Droplets,
    Dumbbell,
    Flame,
    GraduationCap,
    Plus,
    Sparkles,
    Trophy,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/Button";
import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";
import { STORAGE_KEYS, storageService } from "@/src/services/storage";

type CategoryId =
  | "spor"
  | "ders"
  | "kitap"
  | "meditasyon"
  | "su"
  | "ozel";

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 780;

const categories = [
  {
    id: "spor" as CategoryId,
    label: "Spor",
    icon: Dumbbell,
    bg: "#FFE5E5",
    iconBg: "#FF5A5F",
  },
  {
    id: "ders" as CategoryId,
    label: "Ders",
    icon: GraduationCap,
    bg: "#EAF2FF",
    iconBg: "#4F8EF7",
  },
  {
    id: "kitap" as CategoryId,
    label: "Kitap",
    icon: BookOpen,
    bg: "#F0E8FF",
    iconBg: "#A855F7",
  },
  {
    id: "meditasyon" as CategoryId,
    label: "Meditasyon",
    icon: Brain,
    bg: "#ECEAFF",
    iconBg: "#6D5EF7",
  },
  {
    id: "su" as CategoryId,
    label: "Su Icme",
    icon: Droplets,
    bg: "#E6F9FF",
    iconBg: "#06B6D4",
  },
  {
    id: "ozel" as CategoryId,
    label: "Ozel Hedef",
    icon: Plus,
    bg: "#F8FAFC",
    iconBg: "#94A3B8",
  },
];

const reminderOptions = ["07:00", "09:00", "18:00", "21:00"];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<CategoryId | null>(null);
  const [selectedTime, setSelectedTime] = useState("09:00");

  const backgroundColor = IsDark ? Colors.dark.background : "#F8FAFC";

  const nextStep = async () => {
    if (step === 1 && !selectedGoal) return;

    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }

    await storageService.set(STORAGE_KEYS.ONBOARDING.COMPLETED, true);
    await storageService.set(STORAGE_KEYS.ONBOARDING.GOAL, selectedGoal);
    await storageService.set(STORAGE_KEYS.ONBOARDING.REMINDER_TIME, selectedTime);

    router.replace("/(tabs)");
  };

  const skipReminder = async () => {
    setStep(4);
  };

  const progress = useMemo(() => [1, 2, 3, 4], []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 18),
          },
        ]}
      >
        <View style={styles.progressWrapper}>
          {progress.map((item) => (
            <View
              key={item}
              style={[
                styles.progressBar,
                {
                  backgroundColor:
                    item <= step ? Colors.light.mainColorGreen : "#E5E7EB",
                },
              ]}
            />
          ))}
        </View>

        {step === 1 && (
          <View style={styles.screen}>
            <View>
              <Text style={styles.title}>Hangi aliskanligi olusturmak istiyorsun?</Text>
              <Text style={styles.subtitle}>
                Tutarli kalmak istedigin alani sec
              </Text>
            </View>

            <View style={styles.grid}>
              {categories.map((item) => {
                const Icon = item.icon;
                const selected = selectedGoal === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedGoal(item.id)}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: item.bg,
                        borderColor: selected
                          ? Colors.light.mainColorGreen
                          : "transparent",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.categoryIconWrapper,
                        { backgroundColor: item.iconBg },
                      ]}
                    >
                      <Icon size={26} color="#fff" />
                    </View>
                    <Text style={styles.categoryLabel}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.footer}>
              <Button onPress={nextStep} disabled={!selectedGoal}>
                Devam Et
              </Button>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.screen}>
            <View style={styles.centerBlock}>
              <Text style={styles.title}>Her gun devam et, zinciri koru</Text>

              <View style={styles.flameWrapper}>
                <Flame size={84} color="#fff" fill="#F97316" />
                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeText}>7</Text>
                </View>
              </View>

              <Text style={[styles.subtitle, styles.centerText]}>
                Streak'in her gun buyur. Bir gun atlarsan zincir kirilir.
              </Text>

              <View style={styles.daysRow}>
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <View key={day} style={styles.dayCircle}>
                    <Text style={styles.dayCircleText}>{day}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <Button onPress={nextStep}>Devam Et</Button>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.screen}>
            <View style={styles.centerBlock}>
              <View style={styles.reminderIconBox}>
                <Clock3 size={38} color="#fff" />
              </View>

              <Text style={styles.title}>Hatirlatici kur</Text>
              <Text style={[styles.subtitle, styles.centerText]}>
                Seni her gun ayni saatte hatirlatalim
              </Text>

              <View style={styles.timeCard}>
                <Text style={styles.timeText}>{selectedTime}</Text>
              </View>

              <View style={styles.timeOptions}>
                {reminderOptions.map((time) => {
                  const active = selectedTime === time;

                  return (
                    <TouchableOpacity
                      key={time}
                      onPress={() => setSelectedTime(time)}
                      style={[
                        styles.timeChip,
                        {
                          backgroundColor: active
                            ? Colors.light.mainColorGreen
                            : "#fff",
                          borderColor: active
                            ? Colors.light.mainColorGreen
                            : "#E5E7EB",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeChipText,
                          { color: active ? "#fff" : "#334155" },
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.footer}>
              <Button onPress={nextStep}>Kaydet</Button>

              <View style={{ marginTop: 12 }}>
                <Button variant="outline" onPress={skipReminder}>
                  Simdilik Atla
                </Button>
              </View>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.screen}>
            <View style={styles.centerBlock}>
              <View style={styles.successCircle}>
                <Sparkles size={80} color="#fff" />
                <View style={styles.trophyMini}>
                  <Trophy size={18} color="#fff" />
                </View>
              </View>

              <Text style={styles.title}>Hazirsin!</Text>
              <Text style={[styles.subtitle, styles.centerText]}>
                Streak yolculuguna baslamaya hazirsin.
              </Text>
            </View>

            <View style={styles.footer}>
              <Button onPress={nextStep}>Yolculuga Basla</Button>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = (width - 52) / 2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressWrapper: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 999,
  },

  screen: {
    flex: 1,
    justifyContent: "space-between",
  },

  centerBlock: {
    alignItems: "center",
    paddingTop: isSmallDevice ? 10 : 20,
  },

  title: {
    fontSize: isSmallDevice ? 24 : 30,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginTop: 18,
    lineHeight: isSmallDevice ? 30 : 36,
  },
  subtitle: {
    fontSize: isSmallDevice ? 16 : 17,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 10,
  },
  centerText: {
    textAlign: "center",
    maxWidth: 320,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 24,
    rowGap: 14,
  },
  categoryCard: {
    width: CARD_WIDTH,
    minHeight: isSmallDevice ? 150 : 162,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  categoryIconWrapper: {
    width: 62,
    height: 62,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  categoryLabel: {
    fontSize: isSmallDevice ? 17 : 19,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  flameWrapper: {
    marginTop: isSmallDevice ? 34 : 46,
    width: isSmallDevice ? 150 : 170,
    height: isSmallDevice ? 150 : 170,
    borderRadius: 999,
    backgroundColor: "#FDBA74",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  streakBadge: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.light.mainColorGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  streakBadgeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
    maxWidth: 310,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.mainColorGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },

  reminderIconBox: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: "#0EA5E9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: isSmallDevice ? 26 : 36,
  },
  timeCard: {
    width: "100%",
    marginTop: 24,
    borderRadius: 28,
    backgroundColor: "#fff",
    paddingVertical: isSmallDevice ? 24 : 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  timeText: {
    fontSize: isSmallDevice ? 44 : 52,
    fontWeight: "900",
    color: "#0F172A",
  },
  timeOptions: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 18,
  },
  timeChip: {
    minWidth: 84,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
  },
  timeChipText: {
    fontSize: 15,
    fontWeight: "800",
  },

  successCircle: {
    marginTop: isSmallDevice ? 48 : 68,
    width: isSmallDevice ? 150 : 170,
    height: isSmallDevice ? 150 : 170,
    borderRadius: 999,
    backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  trophyMini: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.light.mainColorGreen,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: Platform.OS === "android" ? 8 : 0,
  },
});