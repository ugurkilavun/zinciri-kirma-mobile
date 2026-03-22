import { router } from "expo-router";
import {
  CalendarDays,
  Check,
  Flame,
  Heart,
  Plus,
  Trophy,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthConfig } from "@/src/services/api/authHeaders";
import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";
import { useHabits } from "@/src/context/HabitContext";
import apiClient from "@/src/services/api/apiClient";

const { width } = Dimensions.get("window");

type ProfileResponse = {
  userId: string;
  name: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  badgeCount: number;
  recoveryRemaining: number;
};

type HabitDaySummary = {
  date: string;
  done: boolean;
};

type HabitLog = {
  id: string;
  habitId: string;
  userId: string;
  logDate: string;
  status: "DONE" | "MISSED" | "PARTIAL";
  progress: number;
  earnedXp: number;
  createdAt: string;
};

type HabitStats = {
  currentStreak: number;
  longestStreak: number;
  completedThisMonth: number;
  doneToday: boolean;
  last7Days: HabitDaySummary[];
};

type HabitResponse = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  frequency: "DAILY" | "WEEKLY" | "CUSTOM";
  reminderEnabled: boolean;
  targetValue: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: HabitStats;
  logs?: HabitLog[];
};

function todayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function isSameDay(a: string | Date, b: string | Date) {
  return toLocalDateKey(String(a)) === toLocalDateKey(String(b));
}


function toLocalDateKey(dateString: string) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayLetter(dateString: string) {
  const map = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];
  return map[new Date(dateString).getDay()];
}


function getEndOfWeek(date = new Date()) {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getStartOfMonth(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfMonth(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}
function getCurrentPeriodKey(
  frequency: "DAILY" | "WEEKLY" | "CUSTOM",
  createdAt?: string,
  now = new Date(),
) {
  const current = new Date(now);
  current.setHours(0, 0, 0, 0);

  if (frequency === "DAILY") {
    return toLocalDateKey(current);
  }

  if (frequency === "WEEKLY") {
    return toLocalDateKey(getStartOfWeek(current));
  }

  if (frequency === "CUSTOM") {
    if (!createdAt) return toLocalDateKey(current);

    const anchor = new Date(createdAt);
    anchor.setHours(0, 0, 0, 0);

    const diffMs = current.getTime() - anchor.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const cycleLength = 30;
    const cycleIndex = Math.floor(Math.max(diffDays, 0) / cycleLength);

    const periodStart = new Date(anchor);
    periodStart.setDate(anchor.getDate() + cycleIndex * cycleLength);
    periodStart.setHours(0, 0, 0, 0);

    return toLocalDateKey(periodStart);
  }

  return toLocalDateKey(current);
}
function countDoneLogsInRange(
  logs: HabitLog[] = [],
  start: Date,
  end: Date,
) {
  return logs.filter((log) => {
    if (log.status !== "DONE") return false;
    const d = new Date(log.logDate);
    return d >= start && d <= end;
  }).length;
}

export default function HomeScreen() {
  const { habits: localHabits, toggleHabit } = useHabits();

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [backendHabits, setBackendHabits] = useState<HabitResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);

      const authConfig = await getAuthConfig();

      const [profileRes, habitsRes] = await Promise.all([
        apiClient.get("/v1/gamification/profile", authConfig),
        apiClient.get("/v1/habits", authConfig),
      ]);

      setProfile(profileRes.data);
      setBackendHabits(habitsRes.data ?? []);
    } catch (error) {
      console.log("Home data fetch fallback to local context:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, [fetchHomeData]),
  );

  const hasBackendData = backendHabits.length > 0;

  const displayHabits = useMemo(() => {
    if (hasBackendData) {
      return backendHabits.map((habit) => {
        let progress = 0;
        let completed = false;
        let doneToday = false;

        const currentPeriodKey = getCurrentPeriodKey(
          habit.frequency,
          habit.createdAt,
        );
        const currentPeriodLog = (habit.logs ?? []).find(
          (log) => toLocalDateKey(log.logDate) === currentPeriodKey,
        );

        if (habit.frequency === "DAILY") {
          progress = currentPeriodLog?.progress ?? 0;
          completed =
            progress >= habit.targetValue || habit.stats?.doneToday === true;
          doneToday = completed;
        }

        if (habit.frequency === "WEEKLY") {
          progress = currentPeriodLog?.progress ?? 0;
          completed = progress >= habit.targetValue;

          const todayLog = (habit.logs ?? []).find(
            (log) => toLocalDateKey(log.createdAt) === toLocalDateKey(new Date()),
          );
          doneToday = !!todayLog;
        }

        if (habit.frequency === "CUSTOM") {
          progress = currentPeriodLog?.progress ?? 0;
          completed = progress >= habit.targetValue;

          const todayLog = (habit.logs ?? []).find(
            (log) => toLocalDateKey(log.createdAt) === toLocalDateKey(new Date()),
          );
          doneToday = !!todayLog;
        }

        return {
          id: habit.id,
          title: habit.title,
          emoji: habit.emoji,
          color: habit.color,
          completed,
          progress,
          goal: habit.targetValue,
          streak: habit.stats?.currentStreak ?? 0,
          frequency: habit.frequency,
          doneToday,
          backendRaw: habit,
        };
      });
    }

    return localHabits.map((habit) => ({
      id: habit.id,
      title: habit.title,
      emoji: habit.emoji,
      color: habit.color,
      completed: habit.completed,
      progress: habit.progress,
      goal: habit.goal,
      streak: habit.streak,
      frequency: "DAILY" as const,
      doneToday: habit.completed,
      backendRaw: null,
    }));
  }, [hasBackendData, backendHabits, localHabits]);

  const stats = {
    streak:
      profile?.currentStreak ??
      (localHabits.length ? Math.max(...localHabits.map((h) => h.streak), 0) : 0),
    xp:
      profile?.totalXp ??
      localHabits.filter((h) => h.completed).length * 50 + 1200,
    hearts: profile?.recoveryRemaining ?? 5,
  };
  
  const weekData = useMemo(() => {
  const start = getStartOfWeek(new Date());
  const today = todayKey();

  const days = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(start);
    d.setDate(start.getDate() + index);
    const key = toLocalDateKey(d);

    return {
      date: key,
      day: getDayLetter(key),
      isToday: key === today,
    };
  });

  if (!hasBackendData) {
    const todayCompleted =
      displayHabits.length > 0 && displayHabits.every((h) => h.doneToday);

    return days.map((day) => ({
      day: day.day,
      isToday: day.isToday,
      completed: day.isToday ? todayCompleted : false,
    }));
  }

  return days.map((day) => {
    const completedHabitsCount = backendHabits.filter((habit) => {
      const logs = habit.logs ?? [];

      if (habit.frequency === "DAILY") {
        return logs.some(
          (log) =>
            toLocalDateKey(log.logDate) === day.date &&
            log.status === "DONE",
        );
      }

      if (habit.frequency === "WEEKLY" || habit.frequency === "CUSTOM") {
        return logs.some(
          (log) =>
            toLocalDateKey(log.createdAt) === day.date &&
            (log.status === "DONE" || log.status === "PARTIAL"),
        );
      }

      return false;
    }).length;

    const completed =
      backendHabits.length > 0 &&
      completedHabitsCount === backendHabits.length;

    return {
      day: day.day,
      isToday: day.isToday,
      completed,
    };
  });
}, [backendHabits, displayHabits, hasBackendData]);

  const totalCompleted = useMemo(
    () => displayHabits.filter((h) => h.completed).length,
    [displayHabits],
  );

  const handleHabitPress = async (habit: (typeof displayHabits)[number]) => {
    console.log("Pressed habit:", {
      id: habit.id,
      title: habit.title,
      frequency: habit.frequency,
      completed: habit.completed,
      progress: habit.progress,
      goal: habit.goal,
      hasBackendData,
    });

    if (!hasBackendData || !habit.backendRaw) {
      console.log("Falling back to local toggle");
      toggleHabit(habit.id);
      return;
    }

    try {
      if (habit.completed) {
        console.log("Habit already completed, returning");
        return;
      }

      const authConfig = await getAuthConfig();

      console.log("Sending check-in request...");
      const res = await apiClient.post(
        `/v1/habits/${habit.id}/check-in`,
        {
          date: todayKey(),
          status: "PARTIAL",
          progress: 1,
        },
        authConfig,
      );

      console.log("Check-in response:", res.data);

      await fetchHomeData();
      console.log("Home data refreshed");
    } catch (error: any) {
      console.log(
        "Habit check-in error:",
        error?.response?.status,
        error?.response?.data,
        error?.message,
      );
    }
  };

  const handleCalendarPress = () => {
    const firstHabitId = backendHabits[0]?.id;
    if (firstHabitId) {
      router.push({
        pathname: "/(tabs)/calendar",
        params: { habitId: firstHabitId },
      });
      return;
    }

    router.push("/(tabs)/calendar");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: IsDark ? Colors.dark.background : "#F7F8FA",
      }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <StatBadge
            icon={
              <Flame
                size={18}
                color="#FF9600"
                fill="#FF9600"
                strokeWidth={2.5}
              />
            }
            value={stats.streak}
          />
          <StatBadge
            icon={<Trophy size={18} color="#FFC800" strokeWidth={2.5} />}
            value={stats.xp}
          />
          <StatBadge
            icon={
              <Heart
                size={18}
                color="#FF4B4B"
                fill="#FF4B4B"
                strokeWidth={2.5}
              />
            }
            value={stats.hearts}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.streakCard}
          onPress={handleCalendarPress}
        >
          <View style={styles.streakCardTextArea}>
            <Text style={styles.streakLabel}>Mevcut Streak</Text>
            <Text style={styles.streakValue}>{stats.streak}</Text>
            <Text style={styles.streakSub}>gunluk seri! 🔥</Text>

            <View style={styles.calendarHintRow}>
              <CalendarDays size={15} color="#EAFCD7" />
              <Text style={styles.calendarHintText}>
                Takvimi gormek icin tikla
              </Text>
            </View>
          </View>

          <View style={styles.flameWrapper}>
            <Flame size={68} color="#FF9600" fill="#FF9600" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bu Hafta</Text>

          <View style={styles.weekRow}>
            {weekData.map((item, index) => (
              <View key={`${item.day}-${index}`} style={styles.weekItem}>
                <View
                  style={[
                    styles.weekCircle,
                    item.completed
                      ? styles.weekCircleCompleted
                      : item.isToday
                        ? styles.weekCircleToday
                        : styles.weekCirclePending,
                  ]}
                >
                  {item.completed ? (
                    <Check size={20} color="#fff" strokeWidth={3} />
                  ) : (
                    <Text
                      style={[
                        styles.weekCircleText,
                        item.isToday && {
                          color: Colors.light.mainColorGreen,
                        },
                      ]}
                    >
                      {item.day}
                    </Text>
                  )}
                </View>
                <Text style={styles.weekLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitleNoMargin}>
                Bugunku Aliskanliklar
              </Text>
              <Text style={styles.completedInfo}>
                {totalCompleted} / {displayHabits.length} tamamlandi
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addHabitBtn}
              onPress={() => router.push("/(tabs)/create-habit")}
            >
              <Plus size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.habitsList}>
            {displayHabits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                activeOpacity={0.9}
                style={[
                  styles.habitCard,
                  habit.completed && styles.habitCardCompleted,
                ]}
                onPress={() => handleHabitPress(habit)}
              >
                <View
                  style={[
                    styles.habitEmojiBox,
                    { backgroundColor: habit.color },
                  ]}
                >
                  <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                </View>

                <View style={styles.habitInfo}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>

                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${habit.goal > 0 ? Math.min(100, (habit.progress / habit.goal) * 100) : 0}%`,
                            backgroundColor: habit.completed
                              ? Colors.light.mainColorGreen
                              : "#D1D5DB",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {habit.progress}/{habit.goal}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {!loading && displayHabits.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>Henuz aliskanlik yok</Text>
                <Text style={styles.emptyText}>
                  Ilk aliskanligini ekleyerek basla.
                </Text>
                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={() => router.push("/(tabs)/create-habit")}
                >
                  <Plus size={18} color="#fff" />
                  <Text style={styles.emptyAddBtnText}>Aliskanlik Ekle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBadge({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: number;
}) {
  return (
    <View style={styles.statBadge}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statBadge: {
    minWidth: 86,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#334155",
  },

  streakCard: {
    width: "100%",
    backgroundColor: Colors.light.mainColorGreen,
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 22,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#58cc02",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  streakCardTextArea: {
    flex: 1,
    paddingRight: 12,
  },
  streakLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EAFCD7",
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 62,
    lineHeight: 66,
    fontWeight: "900",
    color: "#fff",
  },
  streakSub: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },
  calendarHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },
  calendarHintText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EAFCD7",
  },
  flameWrapper: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 12,
  },
  sectionTitleNoMargin: {
    fontSize: 18,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 4,
  },
  completedInfo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  weekItem: {
    alignItems: "center",
    flex: 1,
  },
  weekCircle: {
    width: width < 380 ? 42 : 46,
    height: width < 380 ? 42 : 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  weekCircleCompleted: {
    backgroundColor: Colors.light.mainColorGreen,
  },
  weekCircleToday: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.light.mainColorGreen,
  },
  weekCirclePending: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  weekCircleText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#94A3B8",
  },
  weekLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },

  habitsList: {
    gap: 14,
  },
  habitCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  habitCardCompleted: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  habitEmojiBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  habitEmoji: {
    fontSize: 26,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    minWidth: 38,
    textAlign: "right",
  },

  addHabitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.mainColorGreen,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.light.mainColorGreen,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  emptyAddBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});