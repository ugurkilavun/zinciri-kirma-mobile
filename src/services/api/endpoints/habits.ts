import apiClient from "../apiClient";

export const habitsApi = {
  getAll: async (config?: any) => {
    const response = await apiClient.get("/v1/habits", config);
    return response.data;
  },

  getOne: async (habitId: string, config?: any) => {
    const response = await apiClient.get(`/v1/habits/${habitId}`, config);
    return response.data;
  },

  getCalendar: async (habitId: string, month: string, config?: any) => {
    const response = await apiClient.get(
      `/v1/habits/${habitId}/calendar?month=${month}`,
      config,
    );
    return response.data;
  },
};