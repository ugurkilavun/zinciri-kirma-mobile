import axios from "axios";
import { STORAGE_KEYS, storageService } from "@/src/services/storage";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storageService.get<string>(STORAGE_KEYS.AUTH.ACCESS_TOKEN);

  console.log("API İsteği Yapılıyor, Token:", token);
  console.log("API url:", process.env.EXPO_PUBLIC_API_URL);

  if (token) {
    if (config.headers && typeof (config.headers as any).set === "function") {
      (config.headers as any).set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API RESPONSE ERROR:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;