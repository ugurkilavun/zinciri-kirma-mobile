<<<<<<< HEAD
import { STORAGE_KEYS, storageService } from '@/src/services/storage';
import axios from 'axios';
=======
import axios from 'axios';
import { storageService, STORAGE_KEYS } from '@/src/services/storage';
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

<<<<<<< HEAD

apiClient.interceptors.request.use(async (config) => {
  const token = await storageService.get<string>(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
=======
// // Her isteğe token ekle
// apiClient.interceptors.request.use(async (config) => {
//   const token = await storageService.get<string>(STORAGE_KEYS.AUTH.ACCESS_TOKEN);
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
>>>>>>> fed558303fcd769b3e8e6893d4b6ebdbc8f54c3c

export default apiClient;