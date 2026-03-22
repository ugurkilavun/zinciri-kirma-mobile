import apiClient from "../apiClient";

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/v1/auth/login", { email, password }),

  googleLogin: (idToken: string) =>
    apiClient.post("/v1/auth/google/mobile", { idToken }),

  appleLogin: (payload: {
    idToken: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }) => apiClient.post("/v1/auth/apple/mobile", payload),
};