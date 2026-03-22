import apiClient from "../apiClient";
import { getAuthConfig } from "../authHeaders";

export const leaderboardApi = {
  async getLeaderboard(period: "weekly" | "monthly" | "all_time") {
    const authConfig = await getAuthConfig();
    const response = await apiClient.get(`/v1/leaderboard?period=${period}`, authConfig);
    return response.data;
  }
};