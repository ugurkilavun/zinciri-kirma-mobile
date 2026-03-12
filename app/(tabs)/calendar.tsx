import { router } from "expo-router";

import { ArrowLeft, CalendarDays, Flame, Trophy } from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const days = [
  "", "", "", "", "1", "2", "3",
  "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17",
  "18", "19", "20", "21", "22", "23", "24",
  "25", "26", "27", "28", "29", "30", "31",
];

const completedDays = ["3", "4", "5", "6", "7", "8", "10", "12", "14", "18", "21"];
const today = "21";

export default function CalendarScreen() {
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
    <Text style={styles.subtitle}>Bu ayki devam zincirini incele</Text>

    <View style={styles.statsRow}>
      <MiniBadge icon={<Flame size={18} color="#FF9600" fill="#FF9600" />} value="14" />
      <MiniBadge icon={<Trophy size={18} color="#FACC15" />} value="1250" />
      <MiniBadge icon={<CalendarDays size={18} color="#3B82F6" />} value="21/31" />
    </View>

    <View style={styles.calendarCard}>
      <Text style={styles.monthTitle}>Mart 2026</Text>

      <View style={styles.weekHeader}>
        {["P", "S", "C", "P", "C", "C", "P"].map((d, index) => (
          <Text key={`${d}-${index}`} style={styles.weekHeaderText}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => {
          const isCompleted = completedDays.includes(day);
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
    </View>

    <View style={styles.xpCard}>
      <Text style={styles.xpTitle}>Gunluk XP ilerlemesi</Text>
      <Text style={styles.xpValue}>10 / 20 XP</Text>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      <Text style={styles.xpSub}>Bugunku gorevleri tamamlayarak XP kazan</Text>
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
  weekHeaderText: {
    width: 38,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
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
    width: "50%",
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
});