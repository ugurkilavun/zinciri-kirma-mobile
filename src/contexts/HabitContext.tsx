import React, { createContext, useContext, useMemo, useState } from "react";

export type Habit = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  frequency: "daily" | "weekly" | "custom";
  reminderEnabled: boolean;
  completed: boolean;
  progress: number;
  goal: number;
  streak: number;
};

type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "completed" | "progress" | "streak">) => void;
  toggleHabit: (id: string) => void;
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "30 dakika spor",
      emoji: "🏋️",
      color: "#FF5A5F",
      frequency: "daily",
      reminderEnabled: true,
      completed: false,
      progress: 0,
      goal: 30,
      streak: 14,
    },
    {
      id: "2",
      title: "Kitap okuma",
      emoji: "📚",
      color: "#A855F7",
      frequency: "daily",
      reminderEnabled: true,
      completed: true,
      progress: 20,
      goal: 20,
      streak: 8,
    },
  ]);

  const addHabit = (
    habit: Omit<Habit, "id" | "completed" | "progress" | "streak">
  ) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completed: false,
      progress: 0,
      streak: 0,
    };

    setHabits((prev) => [newHabit, ...prev]);
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              progress: !habit.completed ? habit.goal : 0,
              streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1),
            }
          : habit
      )
    );
  };

  const value = useMemo(
    () => ({
      habits,
      addHabit,
      toggleHabit,
    }),
    [habits]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used inside HabitProvider");
  }
  return context;
}