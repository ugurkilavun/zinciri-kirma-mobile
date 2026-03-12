import {
    Award,
    Flame,
    Target,
    TrendingUp,
    Trophy,
    Zap,
} from "lucide-react-native";
import React from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IsDark } from "@/constants/tempThemeSelector";
import { Colors } from "@/constants/themes";

const { width } = Dimensions.get("window");

const weeklyBars = [
  { label: "Pzt", value: 80 },
  { label: "Sal", value: 65 },
  { label: "Car", value: 100 },
  { label: "Per", value: 70 },
  { label: "Cum", value: 90 },
  { label: "Cmt", value: 45 },
  { label: "Paz", value: 60 },
];

const streakHistory = [4, 6, 5, 8, 10, 12, 14];

export default function StatisticsScreen() {
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
        <Text style={styles.pageTitle}>Ilerleme</Text>
        <Text style={styles.pageSubtitle}>
          Aliskanlik performansini burada takip et
        </Text>

        {/* Top Stats */}
        <View style={styles.topGrid}>
          <StatCard
            icon={<Target size={20} color="#3B82F6" />}
            label="Tamamlama"
            value="%82"
            accent="#DBEAFE"
          />
          <StatCard
            icon={<Flame size={20} color="#FF9600" fill="#FF9600" />}
            label="En iyi seri"
            value="21 gun"
            accent="#FFEDD5"
          />
          <StatCard
            icon={<Trophy size={20} color="#FACC15" />}
            label="Toplam XP"
            value="1250"
            accent="#FEF9C3"
          />
          <StatCard
            icon={<Award size={20} color="#EF4444" />}
            label="Tam gun"
            value="47"
            accent="#FEE2E2"
          />
        </View>

        {/* Weekly Performance */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Haftalik Performans</Text>
            <TrendingUp size={18} color="#64748B" />
          </View>

          <View style={styles.barsRow}>
            {weeklyBars.map((item) => (
              <View key={item.label} style={styles.barItem}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${item.value}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Streak History */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Streak Gecmisi</Text>

          <View style={styles.lineArea}>
            {streakHistory.map((value, index) => (
              <View key={`${value}-${index}`} style={styles.linePointWrap}>
                <View
                  style={[
                    styles.lineBar,
                    { height: value * 10 },
                    index === streakHistory.length - 1 && styles.lineBarActive,
                  ]}
                />
                <Text style={styles.lineValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.sectionCard}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.sectionTitle}>Seviye Ilerlemesi</Text>
              <Text style={styles.levelSubText}>Level 4 - Consistency Builder</Text>
            </View>
            <View style={styles.levelBadge}>
              <Zap size={16} color="#fff" />
              <Text style={styles.levelBadgeText}>1250 XP</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.progressMeta}>
            <Text style={styles.progressMetaText}>1250 / 1500 XP</Text>
            <Text style={styles.progressMetaText}>Sonraki level: 250 XP</Text>
          </View>
        </View>

        {/* Best Performance */}
        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>En iyi haftan bu hafta 🔥</Text>
          <Text style={styles.highlightText}>
            Bu hafta gorevlerinin cogunu tamamladin. Boyle devam et!
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
      <View style={[styles.statIconBox, { backgroundColor: accent }]}>{icon}</View>
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
    width: "83%",
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