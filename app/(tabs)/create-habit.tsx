import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
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
import { useHabits } from "@/src/context/HabitContext";

const emojiOptions = ["🏋️", "📚", "🧠", "💧", "🧘", "🎯", "🏃", "✍️"];
const colorOptions = ["#FF5A5F", "#A855F7", "#06B6D4", "#22C55E", "#F59E0B", "#3B82F6"];

export default function CreateHabitScreen() {
  const { addHabit } = useHabits();

  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [color, setColor] = useState("#22C55E");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily");
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const handleSave = () => {
    if (!title.trim()) return;

    addHabit({
      title: title.trim(),
      emoji,
      color,
      frequency,
      reminderEnabled,
      goal: frequency === "daily" ? 1 : 7,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.title}>Yeni Aliskanlik</Text>
        <Text style={styles.subtitle}>Kendi hedefini olustur ve serini baslat</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Aliskanlik adi</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Orn. 20 dakika kitap oku"
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
            {["daily", "weekly", "custom"].map((item) => {
              const active = frequency === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                  onPress={() => setFrequency(item as "daily" | "weekly" | "custom")}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {item === "daily" ? "Gunluk" : item === "weekly" ? "Haftalik" : "Ozel"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Hatirlatici</Text>
            <Switch value={reminderEnabled} onValueChange={setReminderEnabled} />
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <Button onPress={handleSave}>Kaydet</Button>
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