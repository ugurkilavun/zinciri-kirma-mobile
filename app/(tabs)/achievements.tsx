import {
    Award,
    CalendarCheck,
    Flame,
    Lock,
    MoonStar,
    Sunrise,
    Trophy,
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
const cardWidth = (width - 52) / 2;

type BadgeItem = {
  id: string;
  title: string;
  subtitle: string;
  unlocked: boolean;
  accent: string;
  bg: string;
  iconType:
    | "flame"
    | "award"
    | "sunrise"
    | "moon"
    | "calendar"
    | "trophy";
};

const badges: BadgeItem[] = [
  {
    id: "1",
    title: "3 Gun Seri",
    subtitle: "Ilk mini seri",
    unlocked: true,
    accent: "#FF9600",
    bg: "#FFF7ED",
    iconType: "flame",
  },
  {
    id: "2",
    title: "7 Gun Seri",
    subtitle: "Bir haftalik tutarlilik",
    unlocked: true,
    accent: "#FACC15",
    bg: "#FEFCE8",
    iconType: "award",
  },
  {
    id: "3",
    title: "30 Gun Seri",
    subtitle: "Gercek disiplin",
    unlocked: false,
    accent: "#CBD5E1",
    bg: "#F8FAFC",
    iconType: "trophy",
  },
  {
    id: "4",
    title: "100 Gun Seri",
    subtitle: "Ust seviye istikrar",
    unlocked: false,
    accent: "#CBD5E1",
    bg: "#F8FAFC",
    iconType: "trophy",
  },
  {
    id: "5",
    title: "Perfect Week",
    subtitle: "Tum hafta tamamlama",
    unlocked: true,
    accent: "#22C55E",
    bg: "#F0FDF4",
    iconType: "calendar",
  },
  {
    id: "6",
    title: "Early Bird",
    subtitle: "Sabah hedef tamamlama",
    unlocked: false,
    accent: "#CBD5E1",
    bg: "#F8FAFC",
    iconType: "sunrise",
  },
  {
    id: "7",
    title: "Night Owl",
    subtitle: "Gece rutini ustasi",
    unlocked: false,
    accent: "#CBD5E1",
    bg: "#F8FAFC",
    iconType: "moon",
  },
  {
    id: "8",
    title: "Top Performer",
    subtitle: "Yuksek XP haftasi",
    unlocked: true,
    accent: "#3B82F6",
    bg: "#EFF6FF",
    iconType: "award",
  },
];

export default function AchievementsScreen() {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

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
        <Text style={styles.pageTitle}>Rozetler</Text>
        <Text style={styles.pageSubtitle}>
          Kazandigin basarilari burada gorebilirsin
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>Acilan Rozetler</Text>
            <Text style={styles.summaryValue}>
              {unlockedCount} / {badges.length}
            </Text>
            <Text style={styles.summarySub}>Yeni hedeflerle daha fazlasini ac</Text>
          </View>

          <View style={styles.summaryIconWrap}>
            <Trophy size={44} color="#fff" />
          </View>
        </View>

        <View style={styles.grid}>
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BadgeCard({ badge }: { badge: BadgeItem }) {
  const icon = getBadgeIcon(badge.iconType, badge.unlocked ? badge.accent : "#94A3B8");

  return (
    <View
      style={[
        styles.badgeCard,
        {
          backgroundColor: badge.unlocked ? badge.bg : "#FFFFFF",
          opacity: badge.unlocked ? 1 : 0.82,
        },
      ]}
    >
      <View
        style={[
          styles.badgeIconBox,
          {
            backgroundColor: badge.unlocked ? badge.accent : "#E2E8F0",
          },
        ]}
      >
        {icon}
      </View>

      <Text style={styles.badgeTitle}>{badge.title}</Text>
      <Text style={styles.badgeSubtitle}>{badge.subtitle}</Text>

      {!badge.unlocked && (
        <View style={styles.lockRow}>
          <Lock size={14} color="#94A3B8" />
          <Text style={styles.lockText}>Kilitli</Text>
        </View>
      )}
    </View>
  );
}

function getBadgeIcon(type: BadgeItem["iconType"], color: string) {
  switch (type) {
    case "flame":
      return <Flame size={28} color="#fff" fill="#fff" />;
    case "award":
      return <Award size={28} color="#fff" />;
    case "sunrise":
      return <Sunrise size={28} color="#fff" />;
    case "moon":
      return <MoonStar size={28} color="#fff" />;
    case "calendar":
      return <CalendarCheck size={28} color="#fff" />;
    case "trophy":
      return <Trophy size={28} color="#fff" />;
    default:
      return <Award size={28} color="#fff" />;
  }
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

  summaryCard: {
    backgroundColor: Colors.light.mainColorGreen,
    borderRadius: 26,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLeft: {
    flex: 1,
    paddingRight: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EAFCD7",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
  },
  summarySub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#EAFCD7",
  },
  summaryIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  badgeCard: {
    width: cardWidth,
    minHeight: 170,
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
  badgeIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  badgeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  badgeSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    fontWeight: "600",
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  lockText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
  },
});