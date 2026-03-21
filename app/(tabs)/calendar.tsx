import { router, useLocalSearchParams } from "expo-router";
import { habitsApi } from "@/src/services/api/endpoints/habits";
import { ArrowLeft, CalendarDays, Flame, Trophy } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuthConfig } from "@/src/services/api/authHeaders";
type CalendarLog = {
  id: string;
  habitId: string;
  userId: string;
  logDate: string;
  status: "DONE" | "MISSED" | "PARTIAL";
  progress: number;
  earnedXp: number;
  createdAt: string;
};

type CalendarResponse = {
  month: string;
  logs: CalendarLog[];
};

type HabitStats = {
  currentStreak: number;
  longestStreak: number;
  completedThisMonth: number;
  doneToday: boolean;
  last7Days: Array<{
    date: string;
    done: boolean;
  }>;
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
};

const monthNames = [
  "Ocak",
  "Subat",
  "Mart",
  "Nisan",
  "Mayis",
  "Haziran",
  "Temmuz",
  "Agustos",
  "Eylul",
  "Ekim",
  "Kasim",
  "Aralik",
];

function getMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return `${monthNames[month - 1]} ${year}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOffset(year: number, month: number) {
  const jsDay = new Date(year, month - 1, 1).getDay(); // 0=Sunday
  return jsDay === 0 ? 6 : jsDay - 1; // Monday-first
}

function toLocalDateKey(dateString: string) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CalendarScreen() {
  const { habitId } = useLocalSearchParams<{ habitId?: string }>();

  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(
    habitId ? String(habitId) : null,
  );

  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);
  const [habit, setHabit] = useState<HabitResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const currentMonth = useMemo(() => getMonthKey(new Date()), []);

  // 1) Once habit listesini cek
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true);

        const authConfig = await getAuthConfig();
        const allHabits = await habitsApi.getAll(authConfig);

        setHabits(allHabits ?? []);

        let initialHabitId = habitId ? String(habitId) : null;

        if (!initialHabitId && allHabits?.length > 0) {
          initialHabitId = allHabits[0].id;
        }

        setSelectedHabitId(initialHabitId);
      } catch (err) {
        console.log("Habits fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [habitId]);

  // 2) Seçilen habit degisince o habitin detayini ve takvimini cek
  useEffect(() => {
    const fetchSelectedHabitData = async () => {
      if (!selectedHabitId) {
        setHabit(null);
        setCalendarData({ month: currentMonth, logs: [] });
        return;
      }

      try {
        setLoading(true);

        const authConfig = await getAuthConfig();

        const [habitRes, calendarRes] = await Promise.all([
          habitsApi.getOne(selectedHabitId, authConfig),
          habitsApi.getCalendar(selectedHabitId, currentMonth, authConfig),
        ]);

        setHabit(habitRes);
        setCalendarData(calendarRes);
      } catch (err) {
        console.log("Selected habit calendar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedHabitData();
  }, [selectedHabitId, currentMonth]);

  const monthKey = calendarData?.month ?? currentMonth;
  const [year, month] = monthKey.split("-").map(Number);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOffset(year, month);

  const todayDate = new Date();
  const isCurrentDisplayedMonth =
    todayDate.getFullYear() === year && todayDate.getMonth() + 1 === month;
  const today = isCurrentDisplayedMonth ? String(todayDate.getDate()) : "";

  const completedSet = useMemo(() => {
    const set = new Set<string>();

    for (const log of calendarData?.logs ?? []) {
      if (log.status === "DONE") {
        set.add(toLocalDateKey(log.logDate));
      }
    }

    return set;
  }, [calendarData]);

  const days = useMemo(() => {
    const arr: string[] = [];

    for (let i = 0; i < firstDayOffset; i++) {
      arr.push("");
    }

    for (let day = 1; day <= daysInMonth; day++) {
      arr.push(String(day));
    }

    return arr;
  }, [firstDayOffset, daysInMonth]);

  const completedCount =
    habit?.stats?.completedThisMonth ??
    calendarData?.logs?.filter((log) => log.status === "DONE").length ??
    0;

  const totalEarnedXp =
    calendarData?.logs?.reduce((sum, log) => sum + (log.earnedXp ?? 0), 0) ?? 0;

  const monthlyXpTarget = Math.max(daysInMonth * 20, 20);
  const xpProgressWidth = `${Math.min(
    100,
    (totalEarnedXp / monthlyXpTarget) * 100,
  )}%`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.title}>Streak Takvimi</Text>
        <Text style={styles.subtitle}>
          {habit?.title
            ? `"${habit.title}" aliskanliginin bu ayki takvimi`
            : "Bu ayki devam zincirini incele"}
        </Text>

        <View style={styles.statsRow}>
          <MiniBadge
            icon={<Flame size={18} color="#FF9600" fill="#FF9600" />}
            value={String(habit?.stats?.currentStreak ?? 0)}
          />
          <MiniBadge
            icon={<Trophy size={18} color="#FACC15" />}
            value={String(totalEarnedXp)}
          />
          <MiniBadge
            icon={<CalendarDays size={18} color="#3B82F6" />}
            value={`${completedCount}/${daysInMonth}`}
          />
        </View>

        {habits.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.habitSelectorRow}
          >
            {habits.map((item) => {
              const active = item.id === selectedHabitId;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.habitChip, active && styles.habitChipActive]}
                  onPress={() => setSelectedHabitId(item.id)}
                >
                  <Text style={styles.habitChipEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.habitChipText,
                      active && styles.habitChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.calendarCard}>
          <Text style={styles.monthTitle}>{getMonthLabel(monthKey)}</Text>

          <View style={styles.weekHeader}>
            {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d, index) => (
              <Text key={`${d}-${index}`} style={styles.weekHeaderText}>
                {d}
              </Text>
            ))}
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#58cc02" />
            </View>
          ) : (
            <View style={styles.grid}>
              {days.map((day, index) => {
                const paddedDay = day ? String(day).padStart(2, "0") : "";
                const fullDateKey = day ? `${monthKey}-${paddedDay}` : "";
                const isCompleted = day ? completedSet.has(fullDateKey) : false;
                const isToday = today === day;

                return (
                  <View
                    key={`${day || "empty"}-${index}`}
                    style={[
                      styles.dayCell,
                      isCompleted && styles.dayCompleted,
                      isToday && styles.dayToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isCompleted && styles.dayTextCompleted,
                        isToday && styles.dayTextToday,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.xpCard}>
          <Text style={styles.xpTitle}>Aylik XP ilerlemesi</Text>
          <Text style={styles.xpValue}>
            {totalEarnedXp} / {monthlyXpTarget} XP
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: xpProgressWidth }]} />
          </View>

          <Text style={styles.xpSub}>
            Bu aliskanligi tamamladikca XP kazanirsin
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniBadge({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <View style={styles.badge}>
      {icon}
      <Text style={styles.badgeText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F8FA" },
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  title: { fontSize: 30, fontWeight: "900", color: "#0F172A" },
  subtitle: { marginTop: 6, fontSize: 15, color: "#64748B", marginBottom: 18 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  badge: {
    minWidth: 92,
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
  },
  badgeText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#334155",
  },
  habitSelectorRow: {
    paddingBottom: 14,
    gap: 10,
  },
  habitChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    marginRight: 10,
    maxWidth: 180,
  },
  habitChipActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#58cc02",
  },
  habitChipEmoji: {
    fontSize: 16,
  },
  habitChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    flexShrink: 1,
  },
  habitChipTextActive: {
    color: "#166534",
  },
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 16,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  dayCell: {
    width: "13.2%",
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  weekHeaderText: {
    width: "13.2%",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
  },
  dayCompleted: {
    backgroundColor: "#58cc02",
  },
  dayToday: {
    borderWidth: 2,
    borderColor: "#FF9600",
    backgroundColor: "#FFF7ED",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  dayTextCompleted: {
    color: "#fff",
  },
  dayTextToday: {
    color: "#FF9600",
  },
  xpCard: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  xpTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#334155",
  },
  xpValue: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },
  progressTrack: {
    marginTop: 16,
    width: "100%",
    height: 14,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#58cc02",
    borderRadius: 999,
  },
  xpSub: {
    marginTop: 10,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});