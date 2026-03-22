import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Award,
  ChevronUp,
  Crown,
  Flame,
  SearchX,
  Shield,
  Trophy,
  Zap,
} from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";

import { leaderboardApi } from "@/src/services/api/endpoints/leaderboard";

type LeaderboardUser = {
  id: string;
  name: string;
  rank: number;
  xp: number;
  streak: number;
  level: number;
  badges: number;
  isMe?: boolean;
};

type LeaderboardResponse = {
  period: "weekly" | "monthly" | "all_time";
  periodKey: string;
  topUsers: LeaderboardUser[];
  listUsers: LeaderboardUser[];
  currentUser: LeaderboardUser | null;
  totalUsers: number;
};

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "all_time">("weekly");
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async (period = activeTab) => {
    try {
      setLoading(true);
      const response = await leaderboardApi.getLeaderboard(period);
      setData(response);
    } catch (error) {
      console.log("Leaderboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard(activeTab);
    }, [activeTab, fetchLeaderboard]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard(activeTab);
  };

  const topUsers = data?.topUsers ?? [];
  const listUsers = data?.listUsers ?? [];
  const currentUser = data?.currentUser ?? null;
  const isEmpty = topUsers.length === 0 && listUsers.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Liderlik Tablosu</Text>
        <Text style={styles.subtitle}>
          Diger kullanicilarla ilerlemeni karsilastir
        </Text>
      </View>

      <View style={styles.tabWrap}>
        {[
          { key: "weekly", label: "Haftalik" },
          { key: "monthly", label: "Aylik" },
          { key: "all_time", label: "Tum Zamanlar" },
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.key as "weekly" | "monthly" | "all_time")}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#58cc02" />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {isEmpty ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconWrap}>
                <SearchX size={72} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitle}>Henuz Kimse Yok</Text>
              <Text style={styles.emptyText}>
                Bu donemin ilk siralamasini sen belirle.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.motivationCard}>
                <View style={styles.motivationTop}>
                  <View style={styles.motivationLeft}>
                    <ChevronUp size={20} color="#3B82F6" />
                    <View>
                      <Text style={styles.motivationTitle}>
                        Bir ust siraya cikmak icin
                      </Text>
                      <Text style={styles.motivationSub}>
                        Biraz daha XP kazan
                      </Text>
                    </View>
                  </View>

                  <View style={styles.motivationXp}>
                    <Zap size={14} color="#FACC15" />
                    <Text style={styles.motivationXpText}>+30 XP</Text>
                  </View>
                </View>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: "75%" }]} />
                </View>
              </View>

              <View style={styles.podiumRow}>
                <PodiumCard user={topUsers[1]} place={2} />
                <PodiumCard user={topUsers[0]} place={1} isFirst />
                <PodiumCard user={topUsers[2]} place={3} />
              </View>

              <View style={styles.listWrap}>
                {listUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {!!currentUser && !loading && !isEmpty && (
        <View style={styles.stickyWrap}>
          <UserRow user={currentUser} isSticky />
        </View>
      )}
    </SafeAreaView>
  );
}
function getAvatarColor(name: string) {
  const colors = ["#DBEAFE", "#FCE7F3", "#DCFCE7", "#FEF3C7", "#EDE9FE"];
  const code = name.charCodeAt(0) || 0;
  return colors[code % colors.length];
}
function PodiumCard({
  user,
  place,
  isFirst,
}: {
  user?: LeaderboardUser;
  place: 1 | 2 | 3;
  isFirst?: boolean;
}) {
  if (!user) {
    return <View style={styles.podiumPlaceholder} />;
  }

  return (
    <View style={styles.podiumCard}>
      {isFirst && <Crown size={26} color="#FACC15" fill="#FACC15" />}
      <View style={[styles.avatarCircle, { backgroundColor: getAvatarColor(user.name) }]}>
        <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.podiumName} numberOfLines={1}>
        {user.name}
      </Text>
      <View style={styles.xpRow}>
        <Zap size={12} color="#FACC15" />
        <Text style={styles.xpText}>{user.xp}</Text>
      </View>
      <View style={[styles.placeBadge, isFirst && styles.placeBadgeFirst]}>
        <Text style={styles.placeBadgeText}>{place}</Text>
      </View>
    </View>
  );
}

function UserRow({
  user,
  isSticky = false,
}: {
  user: LeaderboardUser;
  isSticky?: boolean;
}) {
  return (
    <View style={[styles.userRow, isSticky && styles.userRowSticky]}>
      <Text style={[styles.rankText, user.isMe && styles.rankTextMe]}>
        {user.rank}
      </Text>

      <View style={[styles.avatarSmall, { backgroundColor: getAvatarColor(user.name) }]}>
        <Text style={styles.avatarSmallText}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.userName, user.isMe && styles.userNameMe]}>
          {user.name}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Zap size={12} color="#FACC15" />
            <Text style={styles.metaText}>{user.xp}</Text>
          </View>
          <View style={styles.metaItem}>
            <Flame size={12} color="#FF9600" fill="#FF9600" />
            <Text style={styles.metaText}>{user.streak}</Text>
          </View>
          <View style={styles.metaItem}>
            <Award size={12} color="#A855F7" />
            <Text style={styles.metaText}>{user.badges}</Text>
          </View>
        </View>
      </View>

      {isSticky && (
        <View style={styles.chevronBadge}>
          <ChevronUp size={16} color="#166534" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748B",
  },
  tabWrap: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 4,
    borderRadius: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#0F172A",
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  motivationCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 20,
  },
  motivationTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  motivationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  motivationTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  motivationSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },
  motivationXp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  motivationXpText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#3B82F6",
  },
  podiumRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  podiumCard: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 6,
  },
  podiumPlaceholder: {
    flex: 1,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#334155",
  },
  podiumName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    maxWidth: 90,
    textAlign: "center",
  },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },
  placeBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  placeBadgeFirst: {
    backgroundColor: "#FACC15",
  },
  placeBadgeText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  listWrap: {
    gap: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  userRowSticky: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  rankText: {
    width: 28,
    fontSize: 18,
    fontWeight: "900",
    color: "#94A3B8",
  },
  rankTextMe: {
    color: "#166534",
  },
  avatarSmall: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarSmallText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#334155",
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  userNameMe: {
    color: "#166534",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  chevronBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  stickyWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyIconWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
});