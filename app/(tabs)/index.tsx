import { router } from "expo-router";
import {
  CalendarDays,
  Check,
  Flame,
  Heart,
  Plus,
  Trophy,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";
import { useHabits } from "@/src/context/HabitContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { habits, toggleHabit } = useHabits();

  const stats = {
    streak: habits.length ? Math.max(...habits.map((h) => h.streak), 0) : 0,
    xp: habits.filter((h) => h.completed).length * 50 + 1200,
    hearts: 5,
  };

  const weekData = [
    { day: "P", completed: true },
    { day: "S", completed: true },
    { day: "C", completed: true },
    { day: "P", completed: true },
    { day: "C", completed: true, isToday: true },
    { day: "C", completed: false },
    { day: "P", completed: false },
  ];

  const totalCompleted = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits],
  );

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
          onPress={() => router.push("/(tabs)/calendar")}
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
              <Text style={styles.sectionTitleNoMargin}>Bugunku Aliskanliklar</Text>
              <Text style={styles.completedInfo}>
                {totalCompleted} / {habits.length} tamamlandi
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
            {habits.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                activeOpacity={0.9}
                style={[
                  styles.habitCard,
                  habit.completed && styles.habitCardCompleted,
                ]}
                onPress={() => toggleHabit(habit.id)}
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
                            width: `${Math.min(
                              100,
                              (habit.progress / habit.goal) * 100,
                            )}%`,
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

            {habits.length === 0 && (
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