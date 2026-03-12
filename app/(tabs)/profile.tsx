import {
    CalendarCheck,
    ChevronRight,
    Flame,
    LogOut,
    Settings,
    Trophy,
    User,
    Zap,
} from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";

export default function ProfileScreen() {
  const user = {
    name: "Ozan",
    level: 4,
    totalXp: 1250,
    longestStreak: 21,
    completedDays: 47,
    totalHabits: 6,
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: IsDark ? Colors.dark.background : "#F7F8FA",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.pageTitle}>Profil</Text>
        <Text style={styles.pageSubtitle}>
          Hesabin ve ilerleme bilgilerin
        </Text>

        {/* Profile Hero */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <User size={42} color="#fff" />
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userSub}>Level {user.level} - Consistency Builder</Text>

          <View style={styles.xpBadge}>
            <Zap size={16} color="#fff" />
            <Text style={styles.xpBadgeText}>{user.totalXp} XP</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <MiniStat
            icon={<Flame size={20} color="#FF9600" fill="#FF9600" />}
            label="En uzun seri"
            value={`${user.longestStreak} gun`}
          />
          <MiniStat
            icon={<CalendarCheck size={20} color="#22C55E" />}
            label="Tamamlanan gun"
            value={`${user.completedDays}`}
          />
          <MiniStat
            icon={<Trophy size={20} color="#FACC15" />}
            label="Toplam XP"
            value={`${user.totalXp}`}
          />
          <MiniStat
            icon={<Zap size={20} color="#3B82F6" />}
            label="Toplam hedef"
            value={`${user.totalHabits}`}
          />
        </View>

        {/* Settings Menu */}
        <View style={styles.menuCard}>
          <MenuItem
            icon={<Settings size={20} color="#475569" />}
            label="Ayarlar"
          />
          <MenuItem
            icon={<Trophy size={20} color="#475569" />}
            label="Rozetlerim"
          />
          <MenuItem
            icon={<LogOut size={20} color="#EF4444" />}
            label="Cikis Yap"
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statIconWrap}>{icon}</View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconBox}>{icon}</View>
        <Text style={[styles.menuLabel, danger && { color: "#EF4444" }]}>
          {label}
        </Text>
      </View>
      <ChevronRight size={18} color={danger ? "#EF4444" : "#94A3B8"} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
  },
  pageSubtitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 20,
  },

  heroCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    alignItems: "center",
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 20,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: Colors.light.mainColorGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
  },
  userSub: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  xpBadge: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.mainColorGreen,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  xpBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 20,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  menuItem: {
    minHeight: 68,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },
});