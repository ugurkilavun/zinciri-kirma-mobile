import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  set: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  get: async <T>(key: string): Promise<T | null> => {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};