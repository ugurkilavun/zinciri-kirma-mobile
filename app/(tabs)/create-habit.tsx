import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import apiClient from "@/src/services/api/apiClient";
import { getAuthConfig } from "@/src/services/api/authHeaders";

const emojiOptions = ["🏋️", "📚", "🧠", "💧", "🧘", "🎯", "🏃", "✍️"];
const colorOptions = [
  "#FF5A5F",
  "#A855F7",
  "#06B6D4",
  "#22C55E",
  "#F59E0B",
  "#3B82F6",
];

type FrequencyOption = "daily" | "weekly" | "custom";

export default function CreateHabitScreen() {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [color, setColor] = useState("#22C55E");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily");
  const [goal, setGoal] = useState("1");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const frequencyHint = useMemo(() => {
    if (frequency === "daily") return "Her gun kac kez / birim yapmak istiyorsun?";
    if (frequency === "weekly") return "Haftada kac kez yapmak istiyorsun?";
    if (frequency === "custom") return "Hedef sayisi nedir?";
    return "Hedef sayisi nedir?";
  }, [frequency]);

  const backendFrequency = useMemo(() => {
    if (frequency === "daily") return "daily";
    if (frequency === "weekly") return "weekly";
    if (frequency === "custom") return "custom";
    return "daily";
  }, [frequency]);

  const parsedGoal = useMemo(() => {
    const value = Number(goal);
    if (Number.isNaN(value) || value < 1) return 1;
    return Math.floor(value);
  }, [goal]);

  const handleSave = async () => {
    if (!title.trim()) {
      console.log("frequency:", frequency, "goal:", goal);
      Alert.alert("Uyari", "Lutfen bir aliskanlik adi gir.");
      return;
    }

    if (!goal.trim() || Number(goal) < 1) {
      Alert.alert("Uyari", "Lutfen gecerli bir hedef sayisi gir.");
      return;
    }

    try {
      setLoading(true);

      const authConfig = await getAuthConfig();

      await apiClient.post(
        "/v1/habits",
        {
          title: title.trim(),
          emoji,
          color,
          frequency: backendFrequency.toLowerCase().trim(),
          reminderEnabled,
          goal: parsedGoal,
        },
        authConfig,
      );

      Alert.alert("Basarili", "Aliskanlik olusturuldu.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.log("Create habit error:", error?.response?.data || error);

      const message = error?.response?.data?.message;

      Alert.alert(
        "Hata",
        Array.isArray(message) ? message.join("\n") : message || "Aliskanlik olusturulamadi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.title}>Yeni Aliskanlik</Text>
        <Text style={styles.subtitle}>
          Gunluk, haftalik veya özel bir hedef olustur
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Aliskanlik adi</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Orn. Kitap oku"
            style={styles.input}
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Ikon sec</Text>
          <View style={styles.emojiRow}>
            {emojiOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.emojiBox, emoji === item && styles.selectedBox]}
                onPress={() => setEmoji(item)}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Renk sec</Text>
          <View style={styles.colorRow}>
            {colorOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.colorDot,
                  { backgroundColor: item },
                  color === item && styles.selectedColorDot,
                ]}
                onPress={() => setColor(item)}
              />
            ))}
          </View>

          <Text style={styles.label}>Siklik</Text>
          <View style={styles.segmentRow}>
            {[
              { key: "daily", label: "Gunluk" },
              { key: "weekly", label: "Haftalik" },
              { key: "custom", label: "custom" },
            ].map((item) => {
              const active = frequency === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => setFrequency(item.key as FrequencyOption)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Hedef sayisi</Text>
          <Text style={styles.helperText}>{frequencyHint}</Text>
          <TextInput
            value={goal}
            onChangeText={(text) => setGoal(text.replace(/[^0-9]/g, ""))}
            placeholder="1"
            keyboardType="numeric"
            style={styles.input}
            placeholderTextColor="#94A3B8"
          />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Hatirlatici</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
            />
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Button onPress={handleSave} disabled={!title.trim() || loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F8FA" },
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
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
  subtitle: { marginTop: 6, fontSize: 15, color: "#64748B", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
    marginTop: 12,
  },
  helperText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
    marginTop: -2,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
    fontSize: 16,
  },
  emojiRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  emojiBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  selectedBox: {
    borderColor: "#58cc02",
    backgroundColor: "#F0FDF4",
  },
  emojiText: { fontSize: 24 },
  colorRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedColorDot: {
    borderWidth: 3,
    borderColor: "#0F172A",
  },
  segmentRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  segmentBtnActive: {
    backgroundColor: "#58cc02",
    borderColor: "#58cc02",
  },
  segmentText: {
    color: "#475569",
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#fff",
  },
  switchRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});