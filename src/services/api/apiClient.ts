import { STORAGE_KEYS, storageService } from '@/src/services/storage';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});


apiClient.interceptors.request.use(async (config) => {
  const token = await storageService.get<string>(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;