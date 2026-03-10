export const STORAGE_KEYS = {
  AUTH: {
    FIRST_LAUNCH: "auth.firstLaunch",
    ACCESS_TOKEN: "auth.access_token",
    REFRESH_TOKEN: "auth.refresh_token",
    ROLE: "auth.role",
  },
  SETTINGS: {
    THEME: "settings.theme",
    LANGUAGE: "settings.language",
  },
} as const;