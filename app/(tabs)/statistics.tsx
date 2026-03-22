import {
  Award,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";
import apiClient from "@/src/services/api/apiClient";
import { getAuthConfig } from "@/src/services/api/authHeaders";

const { width } = Dimensions.get("window");

type WeeklyBar = {
  label: string;
  value: number;
};

type StatisticsResponse = {
  totalXp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  badgeCount: number;
  totalCompletedDays: number;
  bestStreak: number;
  completionRate: number;
  weeklyBars: WeeklyBar[];
  streakHistory: number[];
};

export default function StatisticsScreen() {
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatistics = async () => {
    try {
      const authConfig = await getAuthConfig();
      const response = await apiClient.get("/v1/gamification/statistics", authConfig);
      setStats(response.data);
    } catch (error: any) {
      console.log("Statistics fetch error:", error?.response?.data || error);

      const message = error?.response?.data?.message;
      Alert.alert(
        "Hata",
        Array.isArray(message)
          ? message.join("\n")
          : message || "Istatistikler yuklenemedi.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatistics();
  };

  const progressPercent = useMemo(() => {
  if (!stats || stats.nextLevelXp <= 0) return "0%";

  const percent = Math.min(
    (stats.currentLevelXp / stats.nextLevelXp) * 100,
    100,
  );

  return `${percent.toFixed(0)}%`;
}, [stats]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: IsDark ? Colors.dark.background : "#F7F8FA",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.light.mainColorGreen} />
        <Text style={{ marginTop: 12, color: "#64748B", fontWeight: "600" }}>
          Istatistikler yukleniyor...
        </Text>
      </SafeAreaView>
    );
  }

  if (!stats) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: IsDark ? Colors.dark.background : "#F7F8FA",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: "#64748B", fontWeight: "600", textAlign: "center" }}>
          Istatistik verisi bulunamadi.
        </Text>
      </SafeAreaView>
    );
  }

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.pageTitle}>Ilerleme</Text>
        <Text style={styles.pageSubtitle}>
          Aliskanlik performansini burada takip et
        </Text>

        <View style={styles.topGrid}>
          <StatCard
            icon={<Target size={20} color="#3B82F6" />}
            label="Tamamlama"
            value={`%${stats.completionRate}`}
            accent="#DBEAFE"
          />
          <StatCard
            icon={<Flame size={20} color="#FF9600" fill="#FF9600" />}
            label="En iyi seri"
            value={`${stats.bestStreak} gun`}
            accent="#FFEDD5"
          />
          <StatCard
            icon={<Trophy size={20} color="#FACC15" />}
            label="Toplam XP"
            value={`${stats.totalXp}`}
            accent="#FEF9C3"
          />
          <StatCard
            icon={<Award size={20} color="#EF4444" />}
            label="Tam gun"
            value={`${stats.totalCompletedDays}`}
            accent="#FEE2E2"
          />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Haftalik Performans</Text>
            <TrendingUp size={18} color="#64748B" />
          </View>

          <View style={styles.barsRow}>
            {stats.weeklyBars.map((item) => (
              <View key={item.label} style={styles.barItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${Math.max(item.value, 4)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Streak Gecmisi</Text>

          <View style={styles.lineArea}>
            {stats.streakHistory.map((value, index) => (
              <View key={`${value}-${index}`} style={styles.linePointWrap}>
                <View
                  style={[
                    styles.lineBar,
                    { height: Math.max(value * 10, 10) },
                    index === stats.streakHistory.length - 1 && styles.lineBarActive,
                  ]}
                />
                <Text style={styles.lineValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.sectionTitle}>Seviye Ilerlemesi</Text>
              <Text style={styles.levelSubText}>
                Level {stats.level} - Consistency Builder
              </Text>
            </View>

            <View style={styles.levelBadge}>
              <Zap size={16} color="#fff" />
              <Text style={styles.levelBadgeText}>{stats.totalXp} XP</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: progressPercent }]} />
          </View>

          <View style={styles.progressMeta}>
            <Text style={styles.progressMetaText}>
              {stats.currentLevelXp} / {stats.nextLevelXp} XP
            </Text>
            <Text style={styles.progressMetaText}>
              Sonraki level: {Math.max(stats.nextLevelXp - stats.currentLevelXp, 0)} XP
            </Text>
          </View>
        </View>

        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Devam et 🔥</Text>
          <Text style={styles.highlightText}>
            Son 7 gundeki tamamlama oranin %{stats.completionRate}. Boyle devam.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: accent }]}>
        {icon}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const cardWidth = (width - 52) / 2;

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

  topGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 22,
  },
  statCard: {
    width: cardWidth,
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
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#334155",
  },

  barsRow: {
    height: 180,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  barItem: {
    flex: 1,
    alignItems: "center",
  },
  barTrack: {
    width: 24,
    height: 140,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: Colors.light.mainColorGreen,
    borderRadius: 999,
  },
  barLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },

  lineArea: {
    marginTop: 16,
    height: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  linePointWrap: {
    alignItems: "center",
    flex: 1,
  },
  lineBar: {
    width: 18,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    marginBottom: 8,
  },
  lineBarActive: {
    backgroundColor: "#FF9600",
  },
  lineValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },

  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelSubText: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.mainColorGreen,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  levelBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  progressTrack: {
    width: "100%",
    height: 14,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    marginTop: 18,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.mainColorGreen,
    borderRadius: 999,
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  progressMetaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  highlightCard: {
    backgroundColor: "#ECFCCB",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D9F99D",
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#365314",
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4D7C0F",
    fontWeight: "600",
  },
});