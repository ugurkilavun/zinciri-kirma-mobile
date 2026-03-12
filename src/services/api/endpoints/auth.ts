import apiClient from '../apiClient';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/v1/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    apiClient.post("/v1/auth/register", { name, email, password }),
};