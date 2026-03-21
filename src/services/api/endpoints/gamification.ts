import apiClient from "@/src/services/api/apiClient";
import { getAuthConfig } from "@/src/services/api/authHeaders";

export const gamificationApi = {
  async getProfile() {
    const authConfig = await getAuthConfig();
    const response = await apiClient.get("/v1/gamification/profile", authConfig);
    return response.data;
  },

  async getStatistics() {
    const authConfig = await getAuthConfig();
    const response = await apiClient.get("/v1/gamification/statistics", authConfig);
    return response.data;
  },
};