import { STORAGE_KEYS, storageService } from "@/src/services/storage";

export async function getAuthConfig() {
  const token = await storageService.get<string>(STORAGE_KEYS.AUTH.ACCESS_TOKEN);

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}